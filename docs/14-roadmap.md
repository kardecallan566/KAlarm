# 14 — Roadmap e checkpoints

**Status (21/10/2026):** planejamento com 35 SVGs, motor TypeScript (23 testes locais) e migração SQLite experimental (7 testes locais). Nenhuma integração Expo publicada ou testada no celular.

| Checkpoint | Entregáveis | Evidência de aceite |
| --- | --- | --- |
| CP00 — Planejamento | Requisitos, tipos de doses, arquitetura, riscos e release | Markdown versionado, pendências visíveis |
| CP01 — SoftCare design kit | Tokens, 35 ícones SVG autorais, tipografia, componentes e estados | Storybook/galeria equivalente, contraste e escalas avaliados |
| CP02 — UX prototipado | Todas as telas compactas e tablet, editor 7 dias e ciclo N | Fluxos navegáveis, imagens e inspeção acessível |
| CP03 — Base Expo | TypeScript, Router, pnpm, CI, testes, estrutura de módulo | Build de desenvolvimento, lint/typecheck/test passando |
| CP04 — Core de recorrência | Funções puras, períodos, dias, slots, exceções, fuso, versão | Suíte D01–D16 verde |
| CP05 — SQLite + editor | Migrations, cadastro, edição, calendário e revisão | Persistência e migrações validadas |
| CP06 — Alarmes reais | Adaptador Expo/nativo, reconcile, permissões, ações e histórico | Provas Android/iOS físicos e limites documentados |
| CP07 — Produto polido | Responsividade, acessibilidade, estados vazios/falha, privacidade | Matriz de dispositivos e checklist MVP |
| CP08 — Beta Play | AAB, política, declarações, testes fechados quando exigidos | Checklist loja sem bloqueios críticos |
| CP09 — Lançamento | Release assinado, suporte e monitoramento | Prontidão operacional e aprovação da plataforma |

## Ordem de risco

**Alarmes** e **agendamento de longo prazo com ciclos variáveis** têm maior risco de plataforma. Fazer experimento técnico em paralelo ao CP01–CP02, sem esperar o app inteiro estar pronto. Não investir em polimento excessivo antes de confirmar que o recurso central é viável.

## Definition of Done

- Critério de aceite e teste replicável; UI e lógica sem divergência.
- Compilação Android física; iOS se suportado e prometido.
- TypeScript/linters/testes verdes; screenshots com dados de exemplo.
- Traduções/mensagens adequadas; sem texto cortado em 320dp e 200% de fonte.
- Permissões pedidas no momento oportuno; mudanças/erros comunicados.
- Histórico preservado em edição, atualizações e ações de notificação.
- Sem dependência invisível de rede; dados sensíveis não enviados em logs.

## Política de GitHub

Um PR por checkpoint, preferencialmente com issues vinculadas, checklist e evidências. Não mesclar recursos críticos sem teste e autorização quando o processo de colaboração assim exigir. Manter `main` estável; mudanças de contrato passam por ADR.

## Evidências de protótipo v3

- **CP01:** 35 SVGs produzidos e prévia visual concluída; **ainda pendente** homologação em Expo, acessibilidade e launcher adaptativo.
- **CP02:** mockup estático telefone/tablet e contrato do editor documentados; **ainda pendente** fluxo React Native navegável.
- **CP04:** cálculo de doses e testes TypeScript em ambiente Node concluídos como *prova de conceito*, mas **ainda pendente** validação em aplicativo, persistência de verdade e reconciliação.
- **CP05:** primeira migration SQLite com 7 testes; **ainda pendente** integração com expo-sqlite, estratégia de criptografia e dados reais.
