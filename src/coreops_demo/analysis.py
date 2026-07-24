"""Exploratory analysis for the synthetic CoreOps incident dataset.

The module turns pipeline artifacts into a small, reproducible business case:
descriptive statistics, provider and regional comparisons, temporal trends,
correlations, charts, conclusions and actionable recommendations.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from html import escape
from pathlib import Path
from typing import Iterable

import pandas as pd


@dataclass(frozen=True)
class AnalysisArtifacts:
    report: Path
    descriptive_statistics: Path
    provider_summary: Path
    regional_summary: Path
    monthly_trend: Path
    correlation_summary: Path
    provider_chart: Path
    monthly_chart: Path


def load_incidents(path: Path) -> pd.DataFrame:
    """Load and validate the incident table produced by the ETL."""
    incidents = pd.read_csv(path)
    required = {
        "incident_id",
        "operator",
        "regional",
        "opened_at",
        "duration_minutes",
        "is_active",
        "severity",
        "speed_mbps",
    }
    missing = sorted(required.difference(incidents.columns))
    if missing:
        raise ValueError(f"{path.name}: colunas obrigatórias ausentes: {', '.join(missing)}")
    if incidents.empty:
        raise ValueError(f"{path.name}: nenhum incidente disponível para análise")

    incidents["opened_at"] = pd.to_datetime(incidents["opened_at"], utc=True, errors="raise")
    for column in ("duration_minutes", "severity", "speed_mbps"):
        incidents[column] = pd.to_numeric(incidents[column], errors="raise")
    incidents["is_active"] = (
        incidents["is_active"].astype(str).str.strip().str.lower().map({"true": True, "false": False})
    )
    if incidents["is_active"].isna().any():
        raise ValueError(f"{path.name}: valores inválidos na coluna is_active")
    return incidents


def build_descriptive_statistics(incidents: pd.DataFrame) -> pd.DataFrame:
    durations = incidents["duration_minutes"]
    active_count = int(incidents["is_active"].sum())
    values = [
        ("Incidentes", len(incidents), "contagem"),
        ("Incidentes ativos", active_count, "contagem"),
        ("Participação de ativos", active_count / len(incidents) * 100, "%"),
        ("Duração média", durations.mean(), "minutos"),
        ("Duração mediana", durations.median(), "minutos"),
        ("Percentil 75 da duração", durations.quantile(0.75), "minutos"),
        ("Percentil 90 da duração", durations.quantile(0.90), "minutos"),
        ("Maior duração", durations.max(), "minutos"),
        ("Indisponibilidade acumulada", durations.sum() / 60, "horas"),
        ("Severidade média", incidents["severity"].mean(), "escala 0-5"),
    ]
    return pd.DataFrame(values, columns=["metric", "value", "unit"]).assign(
        value=lambda frame: frame["value"].round(2)
    )


def _group_summary(incidents: pd.DataFrame, dimension: str) -> pd.DataFrame:
    grouped = incidents.groupby(dimension, dropna=False).agg(
        incident_count=("incident_id", "nunique"),
        active_incidents=("is_active", "sum"),
        total_downtime_minutes=("duration_minutes", "sum"),
        avg_duration_minutes=("duration_minutes", "mean"),
        median_duration_minutes=("duration_minutes", "median"),
        p90_duration_minutes=("duration_minutes", lambda values: values.quantile(0.90)),
        avg_severity=("severity", "mean"),
    )
    grouped["downtime_share_pct"] = (
        grouped["total_downtime_minutes"] / grouped["total_downtime_minutes"].sum() * 100
    )
    integer_columns = ("incident_count", "active_incidents", "total_downtime_minutes")
    grouped[list(integer_columns)] = grouped[list(integer_columns)].round().astype(int)
    decimal_columns = (
        "avg_duration_minutes",
        "median_duration_minutes",
        "p90_duration_minutes",
        "avg_severity",
        "downtime_share_pct",
    )
    grouped[list(decimal_columns)] = grouped[list(decimal_columns)].round(2)
    return grouped.reset_index().sort_values(
        ["total_downtime_minutes", "incident_count", dimension],
        ascending=[False, False, True],
    )


def build_monthly_trend(incidents: pd.DataFrame) -> pd.DataFrame:
    local_opened_at = incidents["opened_at"].dt.tz_convert("America/Sao_Paulo")
    monthly = incidents.assign(month=local_opened_at.dt.strftime("%Y-%m")).groupby("month").agg(
        incident_count=("incident_id", "nunique"),
        active_incidents=("is_active", "sum"),
        total_downtime_minutes=("duration_minutes", "sum"),
        avg_duration_minutes=("duration_minutes", "mean"),
    )
    monthly["avg_duration_minutes"] = monthly["avg_duration_minutes"].round(2)
    return monthly.reset_index().sort_values("month")


def build_correlation_summary(incidents: pd.DataFrame) -> pd.DataFrame:
    pairs = [
        ("severity", "duration_minutes"),
        ("speed_mbps", "duration_minutes"),
    ]
    rows = []
    for first, second in pairs:
        coefficient = incidents[first].corr(incidents[second])
        rows.append(
            {
                "variable_x": first,
                "variable_y": second,
                "pearson_correlation": 0.0 if pd.isna(coefficient) else round(float(coefficient), 3),
            }
        )
    return pd.DataFrame(rows)


def _format_value(value: object) -> str:
    if isinstance(value, float):
        if value.is_integer():
            return str(int(value))
        return f"{value:.2f}".replace(".", ",")
    return str(value)


def _decimal_pt(value: float, decimals: int = 2) -> str:
    return f"{value:.{decimals}f}".replace(".", ",")


def _markdown_table(frame: pd.DataFrame, labels: dict[str, str] | None = None) -> str:
    labels = labels or {}
    columns = list(frame.columns)
    header = "| " + " | ".join(labels.get(column, column) for column in columns) + " |"
    separator = "| " + " | ".join("---" for _ in columns) + " |"
    rows = [
        "| " + " | ".join(_format_value(value) for value in row) + " |"
        for row in frame.itertuples(index=False, name=None)
    ]
    return "\n".join([header, separator, *rows])


def _write_bar_chart(data: pd.DataFrame, label: str, value: str, title: str, path: Path) -> None:
    width, height = 920, 440
    margin_left, margin_right, margin_top, margin_bottom = 190, 44, 70, 55
    plot_width = width - margin_left - margin_right
    rows = data.head(8).copy()
    maximum = max(float(rows[value].max()), 1.0)
    gap = 12
    bar_height = max(24, (height - margin_top - margin_bottom - gap * max(len(rows) - 1, 0)) / len(rows))
    pieces = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        f'<title id="title">{escape(title)}</title>',
        '<desc id="desc">Gráfico de barras gerado pelo estudo analítico do portfólio.</desc>',
        '<rect width="100%" height="100%" fill="#f7fafc" rx="18"/>',
        f'<text x="{margin_left}" y="38" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#122d4e">{escape(title)}</text>',
    ]
    for index, row in rows.reset_index(drop=True).iterrows():
        y = margin_top + index * (bar_height + gap)
        numeric = float(row[value])
        bar_width = plot_width * numeric / maximum
        display = f"{numeric:,.0f}".replace(",", ".")
        pieces.extend(
            [
                f'<text x="{margin_left - 12}" y="{y + bar_height * 0.68:.1f}" text-anchor="end" font-family="Arial, sans-serif" font-size="15" fill="#334155">{escape(str(row[label]))}</text>',
                f'<rect x="{margin_left}" y="{y:.1f}" width="{bar_width:.1f}" height="{bar_height:.1f}" rx="6" fill="#1d67bd"/>',
                f'<text x="{margin_left + bar_width + 8:.1f}" y="{y + bar_height * 0.68:.1f}" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#122d4e">{display}</text>',
            ]
        )
    pieces.append(
        f'<text x="{margin_left}" y="{height - 20}" font-family="Arial, sans-serif" font-size="13" fill="#64748b">Fonte: dados sintéticos gerados pelo pipeline CoreOps.</text>'
    )
    pieces.append("</svg>")
    path.write_text("\n".join(pieces) + "\n", encoding="utf-8")


def _write_monthly_chart(monthly: pd.DataFrame, path: Path) -> None:
    width, height = 920, 420
    left, right, top, bottom = 72, 42, 70, 72
    plot_width, plot_height = width - left - right, height - top - bottom
    values = monthly["incident_count"].astype(float).tolist()
    maximum = max(max(values, default=1.0), 1.0)
    step = plot_width / max(len(values) - 1, 1)
    points = []
    for index, value in enumerate(values):
        x = left + index * step if len(values) > 1 else left + plot_width / 2
        y = top + plot_height - (value / maximum * plot_height)
        points.append((x, y, value, monthly.iloc[index]["month"]))
    polyline = " ".join(f"{x:.1f},{y:.1f}" for x, y, _, _ in points)
    pieces = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        '<title id="title">Tendência mensal de incidentes</title>',
        '<desc id="desc">Gráfico de linha com a contagem mensal de incidentes sintéticos.</desc>',
        '<rect width="100%" height="100%" fill="#f7fafc" rx="18"/>',
        f'<text x="{left}" y="38" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#122d4e">Tendência mensal de incidentes</text>',
        f'<line x1="{left}" y1="{top + plot_height}" x2="{width - right}" y2="{top + plot_height}" stroke="#94a3b8"/>',
        f'<polyline points="{polyline}" fill="none" stroke="#00796b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
    ]
    for x, y, value, month in points:
        pieces.extend(
            [
                f'<circle cx="{x:.1f}" cy="{y:.1f}" r="7" fill="#ffffff" stroke="#00796b" stroke-width="4"/>',
                f'<text x="{x:.1f}" y="{y - 14:.1f}" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#122d4e">{int(value)}</text>',
                f'<text x="{x:.1f}" y="{top + plot_height + 29}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#475569">{escape(str(month))}</text>',
            ]
        )
    pieces.append(
        f'<text x="{left}" y="{height - 18}" font-family="Arial, sans-serif" font-size="13" fill="#64748b">A série descreve a amostra sintética; não representa tendência de produção.</text>'
    )
    pieces.append("</svg>")
    path.write_text("\n".join(pieces) + "\n", encoding="utf-8")


def _correlation_interpretation(coefficient: float) -> str:
    magnitude = abs(coefficient)
    strength = "muito fraca" if magnitude < 0.20 else "fraca" if magnitude < 0.40 else "moderada" if magnitude < 0.70 else "forte"
    direction = "positiva" if coefficient > 0 else "negativa" if coefficient < 0 else "nula"
    return f"{strength} e {direction}"


def _build_report(
    incidents: pd.DataFrame,
    descriptive: pd.DataFrame,
    providers: pd.DataFrame,
    regional: pd.DataFrame,
    monthly: pd.DataFrame,
    correlations: pd.DataFrame,
) -> str:
    top_provider = providers.iloc[0]
    top_regional = regional.iloc[0]
    stats = descriptive.set_index("metric")["value"]
    severity_correlation = float(
        correlations.loc[correlations["variable_x"].eq("severity"), "pearson_correlation"].iloc[0]
    )
    provider_labels = {
        "operator": "Operadora",
        "incident_count": "Incidentes",
        "active_incidents": "Ativos",
        "total_downtime_minutes": "Indisp. (min)",
        "avg_duration_minutes": "Média (min)",
        "p90_duration_minutes": "P90 (min)",
        "downtime_share_pct": "Participação (%)",
    }
    regional_labels = {
        "regional": "Regional",
        "incident_count": "Incidentes",
        "total_downtime_minutes": "Indisp. (min)",
        "avg_duration_minutes": "Média (min)",
        "downtime_share_pct": "Participação (%)",
    }
    monthly_labels = {
        "month": "Mês",
        "incident_count": "Incidentes",
        "active_incidents": "Ativos",
        "total_downtime_minutes": "Indisp. (min)",
        "avg_duration_minutes": "Média (min)",
    }
    correlation_labels = {
        "variable_x": "Variável X",
        "variable_y": "Variável Y",
        "pearson_correlation": "Correlação de Pearson",
    }
    return f"""# Estudo analítico: indisponibilidade e desempenho operacional

Este estudo transforma os incidentes sintéticos produzidos pelo pipeline em uma
análise exploratória orientada a decisões. O objetivo é demonstrar estatística
descritiva, segmentação, análise temporal, correlação e comunicação de recomendações.

> **Escopo:** a base é pequena, determinística e 100% sintética. As conclusões
> demonstram o método analítico e não descrevem a operação de nenhuma empresa.

## Perguntas de negócio

1. Quais operadoras concentram mais indisponibilidade e incidentes?
2. Quais regionais merecem priorização por duração acumulada?
3. Como a duração se distribui e qual limiar separa os casos mais longos?
4. Há associação linear entre severidade, capacidade do link e duração?
5. Como o volume varia ao longo dos meses disponíveis?

## Método

- validação de tipos, campos obrigatórios e valores booleanos;
- estatística descritiva com média, mediana e percentis 75 e 90;
- agregações por operadora, regional e mês;
- correlação de Pearson usada apenas como análise exploratória;
- geração automática de CSV, Markdown e gráficos SVG versionáveis.

## Visão geral

{_markdown_table(descriptive, {"metric": "Métrica", "value": "Valor", "unit": "Unidade"})}

## Operadoras

![Indisponibilidade acumulada por operadora](charts/provider_downtime.svg)

{_markdown_table(providers[["operator", "incident_count", "active_incidents", "total_downtime_minutes", "avg_duration_minutes", "p90_duration_minutes", "downtime_share_pct"]], provider_labels)}

## Regionais

{_markdown_table(regional[["regional", "incident_count", "total_downtime_minutes", "avg_duration_minutes", "downtime_share_pct"]], regional_labels)}

## Tendência mensal

![Tendência mensal de incidentes](charts/monthly_incidents.svg)

{_markdown_table(monthly, monthly_labels)}

## Correlações exploratórias

{_markdown_table(correlations, correlation_labels)}

A correlação entre severidade e duração foi **{_decimal_pt(severity_correlation, 3)}**,
classificada nesta amostra como **{_correlation_interpretation(severity_correlation)}**.
Correlação não implica causalidade e a amostra não é adequada para inferência estatística.

## Conclusões

- **{top_provider['operator']}** concentrou a maior indisponibilidade acumulada:
  **{int(top_provider['total_downtime_minutes'])} minutos**
  (**{_decimal_pt(float(top_provider['downtime_share_pct']))}%** da amostra).
- **{top_regional['regional']}** foi a regional com maior duração acumulada,
  somando **{int(top_regional['total_downtime_minutes'])} minutos**.
- A duração mediana foi de **{float(stats['Duração mediana']):.0f} minutos** e o
  percentil 90 foi de **{float(stats['Percentil 90 da duração']):.0f} minutos**;
  os casos acima desse patamar formam a cauda mais crítica da amostra.
- **{int(stats['Incidentes ativos'])} de {len(incidents)} incidentes** estavam ativos
  no instante de referência do pipeline.

## Recomendações

1. Priorizar a revisão dos incidentes da operadora **{top_provider['operator']}** e
   segmentar por circuito e unidade antes de definir uma ação corretiva.
2. Criar um alerta analítico para casos acima do percentil 75
   (**{float(stats['Percentil 75 da duração']):.0f} minutos**) e uma fila crítica
   para ocorrências acima do percentil 90.
3. Acompanhar mensalmente volume, indisponibilidade acumulada e duração mediana;
   usar a mediana junto da média reduz a distorção causada por incidentes extremos.
4. Manter as taxas de matching e duplicidade como critérios de qualidade antes de
   comparar operadoras ou regionais.
5. Em uma base real maior, acrescentar intervalo de confiança, sazonalidade,
   recorrência por circuito e testes de hipótese antes de generalizar decisões.

## Limitações

- amostra propositalmente pequena e sintética;
- recorte temporal fixo para garantir reprodutibilidade;
- ausência de variáveis externas como manutenção, clima e causa raiz;
- associações observadas não demonstram causalidade.

## Reproduzir

```bash
python -m coreops_demo.pipeline
python -m coreops_demo.analysis
```

Os arquivos tabulares desta análise ficam nesta pasta e podem ser auditados ou
reutilizados em Power BI, Excel e notebooks.
"""


def build_analysis(incidents_path: Path, output_dir: Path) -> AnalysisArtifacts:
    """Generate all analytical outputs from a pipeline incident artifact."""
    output_dir.mkdir(parents=True, exist_ok=True)
    chart_dir = output_dir / "charts"
    chart_dir.mkdir(parents=True, exist_ok=True)
    incidents = load_incidents(incidents_path)
    descriptive = build_descriptive_statistics(incidents)
    providers = _group_summary(incidents, "operator")
    regional = _group_summary(incidents, "regional")
    monthly = build_monthly_trend(incidents)
    correlations = build_correlation_summary(incidents)

    artifacts = AnalysisArtifacts(
        report=output_dir / "operational_analysis.md",
        descriptive_statistics=output_dir / "descriptive_statistics.csv",
        provider_summary=output_dir / "provider_analysis.csv",
        regional_summary=output_dir / "regional_analysis.csv",
        monthly_trend=output_dir / "monthly_trend.csv",
        correlation_summary=output_dir / "correlations.csv",
        provider_chart=chart_dir / "provider_downtime.svg",
        monthly_chart=chart_dir / "monthly_incidents.svg",
    )
    descriptive.to_csv(artifacts.descriptive_statistics, index=False)
    providers.to_csv(artifacts.provider_summary, index=False)
    regional.to_csv(artifacts.regional_summary, index=False)
    monthly.to_csv(artifacts.monthly_trend, index=False)
    correlations.to_csv(artifacts.correlation_summary, index=False)
    _write_bar_chart(
        providers,
        label="operator",
        value="total_downtime_minutes",
        title="Indisponibilidade acumulada por operadora (minutos)",
        path=artifacts.provider_chart,
    )
    _write_monthly_chart(monthly, artifacts.monthly_chart)
    artifacts.report.write_text(
        _build_report(incidents, descriptive, providers, regional, monthly, correlations),
        encoding="utf-8",
    )
    return artifacts


def parse_args(argv: Iterable[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Gera o estudo exploratório do portfólio CoreOps.")
    parser.add_argument("--incidents", type=Path, default=Path("data/processed/incidents.csv"))
    parser.add_argument("--output-dir", type=Path, default=Path("analysis"))
    return parser.parse_args(argv)


def main(argv: Iterable[str] | None = None) -> int:
    args = parse_args(argv)
    artifacts = build_analysis(args.incidents, args.output_dir)
    print("Análise concluída.")
    for artifact in artifacts.__dict__.values():
        print(artifact)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
