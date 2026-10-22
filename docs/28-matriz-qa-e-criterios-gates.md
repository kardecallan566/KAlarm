# 28 — QA, cenários de borda e critérios de aceite por release (v4)

## Testes automáticos obrigatórios

### Calendário e recorrência

- Diário, semanal, dias selecionados, ciclo de 2/3/4/7/8/30 dias e data âncora fora da semana atual.
- Virada de mês/ano, 29 de fevereiro, meses de 28/30/31 dias.
- Horário civil em zona com horário de verão e sem horário de verão.
- Exceção na data exata sobre ciclo e semana; versão futura sem reescrever eventos passados.
- Doses `0.5`/`1.25`/`2.5` com unidade mantida; tentativas de texto inválido e valores negativos rejeitados.
- Múltiplas tomadas por dia; dois medicamentos com mesmo horário; IDs distintos e idempotência.

### Persistência e confirmação

- Migração do SQLite a partir de cada versão suportada.
- Salvar/pausar/editar/excluir/recarregar sem perder slots.
- Duplo toque `Tomei`, restauração do app no meio do registro, correção posterior auditável.
- Não confirmar automaticamente por notificação entregue, dispensada ou aberta.
- Recuperação após erro SQLite e cancelamento/reagendamento parcial.

### UI e acessibilidade

- Navegação com TalkBack; foco/labels de doses e unidades, elementos de toque adequados.
- 320/360/412/600/840/1024dp e janela dividida em dispositivos que suportam.
- Escala de fonte 100%/150%/200%, com teclado aberto e orientação alternada.
- Sem perda dos rascunhos ao redimensionar ou voltar do app para segundo plano.
- Cores auditadas em combinações reais, tamanhos pequenos de ícone, estados vazios e erro.

## Matriz física de alarmes

| Ambiente | Casos mínimos |
| --- | --- |
| Android API 33–36 (conforme aparelhos disponíveis) | Permissões, exatidão, modo economia, reboot, app encerrado |
| Fabricantes OEM diversos | Testar políticas de bateria diferentes; registrar atraso real |
| iOS quando suportado | Foco/silencioso, encerrado, limite de pendentes, mudança de fuso |
| Aparelho sem internet | Cadastro, cálculo e lembretes locais previamente agendados |
| 7/14/30 dias sem abrir app | Validar janela de alarmes variáveis ou documentar lacuna |
| Restore ou migração | Reconciliar nova agenda sem reutilizar IDs nativos obsoletos |

## Gates (passagem obrigatória)

**Gate A — Motor:** 100% da suíte de domínio e migrações passando; nenhum bug conhecido de dose/calendário para casos suportados.

**Gate B — Editor:** qualquer programação aceita pelo modelo pode ser cadastrada/corrigida pela UI e revisada; sem operações destrutivas silenciosas.

**Gate C — Alarmes:** evidência em aparelho de que alarmes suportados funcionam nas condições declaradas; permissões e falhas visíveis; não prometer disponibilidade nas condições não verificadas.

**Gate D — Dados/privacidade:** política publicada, Data safety baseada no binário, armazenamento e backup coerentes com declarações; nenhuma falha crítica de exposição.

**Gate E — Publicação:** build Android assinado, API target aplicável, declaração de saúde, alarmes exatos conforme política, store listing, testes exigidos da conta e rollout monitorado.

## Bug blocking / severidade

- **Bloqueia release:** dose errada, recorrência alterada por esquecimento, confirmação fantasma, alerta silenciosamente desabilitado, histórico perdido, vazamento de dados.
- **Alta:** CTA inacessível em celular comum, crash no cadastro, alarmes duplicados/obsoletos.
- **Média:** desalinhamento de ícone, pequeno atraso de animação, desalinhamento sem impacto funcional.

## Evidência

Para cada gate: commit/build, versão do sistema, aparelho, resultado do teste, screenshots redigidas sem dados pessoais e risco remanescente. Sem evidência, status = `planejado`, não `concluído`.
