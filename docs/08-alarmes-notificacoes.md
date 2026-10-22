# 08 — Alarmes e notificações: arquitetura de confiabilidade

## Diferença crítica

**Notificação local** exibe alerta conforme permissões; **alarme de relógio** pode requerer recursos nativos e permissões adicionais. Não afirmar equivalência de confiabilidade ou capacidade de ignorar silencioso/Do Not Disturb. O objetivo do KAlarm é máximo cuidado dentro do que cada plataforma permite, com aviso de capacidade.

## Serviço NotificationReconciler

Entradas: data/hora atual injetável, cronogramas ativos, ocorrências calculadas, jobs salvos, permissões. Saída: plano de cancelar jobs obsoletos, criar jobs ausentes, reportar falhas e gravar estado.

```text
Editor → motor de regras → janela de ocorrências → SQLite
                                          ↓
                              NotificationReconciler
                           ↙                      ↘
                    Android/Expo                 iOS/Expo
                           ↘                      ↙
                            IDs nativos persistidos
                                    ↓
                            confirmar / adiar
                                    ↓
                     intake_events (idempotente)
```

### Quando reconciliar

- Após criar/editar/pausar/encerrar medicamento.
- Na inicialização e no retorno do app ao primeiro plano.
- Ao detectar alteração relevante de permissão/fuso/horário, quando API permitir.
- Após ação de notificação, confirmação e adiamento.
- Em eventos nativos de reinicialização/reagendamento **somente conforme suporte efetivo testado**, sem prometer tarefa em background permanente.

### Janela de agendamento

- Não agendar infinitas ocorrências diferentes. Definir horizonte conforme limites medidos da plataforma e quantidade de tratamentos.
- **Risco central:** ciclos com conteúdo diferente exigem notificações por ocorrência, e uma janela rolante pode esgotar quando o usuário não abre o app por semanas. O risco não está resolvido automaticamente pelo Expo.
- Exigir *spike* nativo precoce para examinar comportamento de fechamento forçado, reinicialização, permissões, limite de pendências e ausência prolongada.
- Registrar cobertura futura de agendamentos por dispositivo na tela de diagnóstico, sem passar falsa segurança.
- Se não for viável garantir a experiência essencial com Expo managed puro, avaliar **Expo development build com módulo nativo**; decidir antes de divulgar alertas como 'precisos'.

## Android

- Solicitar `POST_NOTIFICATIONS` (Android 13+), depois avaliar `SCHEDULE_EXACT_ALARM` para exatidão (Android 12+).
- `USE_EXACT_ALARM` é restrita pela política Google Play, usar **somente se a funcionalidade central se enquadrar e aprovação/declaração forem apropriadas**.
- Documentação Expo recente descreve `delivery: 'alarmClock'`, dependente de permissão exata; testar comportamento em aparelhos reais e fabricantes diferentes.
- Canais de notificação para cuidado/alarmes; nome, importância e som definidos antes do primeiro agendamento, respeitando configurações do usuário.
- Full-screen intent, se considerado, exige investigação de permissão, elegibilidade de publicação e riscos de UX; **não incluir no MVP sem prova técnica/política**.
- Reinício do aparelho, restrições de bateria e alterações do relógio exigem roteiro de teste.

## iOS

- Permissão de notificação tem status granulares (incluindo provisional); respeitar Foco e silêncio.
- Alerta crítico que ignore silêncio depende de entitlement especial da Apple; não presumir aprovação.
- Testar limites de notificações pendentes, app encerrado e ausência prolongada; só contar capacidades observadas e documentadas.
- Ações de notificação exigem confirmar se o app foi reaberto e gravou corretamente o evento.

## Ações e prevenção de erros

- Confirmar dose: exigir idempotency key por ocorrência/ação; retornar feedback só após gravação.
- Adiar: mesma ocorrência; horário de lembrete adiado separado do `planned_at`; verificar conflito com próxima dose, sem gerar indicação clínica.
- Abrir detalhes: somente navegação, nunca confirmação implícita.
- Se usuário negar permissão: oferecer calendário e aviso persistente de que alertas não estão ativos.
- Conteúdo privado padrão: recomendar título genérico na tela bloqueada; opção de exibir nome/quantidade mediante escolha consciente.

## Checklist de laboratório de alarmes

- App em primeiro plano, fundo, encerrado, reboot, celular bloqueado, modo silencioso/Foco, bateria restrita, permissão retirada.
- Agendamento simultâneo e duplicidade; edição pouco antes de tocar; múltiplos remédios na mesma hora.
- Alertas em 1h, 24h, 7d e 30d, com e sem abertura do app (se viável).
- Teste manual real em Android 13/14/15/16 e iOS compatível; registrar modelos e versões.
