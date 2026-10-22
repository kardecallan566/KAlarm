# 19 — Motor de agendamento: prova de conceito executável

## Entrega local

`proofs/scheduling/src/engine.ts` implementa cinco modalidades: `daily`, `weekdays`, `weekly-matrix`, `cycle`, `dates`, com sobrescrita por data (`overrides`), múltiplos horários, unidade, dose decimal normalizada e versões.

O núcleo é **TypeScript puro**, sem Expo, banco ou serviços de rede. A função `previewOccurrences(schedule, {from, to})` retorna ocorrências determinísticas que podem alimentar a prévia do calendário e, futuramente, o adaptador nativo de notificações.

### Para testar

```bash
cd proofs/scheduling
node --version  # Node 22+ para strip-types
node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/*.test.ts
tsc --noEmit
```

Resultado no ambiente de planejamento: **23 testes aprovados** e **TypeScript sem erros** (Node 22.16 / TypeScript 5.8). Isso não equivale a testes de notificações em celulares.

## Políticas explícitas

- Calendário: datas locais `YYYY-MM-DD`, dias ISO segunda=1...domingo=7.
- Ciclo: índice calculado por diferença de dias de calendário, sem se basear em confirmação.
- Dados: quantidade decimal textual normalizada, até 3 casas decimais nesta prova.
- Tempo: horário local convertido para UTC via fuso IANA por `Intl.DateTimeFormat`.
- Horário inexistente por DST: erro `NONEXISTENT_LOCAL_TIME` e necessidade de edição/decisão do usuário.
- Horário repetido por DST: erro `AMBIGUOUS_LOCAL_TIME`, salvo resolução explícita `earlier`/`later`.
- IDs estáveis por `{schedule-id}:v{revision}:{date}:{slot-id}`.
- Fim/início inclusivos; exceção de um dia não desloca ciclo.
- Dados são apenas agendamentos previstos: não existe confirmação automática de tomada.

## Limites conhecidos

- Não há interface de criação/edição React Native neste módulo.
- Não há persistência, transações, reconciliação de notificação ou integração Android/iOS.
- O motor valida estrutura e limites básicos, mas **não** executa validação clínica de quantidade/unidade.
- A regra atual restringe datas entre 1900 e 9999, ciclos até 365 etapas, prévias até 371 datas.
- Edição versionada no banco e política de timezone de viagem precisam ser integradas e testadas.
- Deve-se fazer fuzz/property tests adicionais para limites calendáricos e revisar performance antes da produção.

## Próximas ações de engenharia

1. Extrair contratos para um pacote compartilhado com validação de entrada (Zod).
2. Persistir cronograma e versões transacionalmente no SQLite.
3. Implementar repositórios e hidratação do motor a partir de dados SQLite.
4. Criar `NotificationReconciler` que agenda uma janela validada no dispositivo sem duplicatas.
5. Testar com relógio/fuso injetados e eventos de edição concorrente.
