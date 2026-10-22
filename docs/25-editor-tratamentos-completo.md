# 25 — Editor de medicamentos: contrato completo de interação (v4)

## Princípio: poder sem complexidade

O editor mostra **a opção simples primeiro**, oferecendo edição avançada dentro da mesma estrutura; nunca obriga o usuário com dose fixa a preencher uma grade semanal.

## Passos

1. **Identificar:** nome obrigatório, apresentação, concentração em texto opcional (ex.: 5 mg/comprimido), unidade da quantidade tomada (`comprimido`, `cápsula`, `gota`, `mL`, `outro`), foto opcional.
2. **Rotina:** diária fixa, dias selecionados, semanal com horários por dia, ciclo de N dias ou datas específicas. Ciclo exige data âncora real.
3. **Editar horários:** cada dia/etapa contém 0..N slots. Cada slot tem hora civil `HH:mm`, quantidade exata com precisão decimal, unidade e ID estável.
4. **Revisar:** mostrar calendário e resumo de 14 dias (mínimo), comparar mudanças antes/depois, alertar sobre conflitos e dados incompletos.
5. **Ativar:** confirmar; persistir a rotina e iniciar reconciliação. Se o agendamento de alertas falhar, manter uma faixa visível “Rotina salva, mas alarmes desativados”.

## Tela do dia

- Cabeçalho: **Terça-feira**; chip `2 horários`; botão `Copiar programação`.
- Slots em cartões com horários grandes (`08:00`), dose (`0,5 comprimido`) e ações `Editar`, `Remover`.
- `Adicionar horário` abre editor acessível com seleção de tempo nativa e entrada manual de quantidade.
- Ação **Sem dose neste dia** precisa de confirmação se substituir slots existentes.
- Caso dia nunca tenha sido configurado, exibir **Ainda não configurado** (diferente de zero doses).
- Permitir arrastar/reordenar apenas como conveniência; ordem persistida sempre cronológica.

## Quantidades e unidades

- Entrada decimal localizada: `0,5`, `1,25`, `2,5`. Internamente armazenar string decimal canônica (`"0.5"`).
- O indicador de concentração em `mg` NÃO vira automaticamente quantidade em comprimidos. Ex.: concentração `5 mg/comprimido`; tomada configurada `2 comprimidos` — exibir exatamente esses campos.
- Não calcular “meio comprimido” como fracionamento físico permitido; apenas permitir registrar fração quando é o esquema informado.
- Unidades são rótulos explícitos; seleção entre unidade e concentração sempre distinguível.
- Rejeitar valores inválidos, negativos, incompletos e zero. **Dia sem dose = lista vazia confirmada**, não quantidade zero.

## Operações de edição

| Operação | Efeito | Segurança |
| --- | --- | --- |
| Editar horário | Altera um slot na nova versão | Revisar impacto futuro |
| Trocar quantidade | Altera somente o slot correspondente | Exibir antes/depois |
| Copiar dia | Seleciona destinos explicitamente | Perguntar se substituir; não somar silenciosamente |
| Pausar rotina | Suspende alertas futuros | Não reescrever histórico |
| Retomar | Cria/reativa versão efetiva | Prévia e reconciliação |
| Alterar só uma data | Adiciona override com data exata | Preserva série base |
| Alterar a partir da data | Cria versão nova com effectiveFrom | Histórico anterior imutável |
| Encerrar tratamento | Data final e cancelamento de futuros | Confirmação e opção de desfazer quando viável |

## Conflitos e limites

- Dois medicamentos às 8:00: exibir duas ocorrências distintas, não considerá-las erro clínico.
- Dois horários iguais do mesmo medicamento: destacar possível duplicata de cadastro e pedir confirmação específica; não fundir automaticamente.
- Dose fracionada: formato textual em português com leitor de tela falando unidade.
- `Sem dose` em terça não significa “tomou zero”; não criar registro de ingestão.
- Após alterar regra, identificar ocorrência já confirmada e **não recriá-la retroativamente**.
- Rascunhos salvos localmente, sem notificações ativas até confirmação final.

## Prévia obrigatória

- Semana: 7 dias, incluindo dias sem dose; horizonte avançado: 30 dias e navegação por mês.
- Ciclo: mostrar data âncora, índice da etapa e continuidade após domingo.
- Edição: comparação “antes” e “depois” em pelo menos 7 dias afetados.
- Confirmação final: “Confira se estes horários e quantidades correspondem à sua prescrição”. Sem recomendação clínica.

## Falhas transacionais

1. Persistir nova versão e marcar reconciliador como pendente na mesma transação SQLite.
2. Tentar reconciliar notificações fora da transação; salvar status real.
3. Se notificações falharem: dado cadastrado permanece intacto, app exibe aviso e opção de corrigir permissões/repetir tentativa.
4. A confirmação do usuário exige operação idempotente; toque repetido não gera duplicatas.

## Critério de aceite

Criar, em tela de 320dp e font scale 200%, uma semana com sete quantidades diferentes e dois horários na segunda, sem perda de dados ao girar, pausar ou retomar o app. Alterar terça a partir de data futura sem modificar histórico anterior; confirmar visualmente os próximos 30 dias.
