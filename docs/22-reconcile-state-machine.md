# 22 — Estado do lembrete e algoritmo de reconciliação (proposta)

## Dois estados independentes

**Estado da dose (declarado pelo usuário):** `unconfirmed`, `confirmed`, `confirmation_reverted`, `explicitly_skipped`.

**Estado da notificação (do sistema):** `pending`, `scheduled`, `cancel_requested`, `cancelled`, `error`, `unknown`. A notificação entregue **não** prova a tomada.

## Fluxo de confirmação

1. Usuário toca `Confirmar que tomei`, app verifica ocorrência e registro atual.
2. Registra `actualTakenAt` e `eventAt` de modo transacional, com chave de idempotência para a interação.
3. UI atualiza histórico com “Confirmado por você às HH:mm”.
4. O lembrete pendente da mesma ocorrência pode ser cancelado no sistema, sem afetar doses futuras.
5. Um segundo toque com a mesma chave não duplica evento; correções posteriores são eventos separados.

## Fluxo de adiar

1. User escolhe 5/10/15 minutos disponíveis (não altera horário prescrito nem ciclo).
2. Registrar evento `snoozed` da ocorrência; programar novo alerta da mesma ocorrência.
3. Se o agendamento falhar, comunicar imediatamente; não mostrar “adiado” como sucesso.
4. Não inferir orientação de compensação ou de tomar dose fora de horário.

## Reconciliação de notificações (pseudocódigo)

```
async reconcile(now) {
  const desired = getUpcomingOccurrencesFromLocalDB(now, validatedHorizon);
  const scheduled = await nativeAdapter.listScheduledNotifications();
  const obsolete = diffByOccurrenceAndVersion(scheduled, desired);
  await cancelObsolete(obsolete);                  // registrar tentativas/erros
  for (const occurrence of desired) {
    if (isAlreadyScheduledExactly(occurrence)) continue;
    const nativeId = await nativeAdapter.schedule(occurrence);
    await upsertNotificationOutbox(occurrence.id, nativeId);
  }
  await recordReconcileOutcome();
}
```

### Situações que exigem cuidado

- Se `schedule(...)` funcionar e a gravação no SQLite falhar, o reprocessamento precisa detectar o agendamento nativo e evitar duplicata.
- Se `cancel(...)` falhar, o app precisa sinalizar risco de alerta antigo em vez de declarar que foi removido.
- Em mudanças de timezone, o aplicativo precisa seguir uma política explícita e revisar a agenda.
- Não confiar em tarefas de fundo para reposição infalível de ciclos durante meses com o app fechado: testar cobertura real da plataforma antes de prometer isso.
- O horizonte de agendamento será definido **após experimento real**, não arbitrariamente.
- Após reinício, alteração de permissão e edição de tratamento, tentar conciliação pelos mecanismos suportados e comunicar limitações.

## Checklist de experimento Android

- Aparelho com app fechado, tela bloqueada, modo silencioso, economia de bateria, reinício.
- Android 13/14/15/16 quando disponíveis, permissões e políticas Play aplicáveis.
- Duas ocorrências no mesmo minuto, doses alternadas, notificações canceladas/atualizadas.
- Captura de evidência de entrega, atraso e falha; documentar versão de SO e fabricante.
