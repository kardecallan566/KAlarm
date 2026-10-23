# CP07 — Diagnóstico e recuperação de alarmes
Esta etapa é experimental: não comprova entrega no horário em Android físico.

## Implementado
- Auditoria da fila: esperados, correspondentes, faltantes, obsoletos/duplicados, próximo e último horário.
- A permissão de alarme exato entra na assinatura da notificação para provocar reagendamento quando muda.
- Alterações durante uma sincronização solicitam nova passagem para aplicar o estado mais recente.
- Tratamento de toque na notificação com app fechado, sem registrar tomada automaticamente.
- Tela para consultar permissões, abrir ajuste de alarme exato e atualizar programação.
- Versões de dependências alinhadas à documentação Expo SDK 57 e job TypeScript no GitHub Actions.

## Testes físicos necessários
1. Aviso com aparelho desbloqueado e bloqueado; registrar horário real.
2. Fechar aplicativo e reiniciar aparelho; conferir avisos e diagnóstico.
3. Permitir e revogar alarme exato e notificações; rever a fila.
4. Editar e arquivar medicamentos; conferir que avisos antigos são removidos.
5. Economia de bateria e vários dias com app fechado.
6. Tocar num aviso nunca pode confirmar ingestão.

A fila é limitada a 40 notificações nos próximos 30 dias, renovadas quando o app abre. Não prometer cobertura infinita com o app fechado.

Fonte: https://docs.expo.dev/versions/v57.0.0/sdk/notifications/
