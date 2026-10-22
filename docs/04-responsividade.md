# 04 — Responsividade, tablets e acessibilidade

## Princípio

**Adaptar-se à largura da janela disponível**, não ao modelo do telefone. O mesmo celular pode abrir janela dividida e um dobrável muda de dimensão ao vivo. A interface não pode simplesmente esticar um layout vertical.

## Classes de largura de projeto (limiares internos, não requisitos do Android)

| Largura útil | Layout proposto | Navegação |
| --- | --- | --- |
| < 360dp | Compacto estreito | Uma coluna, sem ícones decorativos em linhas densas |
| 360–599dp | Telefone padrão | Uma coluna, cartões largos e tabs inferiores |
| 600–839dp | Tablet/dobrável intermediário | Duas colunas em telas adequadas, barra lateral curta |
| >= 840dp | Tablet largo / janela grande | Master/detail, calendário + detalhe, navegação lateral |

**Altura** também importa: paisagem em celular deve permitir rolagem; alarme com botão visível e scroll caso necessário.

## Adaptação por tela

- Início compacto: hero + lista abaixo; expandido: hero e cronograma do dia em duas colunas.
- Editor semanal: telefone usa chips horizontais/grade compacta e detalhe do dia abaixo; tablet usa grade 7 dias + painel de slots lado a lado.
- Calendário: telefone mês/semana + bottom sheet de detalhes; tablet calendário + painel lateral fixo.
- Histórico: lista única no telefone; filtros e detalhes em painel no tablet.
- Cadastro: formulário centrado com largura máxima de 560dp mesmo em tela enorme; no tablet pode mostrar prévia lateral.
- Alarme: concentração visual; conteúdo sem cortes, respeitando font scale e safe area.

## Medidas mínimas e zonas seguras

- Não usar valores fixos em pixels físicos; medidas RN em dp e dimensões reativas.
- Nunca posicionar botões sobre barra de gestos, notch, teclado ou recorte/câmera.
- Preferir `flex`, `maxWidth`, `minWidth` e `useWindowDimensions` à leitura estática de tamanho na inicialização.
- Campos e botões precisam sobreviver a 200% de texto ampliado sem truncar dose.
- Fonte e ícones aumentam proporcionalmente quando essenciais à decisão.

## Matriz de validação de layout

- 320×568dp, 360×640dp, 393×852dp, 412×915dp.
- 600×960dp, 800×1280dp, 1024×768dp e janela dividida redimensionável.
- Paisagem com pouca altura, fontes 100%/150%/200%, teclado aberto, leitor de tela.
- Sistema claro/escuro, alto contraste, redução de movimento, navegação por teclado/hardware quando possível.
- Controles devem manter estado quando girar, dobrar ou redimensionar o app.

## Metas objetivas de acessibilidade

- WCAG 2.2 AA como referência: contraste texto >= 4,5:1, elementos gráficos essenciais >= 3:1.
- Alvo de toque >= 48dp como escolha de design e foco perceptível.
- Mensagem de erro descritiva associada ao campo; nada apenas em vermelho.
- Ordem de leitura sem ambiguidades em tablet, botão de ação fora da navegação destrutiva.
- Ações de notificação acessíveis ao TalkBack/VoiceOver, incluindo unidades e horários falados claramente.
