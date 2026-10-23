# Central de Relatorios: estudo de caso

## Problema

Consolidar indicadores de chamados e monitoramento em Excel e apresentacoes mensais
exige selecionar cliente e periodo, reconciliar fontes e preservar o modelo visual.
Uma coleta concluida nao garante, por si so, cobertura nem correcoes dos indicadores.

## Abordagem e decisoes

```mermaid
flowchart LR
    A[Fontes ou CSV sintetico] --> B[Coleta versionada]
    B --> C[Normalizacao e chamados unicos]
    C --> D[Cobertura e qualidade]
    D --> E[Conferencia do coordenador]
    E --> F[Excel e apresentacao]
    F --> G[Historico com versao e manifesto]
```

- Escolha entre um cliente, varios ou todos, sem depender de desmarcar longas listas.
- Periodo e fonte ficam explicitos; uma base antiga nao representa dados atuais.
- SLA considera elegiveis, cumpridos, violados e pendentes separadamente.
- Relatorios de disponibilidade nao confundem tempo fora com prazo do NOC.
- Coleta e arquivo tem estados distintos: executar, validar, gerar, concluir ou falhar.
- Ultima base completa permanece disponivel quando uma fonte falha.
- Atualizacao agendada nao depende de manter o navegador aberto.
- Historico, manifestos e verificacao de backup ajudam a rastrear cada entrega.

## O que este portifolio permite conferir

O repositorio [Service Desk Analytics](https://github.com/CelsoKaiqueSil/service-desk-analytics)
fornece a parte reproduzivel de indicadores e Excel, com dados sinteticos e metodologia.
O [Zabbix Reporting Pipeline](https://github.com/CelsoKaiqueSil/zabbix-reporting-pipeline)
demonstra agregacao de metricas, picos e rejeicoes. A arquitetura acima documenta
o raciocinio do produto; nao afirma que o gerador completo da Central esta publicado.

## Validacao que importa

Exemplo didatico: 9 cumpridos + 1 violado + 2 pendentes = 90% entre 10 elegiveis,
nao 75% entre 12 registros. Os pendentes devem aparecer em indicador proprio.
No Excel publico a taxa e calculada apenas quando datas de resolucao e prazo existem.

Metricas de aceite: contagem unica reconciliada, cobertura do periodo, ausencia de
erros de planilha, formula documentada, arquivo acessivel no historico e falha explicita.
Nenhum dado ou screenshot operacional e incluido neste estudo.

## Limites

Este documento nao e um produto hospedado, benchmark de producao ou compromisso
contratual. Integracoes privadas, contatos, modelos de clientes e configuracao de
servidores nao fazem parte da publicacao.
