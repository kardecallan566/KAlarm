# 10 — Falhas, recuperação e estados de produto

Um app de lembretes exige UX de falha explícita; 'erro silencioso' é inaceitável.

## Catálogo de problemas

| Cenário | Regra de comportamento | UX |
| --- | --- | --- |
| Permissão de notificações negada | Salvar cadastro, sem prometer aviso | Cartão 'Notificações desativadas', link Ajustes |
| Permissão de alarme exato negada | Degradar conforme SO e testar capacidade | 'Horário exato pode não ser garantido' |
| Banco temporariamente indisponível | Não confirmar sucesso; preservar rascunho | 'Não foi possível salvar. Tentar novamente' |
| Dose inválida/zero/campo vazio | Bloquear ativação, campo marcado | Mensagem perto do campo explicando o ajuste |
| Horários sobrepostos | Não mesclar; perguntar se é intencional | 'Há duas tomadas às 08:00' |
| Revisão e notificações divergentes | Transação permanece salva; fila de retry | 'Programação salva; avisos precisam de atenção' |
| Fuso mudou | Mostrar impacto e política vigente | 'Seu fuso mudou. Confira os próximos horários' |
| App atualizado | Migração idempotente; manter histórico | Nada a fazer quando bem sucedido |
| Sem espaço / arquivo corrompido | Recuperar backup se disponível; não apagar | Aviso de suporte/reparo sem alegar que remédio foi tomado |
| Notificação descartada | Não criar confirmação | Histórico 'não confirmado' |
| Edição depois de confirmação | Preservar evento anterior | Resumo antes/depois, ação explícita |
| Adiar após prazo da próxima dose | Não recomendar posologia | Sugerir visualizar agenda/prescrição, sem ajustar doses |

## Observabilidade sem dados pessoais

- Log de diagnóstico local de status de permissões, contagem de jobs, timestamp de reconcile, versão do app, códigos de erro sem nome de remédio nem dosagens.
- Telas de suporte podem exportar relatório **redigido e revisado** pelo usuário antes do compartilhamento.
- Nenhum envio automático de logs sensíveis na versão inicial.
- Testes de consistência: número de ocorrências próximas versus jobs agendados; status 'alertas precisam de atenção' quando cobertura insuficiente.

## Política de feedback

- Feedback positivo somente após persistência confirmada.
- Não mostrar 'Tomei' automaticamente depois de notificação enviada.
- Histórico diferencia 'Tomei (informado pelo usuário)' de 'Aguardando confirmação'.
- Falha grave de agendamento é informada na inicialização/ajustes com CTA claro.
