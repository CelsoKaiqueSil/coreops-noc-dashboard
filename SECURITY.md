# Security policy

This repository is a public portfolio demonstration. It must never contain
production credentials, internal addresses, customer identifiers, exports,
real incident data, or screenshots from the operational environment.

## Public-data rules

- All people, units, operators, circuits, events, and addresses are fictional.
- IP addresses use documentation-only ranges from RFC 5737.
- The demo does not connect to Zabbix, PostgreSQL, OneDrive, or any internal API.
- Local updates are stored only in the browser through `localStorage`.
- Production deployment scripts and server configuration are intentionally absent.

## Before every publication

Run the checklist in [`docs/PUBLICATION_CHECKLIST.md`](docs/PUBLICATION_CHECKLIST.md).
If a secret is ever committed, revoke it first and then rewrite the Git history.

