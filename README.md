# CoreOps NOC Dashboard

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](pyproject.toml)
[![Pandas](https://img.shields.io/badge/Pandas-ETL-150458?logo=pandas&logoColor=white)](src/coreops_demo/pipeline.py)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-modelo%20analítico-4169E1?logo=postgresql&logoColor=white)](sql/)
[![Tests](https://img.shields.io/badge/testes-pytest-0A9EDC?logo=pytest&logoColor=white)](tests/)
[![Data](https://img.shields.io/badge/dados-100%25%20sintéticos-14804A)](SECURITY.md)

Portfólio de Dados e Business Intelligence que transforma eventos técnicos de
monitoramento em incidentes enriquecidos, indicadores operacionais e uma dashboard
voltada à tomada de decisão em um NOC.

O repositório não é apenas uma interface: o dataset exibido pela dashboard é gerado
por um pipeline reproduzível em **Python e Pandas**, com normalização, filtro de
ruído, deduplicação, matching em camadas, cálculo de KPIs e artefatos auditáveis.

> **Privacidade:** todos os nomes, circuitos, endereços IP, eventos, protocolos e
> indicadores são fictícios. Não existem credenciais, consultas internas, planilhas
> corporativas ou dados de produção neste repositório.

## O que este projeto comprova

- ingestão e validação de múltiplas fontes CSV;
- limpeza, normalização e deduplicação com Pandas;
- enriquecimento por `host + interface` e fallback por circuito;
- construção de incidentes por pareamento de `PROBLEM` e `RECOVERY`;
- métricas de SLA, MTTR, disponibilidade e qualidade do matching;
- modelo relacional, views analíticas e índices PostgreSQL;
- geração automática do contrato JSON/JavaScript consumido pela dashboard;
- relatório Excel semanal com backup antes da gravação;
- testes unitários e validação contínua no GitHub Actions.

## Fluxo de dados

```mermaid
flowchart LR
    A["Eventos sintéticos"] --> C["ETL Python/Pandas"]
    B["Inventário sintético"] --> C
    C --> D["Qualidade e matching"]
    D --> E["Incidentes e KPIs"]
    E --> F["CSV / JSON / JavaScript"]
    E --> G["Relatório Excel"]
    F --> H["Dashboard web"]
```

A explicação completa está em [Arquitetura](docs/ARCHITECTURE.md) e os campos estão
documentados no [Dicionário de dados](docs/DATA_DICTIONARY.md).

## Executar localmente

```bash
python -m venv .venv
python -m pip install -e ".[dev]"
python -m coreops_demo.pipeline
pytest -q
python -m coreops_demo.weekly_report
python -m http.server 8000
```

Depois, abra `http://localhost:8000`. Os arquivos gerados ficam em
`data/processed/` e o relatório de demonstração em `output/`.

## Camadas do repositório

```text
.
|-- data/
|   |-- raw/                 # eventos e inventário sintéticos
|   `-- processed/           # artefatos reproduzíveis do ETL
|-- src/coreops_demo/
|   |-- pipeline.py          # ingestão, qualidade, matching e KPIs
|   `-- weekly_report.py     # automação de relatório Excel
|-- sql/                     # schema, índices e views PostgreSQL
|-- tests/                   # testes de regressão e qualidade
|-- docs/                    # arquitetura e dicionário de dados
|-- index.html               # dashboard demonstrativa
|-- app.js
`-- styles.css
```

## Dashboard demonstrativa

A interface permite filtrar incidentes, acompanhar SLA, identificar unidades
isoladas, analisar operadoras e consultar a visão de NOC Wall. Alterações de
tratativa ficam somente no `localStorage` do navegador.

Principais decisões de produto:

- **ação primeiro:** a próxima ação aparece antes do detalhe técnico;
- **densidade controlada:** leitura rápida de uma fila operacional extensa;
- **cores semânticas:** criticidade, risco e estabilidade consistentes;
- **passagem de turno:** responsável, status e histórico permanecem juntos;
- **rastreabilidade:** o dataset informa quando e como foi gerado.

## Segurança e autoria

Consulte [SECURITY.md](SECURITY.md) antes de reutilizar qualquer parte. Projeto de
portfólio de **Celso Kaique**, desenvolvido como demonstração independente de uma
arquitetura de dados aplicada a operações.
