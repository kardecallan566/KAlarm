# 24 — Teste técnico de alarmes e decisão de arquitetura (v4)

## Motivação

A função central do KAlarm é lembrar no horário; uma notificação local comum não equivale automaticamente a um despertador preciso. **Precisão e cobertura por semanas sem abrir o app só serão declaradas após evidência em hardware.**

## Arquitetura de três níveis

1. **Domínio:** calcula `DoseOccurrence` com `scheduleVersionId`, `localDate`, `plannedAt`, `quantitySnapshot`, `unitSnapshot`. Não conhece notificações.
2. **Outbox local:** declara estado pretendido por ocorrência, prioridade, número da tentativa, idempotencyKey, identificador de notificação, versão e erro.
3. **Adapter nativo:** Expo Notifications e, se necessário, um módulo Android sob Expo Development Build. Verifica permissões, cria/cancela alarmes e reconcilia IDs.

## Garantias distintas

- `scheduled_in_db`: o aplicativo conhece a ocorrência.
- `registered_with_os`: API retornou identificador; **não prova que tocará**.
- `delivery_observed`: só quando API/telemetria local realmente fornece evidência; não inferir do simples agendamento.
- `intake_confirmed`: usuário declarou que tomou; totalmente independente de entrega.

**Se o sistema não reportar se mostrou um aviso:** manter estado `unknown`, em vez de “entregue”.

## Gatilhos de reconciliação

- Criar/alterar/pausar/cancelar rotina; editar exceção.
- Voltar ao primeiro plano; app iniciar; permissões alteradas quando detectadas.
- Reinicialização via mecanismo suportado pela plataforma **após teste**.
- Confirmar ou adiar evento, sem alterar suas próximas doses.
- Alteração de fuso e data/hora com aviso e recálculo controlado.

## Algoritmo idempotente

1. Produzir lista desejada de ocorrências do horizonte seguro.
2. Consultar jobs registrados no SO e o mapa SQLite.
3. Identificar notificações com versão velha, sem ocorrência válida ou canceladas.
4. Tentar cancelamentos, registrar falhas e **não declarar sucesso se falhar**.
5. Agendar ausentes com payload contendo ID e versão, associando corretamente à outbox.
6. Detectar job órfão caso SO tenha aceitado e SQLite falhado; corrigir sem duplicar.
7. Salvar hora/resultado de conciliação sem dados sensíveis nos logs operacionais.

## Experimentos obrigatórios (executar antes de selecionar `USE_EXACT_ALARM`)

| Código | Ensaio | Evidência exigida |
| --- | --- | --- |
| A01 | Android permissões padrão, negadas e concedidas | Resposta da API, UI de diagnóstico e comportamento |
| A02 | Android 13+ permissão de notificação revogada | Avisos não afirmam estar ativados |
| A03 | Android 14+ permissão de alarme exato revogada | Degradação e reconciliação observadas |
| A04 | Tela bloqueada e app em background | Atraso entre planejado e alerta observado |
| A05 | App removido da tela recente / force-stop | Registrar diferenças; não prometer suporte impossível |
| A06 | Reboot, atualizações do app e alterações de fuso | Persistência/reagendamento real |
| A07 | Economia de bateria de fabricante | Taxa de entrega e atraso por dispositivo |
| A08 | Duas doses simultâneas, uma alterada | Sem conflito, sem alerta obsoleto |
| A09 | Usuário sem abrir o app 7, 14, 30 dias | Cobertura de alertas variáveis; testar janela esgotada |
| A10 | iOS permissões, Foco/silencioso e limite de pendentes | Comportamentos observados sem extrapolar |

Registros de ensaio devem incluir fabricante, SO, build, horário previsto e observado, estado das permissões, configuração de bateria e resultado.

## Decisões planejadas

- Preferir Expo como camada de acesso inicial. **Se o experimento falhar nos requisitos essenciais**, avaliar adapter Android com AlarmManager e receiver apropriado em development build.
- `SCHEDULE_EXACT_ALARM`: solicitar permissão contextual se o caso exigir e o app a declarar; Android 14+ costuma negar por padrão em novas instalações.
- `USE_EXACT_ALARM`: somente se caso de uso e políticas Google Play permitirem; jamais ativar por suposição.
- Modo `alarmClock` do Expo é candidato para horário crítico; testar ícone persistente e impacto na UX.
- Não pedir isenção genérica de otimização de bateria automaticamente; seguir políticas e utilidade demonstrada.
- Horizonte móvel sujeito a limite de pendências iOS e quantidade de eventos; **tamanho numérico será decidido por experimento**, e o modo 'sem abrir por meses' permanece risco de produto.
- Nunca depender de timer JS contínuo em background para alarme.

## Tela de verificação de alarmes

Indicadores: Notificações autorizadas? Horários exatos disponíveis? Próximo alerta programado? Última verificação? Avisos com problema? Botão **Testar aviso**. Não mostrar rótulo “100% garantido”.

## Saída do spike

Arquivo de evidências, compatibilidade por plataforma, decisão ADR para Expo puro vs módulo nativo, comunicação de limitação ao usuário e plano de contingência. Se não atender ao nível de confiabilidade mínimo, **segurar o lançamento**, não esconder a limitação.

## Fontes oficiais conferidas em 21/10/2026

- Android: https://developer.android.com/about/versions/14/changes/schedule-exact-alarms
- Expo Notifications: https://docs.expo.dev/versions/latest/sdk/notifications/
- Google Play exatos: https://support.google.com/googleplay/android-developer/answer/16558241
