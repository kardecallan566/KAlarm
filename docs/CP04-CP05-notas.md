> **REGISTRO HISTÓRICO.** Os comandos que mencionam `cd mobile` abaixo são anteriores à migração CP10. A execução atual é na raiz de KAlarm.

# KAlarm CP04/CP05 — SQLite + editor (versão experimental)

- Dados locais em SQLite (não criptografados nesta prova de conceito); sem conta ou sincronização.
- Criação de medicamento com recorrência diária, matriz semanal ou ciclo contínuo; múltiplas tomadas por dia.
- Prévia calculada pelo motor TypeScript antes de salvar.
- Edições de tratamentos existentes passam a valer amanhã; histórico anterior não é reescrito.
- Arquivar medicamento preserva confirmações.
- Confirmar tomada exige ação explícita e é idempotente; não permitido antes do horário agendado.
- Histórico exibe apenas confirmações explícitas, não supõe que ausência de confirmação seja esquecimento.
- A integração de alarmes automáticos não faz parte deste checkpoint; tela de testes de notificação continua isolada.
- Falta criptografia local, políticas de backup, teste Android físico, instalação pnpm e validação Expo completa.

## Testes

```bash
cd proofs/scheduling && node --experimental-strip-types --test tests/*.test.ts
python -m unittest discover -s proofs/sqlite/tests
cd mobile && pnpm install && pnpm exec expo install --fix && pnpm run check
```

**Nunca usar este protótipo como única forma de lembrar uma medicação importante.**
