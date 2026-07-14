# CoreOps NOC Dashboard

Edição pública e demonstrativa de uma plataforma operacional para acompanhamento
de indisponibilidades de telecomunicações. A experiência foi desenhada para ajudar
analistas a identificar prioridades, assumir incidentes, registrar tratativas e
acompanhar SLA, unidades isoladas e impacto por operadora.

> **Privacidade:** todos os nomes, eventos, circuitos, operadores, endereços e
> indicadores desta edição são sintéticos. O repositório não contém código de
> implantação, credenciais, consultas internas, planilhas ou dados de produção.

**Repositório:** <https://github.com/CelsoKaiqueSil/coreops-noc-dashboard>

## Demonstração

Abra [`index.html`](index.html) diretamente no navegador. Não há etapa de build,
backend ou dependência de banco de dados.

Principais interações disponíveis:

- filtros por ação, operadora, regional e texto;
- fila de incidentes organizada por criticidade;
- painel de detalhes em quatro áreas: resumo, tratativa, histórico e evidências;
- registro local de uma atualização de tratativa;
- visão de unidades, operadoras, relatórios e NOC Wall;
- alternância entre tema claro e escuro.

## Visão técnica

| Camada | Edição demonstrativa | Projeto operacional representado |
| --- | --- | --- |
| Interface | HTML, CSS e JavaScript | Dashboard web responsiva |
| Dados | Dataset sintético no navegador | PostgreSQL e bases operacionais |
| Monitoramento | Eventos simulados | Enriquecimento por ferramenta de monitoramento |
| Estado | `localStorage` | Tratativas e histórico persistidos no backend |
| Segurança | Sem integração externa | Controle de acesso por perfil |

Consulte a [arquitetura](docs/ARCHITECTURE.md) e a
[lista de verificação para publicação](docs/PUBLICATION_CHECKLIST.md). O passo a
passo para o primeiro envio está em [publicação no GitHub e LinkedIn](docs/PUBLISHING.md).

## Decisões de produto

- **Ação primeiro:** cada incidente mostra a próxima ação antes do detalhe técnico.
- **Densidade controlada:** a fila permite varrer muitos casos sem perder contexto.
- **Cores semânticas:** vermelho representa ruptura ou SLA vencido; amarelo indica
  atenção; verde comunica estabilidade; azul identifica navegação e ação.
- **Passagem de turno:** responsável, status e última atualização permanecem juntos.
- **NOC Wall:** apenas métricas e filas úteis para leitura à distância.

## Estrutura

```text
.
|-- index.html
|-- styles.css
|-- app.js
|-- README.md
|-- SECURITY.md
|-- linkedin-post.md
`-- docs/
    |-- ARCHITECTURE.md
    `-- PUBLICATION_CHECKLIST.md
```

## Autoria e direitos

Projeto de portfólio de **Celso Silveira**, apresentado por meio de uma implementação
demonstrativa independente. Nenhuma licença de reutilização é concedida neste
momento. A publicação de nomes, marcas ou materiais do ambiente corporativo depende
de autorização do respectivo titular.
