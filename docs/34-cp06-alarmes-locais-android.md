# CP06 — Notificações locais de medicamentos

**Situação:** primeira implementação para testes; não é uma garantia de alerta ou um aplicativo clínico validado.

## Fluxo
- Opt-in: a configuração nasce desativada e nenhuma permissão é solicitada sem ação da pessoa.
- A fila contém **até 40 avisos** nos **próximos 30 dias**. A quantidade por data depende do esquema informado pelo usuário.
- O motor de recorrência gera as ocorrências; o reconciliador mantém apenas notificações ainda desejadas, cancela obsoletas e deduplica.
- Ao salvar, arquivar ou confirmar, o KAlarm tenta atualizar a fila nativa.
- O app também reconcilia quando abre e retorna ao primeiro plano; não depende de timer JS para cada notificação.
- Toque na notificação apenas abre o aplicativo: não confirma o medicamento.
- O modo discreto oculta nome e dosagem do aviso por padrão; a exposição pode ser autorizada nos ajustes.

## Android e limitações
- Canal `kalarm-medication-v1`, com som/vibração.
- Permissão exata disponível => `alarmClock`; sem ela => `bestEffort`, que pode atrasar.
- `SCHEDULE_EXACT_ALARM` é solicitado separadamente; não usar `USE_EXACT_ALARM` sem elegibilidade na Play.
- O agendamento não comprova entrega. Reinicialização, economia de bateria e comportamento OEM podem afetar avisos.
- A janela móvel **não garante cobertura indefinida** se a pessoa ficar muitas semanas sem abrir o app. Essa limitação bloqueia publicação geral até uma solução validada.
- O banco do protótipo permanece local e **não criptografado**; revisar proteção dos dados antes de utilizar informações reais.

## Migração v2
- `reminder_settings`: consentimento e privacidade, ambos inicialmente desativados.
- `reminder_jobs`: espelho do estado da fila nativa, não é prova de entrega.
- Histórico e rotinas existentes permanecem intactos.

## Testes para Android real
1. Com app aberto, fechado e tela bloqueada: verificar horário da notificação e o conteúdo.
2. Permissão negada/revogada, reinicialização e economia de bateria.
3. Editar dose e arquivar tratamento: conferir ausência de avisos antigos e duplicados.
4. Confirmar uma dose e reabrir o app: sem duplicidade de histórico.
5. Alternância semanal, ciclo contínuo, fuso horário, mudanças de data e 31+ dias sem abrir o app.
6. Modo discreto versus detalhado na tela bloqueada.

Testes isolados: `node --experimental-strip-types --test proofs/reminders/tests/*.test.ts` e `python -m unittest discover -s proofs/sqlite/tests`.
