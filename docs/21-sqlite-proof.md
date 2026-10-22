# 21 — SQLite: migração e validação inicial

Arquivos: `proofs/sqlite/migrations/0001_core.sql`, `proofs/sqlite/tests/test_schema.py`.

A migração experimental define `medications`, `schedule_versions`, `date_overrides`, `dose_occurrences`, `intake_events`, `notification_outbox` e `app_preferences`.

### Testar

```bash
cd proofs/sqlite
python3 -m unittest discover -s tests -v
```

Resultado local: **7 testes aprovados** (restrições de chaves estrangeiras, exclusividade de revisões, duplicidade de ocorrências, confirmação sem horário real, idempotência, outbox única e JSON inválido).

### Regras importantes

- `PRAGMA foreign_keys=ON` precisa ser aplicado **em toda conexão**, não só na migration.
- IDs de ocorrência dependem de uma versão de programação; eventos de histórico são append-only.
- A `event_key UNIQUE` previne dois registros para o mesmo evento originado de uma ação repetida.
- O banco contém informação sensível. **SQLite padrão não é criptografia em repouso**, portanto o pacote não deve ser considerado pronto para armazenar dados pessoais reais sem revisão de segurança.
- Restrições de formato JSON no SQL não substituem validação de domínio no TypeScript.

### Ainda não implementado

- Adaptação do SQL para `expo-sqlite` e esquema de migrations da aplicação.
- Validação cross-field entre ocorrência e versão do mesmo medicamento.
- Atualizações atômicas envolvendo regras, ocorrências e cancelamento/agendamento de alarmes.
- Política de backups, criptografia de dados sensíveis e exclusão definitiva.
- Testes de migração de versões anteriores e restauração de backup.

Esta é uma **prova de esquema de dados**, não um banco de dados em produção.
