# 30 — Registro de decisões v4 e pendências finais

**Nota:** “Direção adotada” é decisão de planejamento. “Validada” somente após teste ou implementação concreta.

| ID | Decisão | Estado |
| --- | --- | --- |
| ADR-012 | O editor funciona por slots diários com lista 0..N e IDs estáveis | Direção adotada |
| ADR-013 | Dia sem dose é explícito e diferente de não configurado | Direção adotada |
| ADR-014 | Alteração futura cria versão efetiva, sem alterar histórico passado | Direção adotada |
| ADR-015 | Confirmação tem evento idempotente independente do agendamento | Direção adotada |
| ADR-016 | Alarmes salvos no SO não equivalem a entrega garantida | Direção adotada |
| ADR-017 | Notificação discreta na tela bloqueada por padrão | Direção adotada |
| ADR-018 | Backup não é anunciado até restauração segura comprovada | Direção adotada |
| ADR-019 | Layout responsivo segue janela disponível, não tipo de dispositivo | Direção adotada |
| ADR-020 | Lançamento Android primeiro; iOS posterior | Direção adotada |
| ADR-021 | Exigências Google Play revisadas novamente no lançamento | Direção adotada |

## Pendências bloqueantes antes de beta público

### PEND-01 — Alarmes sem abrir o app por semanas

Experimento de 7/14/30 dias e teste Android nativo para ciclos com payload variável; decidir adapter e janela de agendamento. **Não declarar resolvido.**

### PEND-02 — Timezone e horário de verão

Proposta: horários civis seguem o **fuso escolhido na rotina**, não automaticamente o fuso da viagem; ao detectar troca de fuso, avisar. Em horário civil inexistente/repetido, política final exige revisão de UX e implementação com biblioteca apropriada; não inventar um horário “compensatório”. **Decisão incompleta até teste.**

### PEND-03 — Criptografia / recuperação de dados

Validar SQLCipher, armazenagem da chave e backup/migração. Se não houver restauração, informar claramente sobre risco de perda ao desinstalar. **Pendente.**

### PEND-04 — Ação direta na notificação

Testar no Android/iOS e com lock-screen; a confirmação do usuário precisa ser inequívoca e idempotente. Se não for segura na ação direta, direcionar à tela do app. **Pendente.**

### PEND-05 — Modo de intervalos

“A cada 8 horas” é duração em horas transcorridas, não sinônimo de “08:00/16:00/00:00” em datas com DST. Não habilitar sem semântica documentada e aprovação de UX; propor opção apenas após MVP ou com regras explícitas. **Pendente.**

### PEND-06 — Responsividade real

Testar 320dp, 200% fonte, paisagem e tablets. **Mockup não significa usabilidade comprovada.**

### PEND-07 — Loja e nome

Verificar pacote, marca, texto final, autorização de alarmes, política e requisitos da conta antes de submissão. **Pendente.**

## Como encerrar pendência

Toda pendência fechada exige ADR com opção escolhida, motivo, evidência reproduzível, consequências, data e versão do aplicativo. Nenhum checkpoint passa a `concluído` somente porque a ideia está documentada.

## Ordem de decisão eficiente

1. Validar alarmes reais em Android (define viabilidade do produto).
2. Fechar timezone/DST e contratos do motor (define precisão).
3. Validar proteção de banco e backup (define segurança).
4. Testar editor com usuários e acessibilidade (define UX).
5. Preparar manifestos, política, testes e pacote Play (define distribuição).
