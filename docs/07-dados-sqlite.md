# 07 — SQLite: persistência, versões e migrações

## Padrão: offline-first

SQLite é a fonte local de verdade; componentes de UI consultam repositórios e nunca escrevem diretamente tabelas. Todo agendamento é versionado. O esquema abaixo é uma **proposta** sujeita a migração e testes.

## Tabelas previstas

| Tabela | Chaves/dados principais | Observação |
| --- | --- | --- |
| `medications` | id PK, name, form, strength_label?, unit_default?, image_ref?, created_at | Entidade estável |
| `schedules` | id PK, medication_id FK, status, timezone, created_at | Identidade da rotina |
| `schedule_versions` | id PK, schedule_id FK, revision, effective_from, effective_until?, start_date, end_date?, mode, recurrence_json | Não mutar revisões passadas |
| `overrides` | id PK, version_id FK, local_date, plan_json | Única exceção ativa por versão/data |
| `occurrences` | id PK, version_id FK, slot_id, local_date, planned_at_utc, amount_snapshot, unit_snapshot | Materialização local de janela, `UNIQUE` por identidade lógica |
| `intake_events` | id PK, occurrence_id FK, event_type, event_at_utc, actual_taken_at_utc?, source | Evento imutável; reversão é outro evento |
| `notification_jobs` | id PK, occurrence_id FK, native_id?, scheduled_at_utc, state, failure_code?, checked_at? | Resultado da tentativa nativa |
| `preferences` | key PK, value_json | Acessibilidade, modo privado, som etc. |
| `schema_migrations` | version PK, applied_at | Processo de migração rastreável |

## Constraints e consistência

- Todas as FKs habilitadas e testadas; migrações com transação e rollback.
- `schedule_versions` por rotina não podem ter intervalos de efetividade conflitantes.
- `overrides` com `UNIQUE(version_id,local_date)`.
- `occurrences` devem ter índice composto para `planned_at_utc` + busca por `medication_id`, e identidade única estável.
- `intake_events` event-sourced: eventos não substituem logs silenciosamente.
- Considere tabela extra para fila de escrita idempotente disparada pela ação de notificação quando app inicia do background.
- Ordenar calendário por hora planejada, com empate estável por ID; não usar posição no array como ID.

## Atomicidade de edição

1. Validar um novo plano no domínio.
2. Calcular prévia de datas afetadas.
3. Em transação: persistir nova revisão e fechar antiga; atualizar exceções; marcar ocorrências futuras obsoletas.
4. **Depois do commit local**, reconciliar notificações nativas. Falhas nativas são registradas como pendentes de retry.
5. UI comunica “rotina salva, porém notificações precisam de atenção” em vez de alegar sucesso completo.

## Migrações e backup

- Nunca resetar dados de usuário ao atualizar uma versão.
- Fazer backup de teste antes de migrations destrutivas; testar upgrades v1→v2, v2→v3 e rollback quando cabível.
- Política para backup do sistema: decidir se os dados são elegíveis e protegidos adequadamente; não presumir criptografia do SQLite por padrão.
- Exportação manual futura: arquivo local opcional criptografado, com avisos de sensibilidade e exclusão; importação com validação de schema e IDs.
- Fotos de embalagem exigem política separada de proteção; não assumir que URI é segura.

## Resiliência

- Recuperar transação interrompida sem agendar notificações duplicadas.
- Dados de notificação nativos perdidos → reconstruir jobs de ocorrências futuras sem tocar intake_events.
- Mudança de dispositivo não implica continuidade dos alarmes sem backup/restauração feita e testada.
