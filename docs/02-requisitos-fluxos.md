# 02 — Fluxos, mapa de telas e estados

## Mapa de navegação

- **Início:** saudação neutra, próximo evento, eventos do dia em ordem, botão 'Adicionar medicamento', avisos de permissão discretos mas visíveis.
- **Meus remédios:** busca/filtro de ativos/pausados, lista, ficha, ações editar/pausar/encerrar.
- **Calendário:** semana/mês, dose prevista por data, legenda e detalhe do dia, ações de exceção.
- **Histórico:** linha do tempo de confirmações, não confirmações e edições; filtros por período/medicamento.
- **Ajustes:** notificações, privacidade, acessibilidade, exportar/apagar, sobre, ajuda, diagnóstico e testar alerta.

### Estados vazios

- Sem remédios: ilustração simpática de caixa de medicamento, CTA “Adicionar primeiro remédio”.
- Dia sem doses: “Nenhuma dose programada para este dia”.
- Histórico vazio: “As confirmações que você fizer aparecerão aqui”.
- Permissão bloqueada: explicar qual recurso não funcionará, oferecer atalho para ajustes; não bloquear visualização.

## Onboarding

1. Apresentação em 1 tela: “Organize e receba lembretes das doses que você cadastrou.”
2. Aviso: o aplicativo não substitui a prescrição nem garante que todos os alertas sejam entregues.
3. CTA “Adicionar medicamento”; se escolher conhecer antes, navegar em demonstração não persistente.
4. Pedir notificações **após** revisão de um cadastro, com explicação do benefício.
5. Solicitar acesso a alarmes exatos **apenas se aplicável ao Android e ao fluxo**.

## Fluxo de cadastro guiado

| Etapa | Entradas | Validações e UX |
| --- | --- | --- |
| 1 — Identificar | Nome obrigatório, forma, concentração e observação opcionais | Nome legível; separar concentração da dose |
| 2 — Repetir | Fixo, dias selecionados, semanal, ciclo, datas especiais | Exemplos ilustrativos; explicar ciclo vs semana |
| 3 — Programar | Horas locais; quantidade/medida de cada slot; início/fim | Permitir vários horários, fracionar com teclado; sem dose explícito |
| 4 — Conferir | Prévia de 14–30 dias + resumo em texto | Mostrar os primeiros e últimos dias; confirmar antes de ativar |

Dados do formulário devem sobreviver à navegação, rotação, teclado, encerramento inesperado (rascunho opcional) e retorno da permissão do sistema.

## Editor semanal

- Cabeçalho com chips de segunda a domingo, resumo de quantidade ou 'Sem dose'.
- Dia aberto mostra **lista de slots**, não somente um contador.
- Cada slot tem HH:mm, quantidade decimal positiva, unidade e ações editar/remover.
- 'Copiar programação' exige escolher destinos; se destino contém slots, pedir confirmação de substituição.
- 'Sem dose neste dia' é explícito; não confundir com dia ainda não configurado.
- Input manual para 0,5 / 1,5 comprimido, 2,5 mL; botões +/- são auxiliares, não obrigatórios.
- As doses de terça de semanas diferentes só serão iguais no modo semanal. Ciclo contínuo segue âncora.

## Editor ciclo contínuo

- Selecionar **data âncora** e N etapas.
- Etapa 1 pode ter 1 slot, etapa 2 pode ter 3, etapa 3 pode ser sem dose.
- Prévia exibe datas reais para o usuário verificar a correspondência.
- Não há avance condicionado à confirmação.

## Histórico e interação

- Confirmar significa **declaração do usuário**: registrar hora da ação e opcionalmente hora informada do uso real.
- Descartar notificação não confirma tomada; atraso não determina tomada não realizada.
- Adiar = **adiar o lembrete da mesma ocorrência**, não mudar prescrição.
- Confirmar após horário: permitir registro retroativo com hora clara e validação; não sugerir tomar outra dose.
- Reverter confirmação: ação identificável, auditável localmente, jamais apagar registro sem trilha.
- Tela de edição: 'Só esta data' vs 'Desta data em diante'; mostrar comparação antes/depois.

## Acessibilidade nos fluxos

- Títulos claros, leitura da dose em voz compatível com leitor de tela, foco ordenado.
- Botão de confirmação longe de excluir/adicionar; pedir confirmação quando houver risco de toque involuntário.
- Gestos nunca exclusivos: toda ação de arraste também funciona por botão.
