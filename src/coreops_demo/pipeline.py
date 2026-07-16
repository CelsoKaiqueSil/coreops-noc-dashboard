"""Reproducible synthetic ETL used by the public CoreOps dashboard.

The module mirrors the data-engineering decisions of the operational project
without connecting to corporate systems. All input files are synthetic and
safe to publish.
"""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable

import pandas as pd


DEFAULT_AS_OF = "2026-07-15T12:00:00-03:00"
NOISE_PATTERNS = (
    "PACKET LOSS",
    "PROBE INTERNET",
    "PROBE_INTERNET",
    "TUNNEL",
    "VPN",
    "DNS TEST",
)
REQUIRED_EVENT_COLUMNS = {
    "event_id",
    "host_name",
    "interface_name",
    "circuit_hint",
    "event_name",
    "status",
    "event_time",
    "severity",
    "assignee",
    "protocol",
}
REQUIRED_INVENTORY_COLUMNS = {
    "host_name",
    "interface_name",
    "unit",
    "city",
    "state",
    "regional",
    "operator",
    "circuit",
    "ip",
    "technology",
    "speed_mbps",
}
OPERATOR_COLORS = ("#0b83a6", "#d67a00", "#6d45c6", "#1b8b57", "#c62832")
MONTH_LABELS_PT_BR = ("Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez")


@dataclass(frozen=True)
class PipelineArtifacts:
    incidents: Path
    provider_kpis: Path
    quality_summary: Path
    dashboard_json: Path
    dashboard_javascript: Path


def normalize_key(value: object) -> str:
    """Create a stable comparison key for names, hosts and circuit ids."""
    if value is None or pd.isna(value):
        return ""
    normalized = unicodedata.normalize("NFKD", str(value))
    ascii_text = "".join(char for char in normalized if not unicodedata.combining(char))
    return re.sub(r"[^A-Z0-9]+", "", ascii_text.upper())


def _validate_columns(frame: pd.DataFrame, required: set[str], source: Path) -> None:
    missing = sorted(required.difference(frame.columns))
    if missing:
        raise ValueError(f"{source.name}: colunas obrigatorias ausentes: {', '.join(missing)}")


def load_sources(input_dir: Path) -> tuple[pd.DataFrame, pd.DataFrame]:
    events_path = input_dir / "events.csv"
    inventory_path = input_dir / "link_inventory.csv"
    events = pd.read_csv(events_path, dtype=str, keep_default_na=False)
    inventory = pd.read_csv(inventory_path, dtype=str, keep_default_na=False)
    _validate_columns(events, REQUIRED_EVENT_COLUMNS, events_path)
    _validate_columns(inventory, REQUIRED_INVENTORY_COLUMNS, inventory_path)

    events["event_time"] = pd.to_datetime(events["event_time"], utc=True, errors="raise")
    events["severity"] = pd.to_numeric(events["severity"], errors="coerce").fillna(0).astype(int)
    events["status"] = events["status"].str.strip().str.upper()
    inventory["speed_mbps"] = pd.to_numeric(inventory["speed_mbps"], errors="coerce").fillna(0).astype(int)

    for frame in (events, inventory):
        frame["host_key"] = frame["host_name"].map(normalize_key)
        frame["interface_key"] = frame["interface_name"].map(normalize_key)
    events["circuit_key"] = events["circuit_hint"].map(normalize_key)
    inventory["circuit_key"] = inventory["circuit"].map(normalize_key)
    return events, inventory


def filter_operational_events(events: pd.DataFrame) -> pd.DataFrame:
    names = events["event_name"].map(normalize_key)
    noise_mask = names.map(lambda value: any(pattern.replace(" ", "") in value for pattern in NOISE_PATTERNS))
    relevant_mask = events["status"].isin({"PROBLEM", "RECOVERY"})
    return events.loc[relevant_mask & ~noise_mask].copy()


def deduplicate_events(events: pd.DataFrame) -> pd.DataFrame:
    ordered = events.sort_values(["event_time", "event_id"]).copy()
    ordered["event_minute"] = ordered["event_time"].dt.floor("min")
    ordered["fingerprint"] = (
        ordered["host_key"]
        + "|"
        + ordered["interface_key"]
        + "|"
        + ordered["status"]
        + "|"
        + ordered["event_minute"].astype(str)
    )
    return ordered.drop_duplicates("fingerprint", keep="first").drop(columns=["event_minute", "fingerprint"])


def enrich_events(events: pd.DataFrame, inventory: pd.DataFrame) -> pd.DataFrame:
    inventory_columns = [
        "host_key",
        "interface_key",
        "circuit_key",
        "unit",
        "city",
        "state",
        "regional",
        "operator",
        "circuit",
        "ip",
        "technology",
        "speed_mbps",
    ]
    inventory_unique = inventory[inventory_columns].drop_duplicates(["host_key", "interface_key"])
    enriched = events.merge(
        inventory_unique,
        how="left",
        on=["host_key", "interface_key"],
        suffixes=("", "_inventory"),
        validate="many_to_one",
    )
    enriched["match_method"] = enriched["unit"].notna().map({True: "host_interface", False: "unmatched"})

    unmatched_index = enriched.index[enriched["unit"].isna() & enriched["circuit_key"].ne("")]
    if len(unmatched_index):
        fallback = inventory[inventory_columns].drop_duplicates("circuit_key").set_index("circuit_key")
        fill_columns = [column for column in inventory_columns if column not in {"host_key", "interface_key", "circuit_key"}]
        for index in unmatched_index:
            key = enriched.at[index, "circuit_key"]
            if key not in fallback.index:
                continue
            for column in fill_columns:
                enriched.at[index, column] = fallback.at[key, column]
            enriched.at[index, "match_method"] = "circuit_fallback"
    return enriched


def build_incidents(events: pd.DataFrame, as_of: pd.Timestamp) -> pd.DataFrame:
    rows: list[dict[str, object]] = []
    matched = events.loc[events["match_method"].ne("unmatched")].sort_values("event_time")
    for (_, _), group in matched.groupby(["host_key", "interface_key"], sort=False):
        open_event: pd.Series | None = None
        for _, event in group.iterrows():
            if event["status"] == "PROBLEM" and open_event is None:
                open_event = event
                continue
            if event["status"] != "RECOVERY" or open_event is None:
                continue
            rows.append(_incident_record(open_event, event, as_of))
            open_event = None
        if open_event is not None:
            rows.append(_incident_record(open_event, None, as_of))

    incidents = pd.DataFrame(rows)
    if incidents.empty:
        return incidents
    return incidents.sort_values(["opened_at", "incident_id"], ascending=[False, True]).reset_index(drop=True)


def _incident_record(open_event: pd.Series, recovery: pd.Series | None, as_of: pd.Timestamp) -> dict[str, object]:
    closed_at = recovery["event_time"] if recovery is not None else pd.NaT
    end_time = recovery["event_time"] if recovery is not None else as_of
    duration = max(0, round((end_time - open_event["event_time"]).total_seconds() / 60))
    return {
        "incident_id": f"INC-{open_event['event_id']}",
        "source_event_id": open_event["event_id"],
        "host_name": open_event["host_name"],
        "interface_name": open_event["interface_name"],
        "unit": open_event["unit"],
        "city": open_event["city"],
        "state": open_event["state"],
        "regional": open_event["regional"],
        "operator": open_event["operator"],
        "circuit": open_event["circuit"],
        "ip": open_event["ip"],
        "technology": open_event["technology"],
        "speed_mbps": int(open_event["speed_mbps"]),
        "opened_at": open_event["event_time"],
        "closed_at": closed_at,
        "duration_minutes": int(duration),
        "is_active": recovery is None,
        "severity": int(open_event["severity"]),
        "assignee": open_event["assignee"].strip(),
        "protocol": open_event["protocol"].strip(),
        "event_name": open_event["event_name"],
        "match_method": open_event["match_method"],
    }


def build_provider_kpis(
    incidents: pd.DataFrame,
    inventory: pd.DataFrame,
    as_of: pd.Timestamp,
) -> pd.DataFrame:
    link_counts = inventory.groupby("operator").size().rename("monitored_links")
    if incidents.empty:
        return link_counts.reset_index()

    period_start = as_of - pd.Timedelta(days=30)
    period = incidents.loc[incidents["opened_at"].ge(period_start)].copy()
    resolved = period.loc[~period["is_active"]]
    grouped = period.groupby("operator").agg(
        incident_count=("incident_id", "count"),
        total_downtime_minutes=("duration_minutes", "sum"),
        active_incidents=("is_active", "sum"),
    )
    mttr = resolved.groupby("operator")["duration_minutes"].mean().round().rename("mttr_minutes")
    result = grouped.join(mttr, how="left").join(link_counts, how="outer").fillna(0).reset_index()
    capacity = result["monitored_links"].clip(lower=1) * 30 * 24 * 60
    result["availability_pct"] = ((capacity - result["total_downtime_minutes"]) / capacity * 100).clip(0, 100).round(3)
    for column in ("incident_count", "total_downtime_minutes", "active_incidents", "mttr_minutes", "monitored_links"):
        result[column] = result[column].round().astype(int)
    return result.sort_values(["incident_count", "operator"], ascending=[False, True]).reset_index(drop=True)


def build_quality_summary(
    raw_events: pd.DataFrame,
    operational_events: pd.DataFrame,
    deduplicated_events: pd.DataFrame,
    enriched_events: pd.DataFrame,
    incidents: pd.DataFrame,
) -> dict[str, int]:
    matches = enriched_events["match_method"].value_counts().to_dict()
    return {
        "raw_events": int(len(raw_events)),
        "operational_events": int(len(operational_events)),
        "noise_discarded": int(len(raw_events) - len(operational_events)),
        "duplicates_removed": int(len(operational_events) - len(deduplicated_events)),
        "host_interface_matches": int(matches.get("host_interface", 0)),
        "circuit_fallback_matches": int(matches.get("circuit_fallback", 0)),
        "unmatched_events": int(matches.get("unmatched", 0)),
        "incidents_built": int(len(incidents)),
    }


def build_dashboard_payload(
    incidents: pd.DataFrame,
    inventory: pd.DataFrame,
    provider_kpis: pd.DataFrame,
    quality: dict[str, int],
    as_of: pd.Timestamp,
) -> dict[str, object]:
    active = incidents.loc[incidents["is_active"]].copy()
    active_down = active.groupby("unit")["interface_name"].nunique().to_dict()
    links_total = inventory.groupby("unit")["interface_name"].nunique().to_dict()

    dashboard_incidents: list[dict[str, object]] = []
    for _, incident in active.sort_values("duration_minutes", ascending=False).iterrows():
        down = int(active_down.get(incident["unit"], 1))
        total = int(links_total.get(incident["unit"], 1))
        isolated = down >= total
        duration = int(incident["duration_minutes"])
        assignee = incident["assignee"] or "Sem responsável"
        priority = "critical" if isolated or incident["severity"] >= 4 or duration >= 1440 else "high" if duration >= 60 else "moderate"
        sla = "overdue" if duration >= 300 else "risk" if duration >= 180 else "ok"
        status = "Aguardando operadora" if incident["protocol"] else "Inicial" if assignee == "Sem responsável" else "Em triagem"
        next_action = "Atribuir responsável" if assignee == "Sem responsável" else "Cobrar previsão da operadora" if incident["protocol"] else "Validar impacto e abrir chamado"
        opened_at = incident["opened_at"].isoformat()
        dashboard_incidents.append(
            {
                "id": incident["incident_id"],
                "unit": incident["unit"],
                "city": incident["city"],
                "state": incident["state"],
                "regional": incident["regional"],
                "operator": incident["operator"],
                "circuit": incident["circuit"],
                "ip": incident["ip"],
                "technology": incident["technology"],
                "speed": f"{int(incident['speed_mbps'])} Mbps",
                "startedAt": opened_at,
                "durationMinutes": duration,
                "priority": priority,
                "isolated": bool(isolated),
                "sla": sla,
                "assignee": assignee,
                "status": status,
                "nextAction": next_action,
                "event": incident["event_name"],
                "protocol": incident["protocol"],
                "linksTotal": total,
                "linksDown": down,
                "history": [
                    {
                        "time": incident["opened_at"].tz_convert("America/Sao_Paulo").strftime("%d/%m, %H:%M"),
                        "author": "Pipeline sintético",
                        "status": "Detectado",
                        "text": f"Evento normalizado e enriquecido por {incident['match_method']}.",
                    }
                ],
            }
        )

    months = pd.period_range(end=as_of.tz_localize(None).to_period("M"), periods=6, freq="M")
    incident_months = incidents["opened_at"].dt.tz_convert("America/Sao_Paulo").dt.tz_localize(None).dt.to_period("M")
    monthly_counts = incident_months.value_counts().to_dict()
    monthly_data = [
        {"month": MONTH_LABELS_PT_BR[period.month - 1], "value": int(monthly_counts.get(period, 0))}
        for period in months
    ]

    operator_meta: dict[str, dict[str, object]] = {}
    for index, row in provider_kpis.iterrows():
        operator_meta[row["operator"]] = {
            "color": OPERATOR_COLORS[index % len(OPERATOR_COLORS)],
            "mttr": int(row["mttr_minutes"]),
            "monthly": int(row["incident_count"]),
            "availability": float(row["availability_pct"]),
        }

    return {
        "metadata": {
            "generatedAt": as_of.isoformat(),
            "dataPolicy": "100% synthetic",
            "pipeline": "Python + Pandas + CSV + PostgreSQL reference model",
            "quality": quality,
        },
        "operatorMeta": operator_meta,
        "incidents": dashboard_incidents,
        "monthlyData": monthly_data,
    }


def run_pipeline(input_dir: Path, output_dir: Path, as_of: str = DEFAULT_AS_OF) -> PipelineArtifacts:
    output_dir.mkdir(parents=True, exist_ok=True)
    as_of_timestamp = pd.Timestamp(as_of).tz_convert("UTC")
    raw_events, inventory = load_sources(input_dir)
    operational = filter_operational_events(raw_events)
    deduplicated = deduplicate_events(operational)
    enriched = enrich_events(deduplicated, inventory)
    incidents = build_incidents(enriched, as_of_timestamp)
    provider_kpis = build_provider_kpis(incidents, inventory, as_of_timestamp)
    quality = build_quality_summary(raw_events, operational, deduplicated, enriched, incidents)
    dashboard = build_dashboard_payload(incidents, inventory, provider_kpis, quality, as_of_timestamp)

    artifacts = PipelineArtifacts(
        incidents=output_dir / "incidents.csv",
        provider_kpis=output_dir / "provider_kpis.csv",
        quality_summary=output_dir / "quality_summary.json",
        dashboard_json=output_dir / "dashboard_data.json",
        dashboard_javascript=output_dir / "dashboard_data.js",
    )
    serializable_incidents = incidents.copy()
    if not serializable_incidents.empty:
        for column in ("opened_at", "closed_at"):
            serializable_incidents[column] = serializable_incidents[column].map(
                lambda value: "" if pd.isna(value) else value.isoformat()
            )
    serializable_incidents.to_csv(artifacts.incidents, index=False)
    provider_kpis.to_csv(artifacts.provider_kpis, index=False)
    artifacts.quality_summary.write_text(json.dumps(quality, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    dashboard_json = json.dumps(dashboard, ensure_ascii=False, indent=2)
    artifacts.dashboard_json.write_text(dashboard_json + "\n", encoding="utf-8")
    artifacts.dashboard_javascript.write_text(
        "window.COREOPS_DEMO_DATA = " + dashboard_json + ";\n",
        encoding="utf-8",
    )
    return artifacts


def parse_args(argv: Iterable[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Executa o ETL sintético do portfólio CoreOps.")
    parser.add_argument("--input-dir", type=Path, default=Path("data/raw"))
    parser.add_argument("--output-dir", type=Path, default=Path("data/processed"))
    parser.add_argument("--as-of", default=DEFAULT_AS_OF, help="Instante de referência ISO-8601.")
    return parser.parse_args(argv)


def main(argv: Iterable[str] | None = None) -> int:
    args = parse_args(argv)
    artifacts = run_pipeline(args.input_dir, args.output_dir, args.as_of)
    print("Pipeline concluido.")
    for artifact in artifacts.__dict__.values():
        print(artifact)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
