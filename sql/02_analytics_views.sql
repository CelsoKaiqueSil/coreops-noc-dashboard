CREATE OR REPLACE VIEW coreops_demo.vw_incidents_enriched AS
SELECT
    i.incident_id,
    i.opened_at,
    i.closed_at,
    i.duration_minutes,
    i.match_method,
    i.assignee,
    i.protocol,
    l.unit_name,
    l.city,
    l.state,
    l.regional,
    l.operator_name,
    l.circuit_id,
    l.technology,
    l.speed_mbps,
    i.closed_at IS NULL AS is_active
FROM coreops_demo.incidents AS i
LEFT JOIN coreops_demo.link_inventory AS l
    ON l.link_id = i.link_id;

CREATE OR REPLACE VIEW coreops_demo.vw_provider_kpis_30d AS
WITH period AS (
    SELECT *
    FROM coreops_demo.vw_incidents_enriched
    WHERE opened_at >= now() - interval '30 days'
),
link_capacity AS (
    SELECT operator_name, count(*) AS monitored_links
    FROM coreops_demo.link_inventory
    WHERE is_active
    GROUP BY operator_name
)
SELECT
    p.operator_name,
    count(*) AS incident_count,
    count(*) FILTER (WHERE p.is_active) AS active_incidents,
    round(avg(p.duration_minutes) FILTER (WHERE NOT p.is_active)) AS mttr_minutes,
    sum(p.duration_minutes) AS total_downtime_minutes,
    round(
        100 * (
            1 - sum(p.duration_minutes)::numeric
                / nullif(max(c.monitored_links) * 30 * 24 * 60, 0)
        ),
        3
    ) AS availability_pct
FROM period AS p
JOIN link_capacity AS c USING (operator_name)
GROUP BY p.operator_name
ORDER BY incident_count DESC;
CREATE OR REPLACE VIEW coreops_demo.vw_data_quality AS
SELECT
    match_method,
    count(*) AS incident_count,
    round(100.0 * count(*) / sum(count(*)) OVER (), 2) AS share_pct
FROM coreops_demo.incidents
GROUP BY match_method
ORDER BY incident_count DESC;
