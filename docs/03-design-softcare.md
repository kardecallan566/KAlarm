# 03 — Design System SoftCare

## Direção visual

**Hospital humanizado + ilustração editorial suave**: aparência profissional sem frieza clínica; infantilidade excessiva não é aceitável. Priorizar legibilidade da dose, não ornamentos.

## Design tokens propostos

| Token | Valor | Uso |
| --- | --- | --- |
| bg.canvas | #F7FAF8 | Fundo principal |
| bg.card | #FFFFFF | Superfícies |
| bg.mint | #E0F1E7 | Cards de cuidado |
| accent.green | #2F7659 | Ação principal (ver contraste local) |
| accent.blueSoft | #E4F0F8 | Calendários e horários |
| accent.peachSoft | #FFF0E4 | Ilustrações e estados positivos suaves |
| accent.lavenderSoft | #EFEAFB | Ciclos alternados |
| text.primary | #263D33 | Títulos |
| text.secondary | #526B5F | Apoio |
| border.subtle | #E0EBE4 | Bordas |
| focus | #205EAA | Foco/seleção perceptíveis |

A paleta deve ser refinada com teste real de contraste para cada par cor/fundo. Nunca usar texto pastel sobre branco. Não usar verde isoladamente como sinal de tomada.

### Tipografia e espaçamento

- **Nunito Sans** para títulos/corpo se o licenciamento e o peso estiverem corretos; fallback nativo compatível.
- Base 16sp, secundário 14sp, título de tela 24sp, horário destacado 32–40sp, dose em alarme 24–32sp, respeitando escala do SO.
- Grade de espaçamento 4/8/12/16/24/32; raio de cartões 20–24, campos 12–16, botões 16.
- Área mínima de toque planejada: 48×48dp, preferencialmente 52–56dp em ações críticas.
- Movimento 150–250ms com preferência de sistema 'reduzir movimento'; nada piscando no alarme.
- Som e vibração configuráveis sem depender deles para transmitir status.

## SoftCare Icons — família autoral

**Grade-mestre:** SVG viewBox 64×64, stroke 2,5–3,5, `strokeLinecap=round`, `strokeLinejoin=round`, cantos arredondados, contorno escuro, preenchimentos sólidos pastéis, pequenos detalhes de personalidade somente em tamanhos grandes. Três variantes: 24dp simplificada, 32–48dp normal e 64dp ilustrativa. Exportação como componente React Native via `react-native-svg`, sem fontes proprietárias ou assets externos não licenciados.

**Catálogo planejado (32):** navegação (home, medicines, calendar, history, settings), forma (pill, capsule, drops, liquid, blister, bottle), rotinas (clock, daily, weekday, rotate, repeat, date, duration), alarmes (bell, alarm, snooze, silent, pending, permission), ações (plus, edit, delete, confirm, pause, copy, save), estados (taken, unresolved, overdue, empty). Os nomes são IDs do projeto, não ícones prontos.

**Ícone do app:** cápsula com detalhe de relógio/coração em fundo menta; produzir adaptive icon com foreground separado, monocromático para tema Android e splash minimalista. Verificar legibilidade em 48px e no launcher em modo claro/escuro.

## Componentes de interface

- `AppShell`: safe areas, barra inferior compacta, navegação lateral em tablet.
- `MedicationCard`: identificação, próximo horário, unidade e estado.
- `ReminderHero`: grande destaque para próxima tomada.
- `DoseDayTile`: nome dia, resumo, foco/seleção e indicação textual sem dose.
- `DoseSlotCard`: hora, quantidade, unidade, ações; com expansão para edição.
- `DoseAmountField`: teclado numérico, decimais confiáveis; não depender do stepper.
- `ConfirmationDialog`: mostra ação, consequências e opções cancelar/confirmar.
- `StatusChip`: ícone + texto + contraste adequado.
- `EmptyState`: ilustração SoftCare + texto e ação recomendada.
- `NotificationHealthCard`: permissão/capacidade testável, mensagem clara.

## Propriedades de todos os componentes

Estados normal/pressionado/foco/desabilitado/erro/carregando; VoiceOver/TalkBack labels; loading idempotente; comprimento de texto variável; suporte a teclado, landscape e dark mode do sistema **via tema claro deliberado** sem texto ilegível; teclado nunca encobre a ação principal.

## Bibliotecas e regras de entrega

- Ícones próprios versionados em assets e renderizados com `react-native-svg`.
- Ícones de sistema provisórios apenas no desenvolvimento; todos os pontos críticos seguem família autoral antes do beta.
- Evitar sombras pesadas, gradientes brilhantes, microtextos e emojis no lugar de ícones funcionais.
- Criar uma 'galeria de ícones' de homologação: 24/32/48/64dp, temas, fundo contrastante e escala de cinza.
