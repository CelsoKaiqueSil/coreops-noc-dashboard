CREATE SCHEMA IF NOT EXISTS coreops_demo;

CREATE TABLE IF NOT EXISTS coreops_demo.link_inventory (
    link_id BIGSERIAL PRIMARY KEY,
    host_name TEXT NOT NULL,
    interface_name TEXT NOT NULL,
    unit_name TEXT NOT NULL,
    city TEXT NOT NULL,
    state CHAR(2) NOT NULL,
    regional TEXT NOT NULL,
    operator_name TEXT NOT NULL,
    circuit_id TEXT NOT NULL,
    ip_address INET,
    technology TEXT,
    speed_mbps INTEGER CHECK (speed_mbps >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (host_name, interface_name)
);

CREATE TABLE IF NOT EXISTS coreops_demo.monitoring_events (
    event_id TEXT PRIMARY KEY,
    host_name TEXT NOT NULL,
    interface_name TEXT,
    circuit_hint TEXT,
    event_name TEXT NOT NULL,
    event_status TEXT NOT NULL CHECK (event_status IN ('PROBLEM', 'RECOVERY')),
    event_time TIMESTAMPTZ NOT NULL,
    severity SMALLINT NOT NULL DEFAULT 0,
    source_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coreops_demo.incidents (
    incident_id TEXT PRIMARY KEY,
    source_event_id TEXT NOT NULL REFERENCES coreops_demo.monitoring_events(event_id),
    link_id BIGINT REFERENCES coreops_demo.link_inventory(link_id),
    opened_at TIMESTAMPTZ NOT NULL,
    closed_at TIMESTAMPTZ,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 0),
    match_method TEXT NOT NULL,
    assignee TEXT,
    protocol TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_host_interface_time
    ON coreops_demo.monitoring_events (host_name, interface_name, event_time DESC);

CREATE INDEX IF NOT EXISTS idx_incidents_link_opened
    ON coreops_demo.incidents (link_id, opened_at DESC);

CREATE INDEX IF NOT EXISTS idx_incidents_active
    ON coreops_demo.incidents (opened_at DESC)
    WHERE closed_at IS NULL;

