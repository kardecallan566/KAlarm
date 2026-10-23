# CP07 — Diagnóstico e recuperação de alarmes

**Situação:** código publicado para testes; ainda não validado em Android físico.

## Implementado
- Auditoria: avisos esperados, correspondentes, faltantes, obsoletos/duplicados e janela futura.
- Segunda sincronização quando uma edição chega enquanto outra está executando.
- Toque em notificação com app encerrado abre o KAlarm sem confirmar tomada.
- Diagnóstico de notificações e botão de atualização no aplicativo.
- Dependências compatíveis com Expo SDK 57 e TypeScript testado no GitHub Actions.

## Compatibilidade importante

A versão `expo-notifications@57.0.24` **não** disponibiliza `getExactAlarmPermissionsAsync`,
`requestExactAlarmPermissionsAsync` nem a modalidade `delivery: 'alarmClock'`.
Esses recursos foram adicionados na linha 58.x. Por isso o CP07 opera com notificações de data
pelo modo padrão suportado, **sem alegar precisão garantida**. Não solicitamos
`SCHEDULE_EXACT_ALARM` no Android enquanto não houver implementação realmente suportada.
Uma evolução futura exigirá atualizar o Expo/React Native ou implementar e testar código nativo específico.

## Testes físicos obrigatórios

1. Comparar horário previsto e hora de entrega com celular aberto, bloqueado e aplicativo fechado.
2. Reiniciar o dispositivo e verificar manutenção dos avisos.
3. Revogar/restaurar permissões de notificação e observar o diagnóstico.
4. Alterar/arquivar rotinas e conferir cancelamento dos avisos obsoletos.
5. Verificar economia de bateria e longa ausência de abertura do app.
6. Confirmar que abrir/dispensar notificação **nunca** registra ingestão.

A fila tem até 40 avisos para os próximos 30 dias e é renovada quando o aplicativo abre;
**não existe garantia de cobertura infinita se ele permanecer fechado.**

Referências:
- https://docs.expo.dev/versions/v57.0.0/sdk/notifications/
- https://github.com/expo/expo/blob/main/packages/expo-notifications/CHANGELOG.md
