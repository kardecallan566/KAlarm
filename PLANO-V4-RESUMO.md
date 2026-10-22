# KAlarm — Plano de fechamento v4

**Estado em 21/10/2026:** planejamento técnico aprofundado, provas de conceito locais da v3 preservadas. Esta versão acrescenta oito documentos e um checklist para fechar riscos. **Não é app pronto nem comprovação de alarmes em aparelho.**

## Entregas desta rodada

- `docs/23-contrato-final-do-produto.md` — prioridades, limites e critério de publicação.
- `docs/24-alarmes-spike-e-aceite.md` — plano de experimento nativo e estados confiáveis de notificação.
- `docs/25-editor-tratamentos-completo.md` — comportamentos exatos do cadastro e edição.
- `docs/26-softcare-componentes-estados.md` — catálogo de componentes, iconografia e adaptação.
- `docs/27-privacidade-backup-recuperacao.md` — proteção de dados, descarte, recuperação e limitações.
- `docs/28-matriz-qa-e-criterios-gates.md` — testes e bloqueadores de release.
- `docs/29-publicacao-play-checklist-operacional.md` — preparação para a Google Play.
- `docs/30-adr-v4-riscos-e-decisao.md` — decisões assumidas e perguntas ainda pendentes.
- `checklists/planejamento-v4-fechamento.md` — acompanhamento objetivo.

## O que já existe de fato, herdado da v3

35 SVGs SoftCare, mockups estáticos, componente experimental de ícones, motor TypeScript com testes e schema SQLite experimental com testes. A integração em Expo e os alarmes reais não foram realizados.

## Recomendação imediata

**Executar o spike Android de alarmes enquanto implementa CP02/03**. Isso evita completar uma UI antes de descobrir limitações de uma função essencial.
