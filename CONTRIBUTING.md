# Contribuir e validar

1. Abra uma issue com problema, amostra sintetica e criterio de aceite.
2. Crie uma branch curta: `git switch -c fix/nome-da-regra`.
3. Faca commits pequenos: `fix: preserva valores ausentes no SLA`, `test: cobre exportacao vazia`, `docs: explica coorte`.
4. Execute `python -m pytest` e o comando do README em um ambiente virtual.
5. Abra um PR com evidencia, risco e limites; aguarde os checks antes de integrar.
6. Publique uma release com escopo e comandos de reproducao depois da validacao.

Nao fabricar commits retroativos. Nao usar dados operacionais como massa de teste.
Uma correcao nao deve redefinir regras contratuais sem evidencia.
Revisao humana continua necessaria mesmo com CI aprovado.
