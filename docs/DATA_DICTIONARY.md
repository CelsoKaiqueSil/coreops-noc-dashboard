# Dicionário de dados

## `data/raw/events.csv`

| Campo | Descrição |
| --- | --- |
| `event_id` | Identificador sintético do evento. |
| `host_name` | Equipamento que originou o alerta. |
| `interface_name` | Interface de rede informada pelo monitoramento. |
| `circuit_hint` | Identificador auxiliar usado no matching em fallback. |
| `event_name` | Texto do evento técnico. |
| `status` | `PROBLEM` ou `RECOVERY`. |
| `event_time` | Data e hora ISO-8601 com fuso. |
| `severity` | Escala numérica de criticidade. |
| `assignee` | Responsável sintético, quando existente. |
| `protocol` | Protocolo fictício de atendimento. |

## `data/raw/link_inventory.csv`

Contém a dimensão sintética de links: unidade, localização, regional, operadora,
circuito, endereço IP reservado para documentação, tecnologia e velocidade.

## Artefatos processados

- `incidents.csv`: incidentes pareados e enriquecidos.
- `provider_kpis.csv`: volume, MTTR, indisponibilidade e disponibilidade por operadora.
- `quality_summary.json`: auditoria do pipeline.
- `dashboard_data.json`: contrato de dados legível por outras aplicações.
- `dashboard_data.js`: mesmo contrato carregado diretamente pela demonstração web.
