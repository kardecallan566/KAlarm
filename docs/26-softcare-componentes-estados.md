# 26 — Especificação visual finalista SoftCare (v4)

## Princípios

O visual deve ser **acolhedor, limpo e personalizado**, com personalidade nas ilustrações e ícones, mas alto contraste nas informações clínicas. Evitar estética de brinquedo, alarmismo e excesso de microanimações.

## Tokens em revisão (sujeitos a auditoria de contraste)

| Tipo | Token | Valor |
| --- | --- | --- |
| Fundo | `surface.canvas` | `#F7FAF8` |
| Cartão | `surface.card` | `#FFFFFF` |
| Menta | `surface.mint` | `#E0F1E7` |
| Primário | `action.primary` | `#2F7659` |
| Azul suave | `accent.blue` | `#E4F0F8` |
| Pêssego | `accent.peach` | `#FFF0E4` |
| Texto primário | `text.primary` | `#263D33` |
| Texto secundário | `text.secondary` | `#526B5F` |
| Divisória | `border.subtle` | `#E0EBE4` |

Paleta é ponto de partida, não certificado de contraste. Verificar pares reais com WCAG 2.2 AA (texto comum >= 4,5:1, controles gráficos relevantes >= 3:1).

## Hierarquia

- Hora e quantidade: informação de primeiro nível, 24–36sp (com escala dinâmica), texto completo disponível ao leitor de tela.
- Títulos: Nunito Sans Semibold/Bold, 22–28sp; texto comum 16–18sp e apoio >=14sp quando possível.
- Cards: cantos 20–24dp; botões principais 52–56dp; targets críticos >=48×48dp.
- Ícones SoftCare: viewBox 64×64, linecaps redondos, traço 2,5–3,5, preencher pastel; variantes small/normal/illustrative.
- Ilustração acolhedora em telas vazias/sucesso, jamais no lugar de informação necessária.

## Sistema de componentes e variantes

| Componente | Estados obrigatórios | Particularidades |
| --- | --- | --- |
| `PrimaryButton` | padrão, pressionado, focado, desabilitado, carregando | prevenir duplo clique |
| `MedicationCard` | ativo, pausado, sem alarmes | nome + dose + próximo horário |
| `DoseSlotCard` | leitura, edição, erro | jamais ocultar unidade |
| `DoseDayTile` | vazio não-configurado, sem dose, com slots, selecionado | texto junto de cor/ícone |
| `DoseAmountInput` | vazio, válido, inválido, teclado aberto | input direto e suporte decimal |
| `ReminderHero` | próximo, em horário, vencido não confirmado | dose + HH:mm dominantes |
| `AlarmPermissionCard` | permitido, parcial, negado, desconhecido | botão de revisão |
| `HistoryRow` | confirmado, não confirmado, anulado | proveniência da confirmação |
| `DialogConfirm` | mudança, pausa, excluir, substituir | ação destrutiva secundária |
| `EmptyState` | sem remédios, sem histórico, sem conexão (quando aplicável) | ilustração + CTA |

## Animações, sensibilidade e feedback

- Transições discretas 150–250ms, desativáveis com reduzir movimento.
- Após `Confirmar que tomei`: feedback textual persistente e símbolo de confirmação; não confetes.
- Em falha de alarme: ícone de atenção legível + mensagem real; não só cor vermelha.
- Skeleton apenas quando necessário; dados locais devem aparecer rápido e sem piscar.

## Guia SoftCare Icons (35 SVGs locais na v3)

1. Auditar padronização de espessura, padding e curvas dos 35 arquivos existentes.
2. Criar versão 24dp **realmente simplificada** (não apenas redimensionada) de símbolos complexos.
3. Testar fundo creme/branco/menta e escala de cinza.
4. Auditar semântica em ações: coração é decorativo, check representa confirmação, sinos representam alarme, nunca diagnóstico.
5. Produzir adaptive icon separado (foreground/background/monochrome), splash e imagens de loja após decidir nome comercial.

## Responsividade e acessibilidade

- `<600dp`: navegação inferior, 1 coluna, editor do dia abaixo da grade ou lista.
- `600–839dp`: rail compacto ou navegação adaptada; editor lado a lado só com altura suficiente.
- `>=840dp`: navegação lateral, calendário/detalhe ou lista/editor em dois painéis.
- `>=1200dp`: largura máxima dos formulários; não esticar campos em toda a tela.
- Janela redimensionada no meio da edição preserva estado e foco; dobrável pode alternar layout sem recarregar dados.
- Testar 320/360/393/412/600/840/1024dp, paisagem, fonte 100/150/200%, teclado aberto, TalkBack/VoiceOver, foco por teclado, alto contraste, temas claro/escuro do sistema.

## Revisão visual para concluir CP01–02

- Galeria de ícones a 24/32/48/64dp; fotos comparativas celular compacto/tablet.
- Telas: onboarding, home vazia/cheia, cadastro, editor semanal, editor ciclo, prévia, alarme, calendário, histórico, permissões, configurações, erro, exclusão.
- Revisão de copy: simples, sem jargão técnico e sem afirmar medicação tomada sem registro explícito.

Fonte de classes de janela Android: https://developer.android.com/develop/ui/views/layout/use-window-size-classes
