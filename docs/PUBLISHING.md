# Publicação no GitHub e no LinkedIn

O repositório público já está conectado a
`CelsoKaiqueSil/coreops-noc-dashboard`. Use este roteiro antes de cada atualização.

## 1. Confirmar segurança e direitos de publicação

- execute os testes e gere novamente `data/processed/`;
- revise [`PUBLICATION_CHECKLIST.md`](PUBLICATION_CHECKLIST.md);
- confirme que somente dados sintéticos estão presentes;
- não publique marcas, infraestrutura ou contexto corporativo sem autorização.

## 2. Validar a versão local

```powershell
python -m pip install -e ".[dev]"
python -m coreops_demo.pipeline
pytest -q
git diff --check
git status --short
```

O pipeline é determinístico: uma nova execução sem mudanças de entrada não deve
alterar os arquivos em `data/processed/`.

## 3. Publicar a atualização

```powershell
git add --all
git commit -m "feat: add reproducible synthetic data pipeline"
git push origin main
```

Nunca coloque tokens em comandos salvos, arquivos `.env` versionados ou documentos
do repositório.

## 4. Apresentação profissional

1. Use a descrição curta: “Pipeline sintético de dados e dashboard operacional para NOC”.
2. Adicione os tópicos `python`, `pandas`, `postgresql`, `etl`, `data-quality`,
   `dashboard`, `business-intelligence`, `noc` e `portfolio`.
3. Fixe o repositório no perfil do GitHub.
4. Revise [`linkedin-post.md`](../linkedin-post.md) antes de publicar.
5. No LinkedIn, destaque o problema, as decisões de engenharia e o que pode ser
   executado pelo recrutador - não apenas a aparência da dashboard.
