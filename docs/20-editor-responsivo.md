# 20 — Layout responsivo e contrato do editor de doses

## Proposta de breakpoints por largura DISPONÍVEL

| Janela | Navegação | Editor de doses |
| --- | --- | --- |
| `<600dp` | barra inferior | coluna única; dia selecionado com horários abaixo |
| `600–839dp` | barra inferior ou rail compacto | grade semanal + painel de edição abaixo ou ao lado conforme espaço real |
| `>=840dp` | rail lateral | grade/lista à esquerda e painel de edição simultâneo à direita |

Os valores são **heurísticas de layout**, não limites rígidos por modelo de dispositivo. Usar `useWindowDimensions()`, `SafeAreaInsets`, escalabilidade de fontes e `ScrollView`; ao abrir o teclado, manter o campo e o botão de salvar visíveis. Não forçar largura, orientação nem tamanho de fonte.

## Editor semanal: fluxo de estados

```
Medicamento
  -> Escolher modalidade
  -> Semana / ciclo / datas
  -> Dia selecionado
      -> 0..N horários
         -> horário local + quantidade + unidade
      -> copiar dia / sem dose / exceção
  -> prévia 14/30 datas
  -> confirmar regras -> persistir -> agendar notificações
```

### Contrato de interação

- Card de dia mostra nome completo no contexto apropriado, contagem de horários e resumo de dose. Na grade compacta, abre painel de detalhes acessível.
- Slot mostra **horário**, **quantidade textual** e **unidade**. Editar horário não deve alterar o valor da dose.
- Campo de quantidade aceita entrada direta com teclado decimal; botões +/- opcionais **nunca são única forma** de entrada.
- Seleção `Sem dose` remove slots **somente após confirmação**, quando dados já existem.
- Copiar configuração de um dia para outro exige confirmação de substituição, não acumula silenciosamente slots.
- Ações finais: `Voltar`, `Salvar rascunho` e `Revisar programação`; ativação acontece depois da prévia.
- Em caso de erro de permissão, a rotina pode ser salva, mas deve ficar visivelmente **sem alertas ativos** até resolver o problema.

## Comportamento em acessibilidade

- Ordem de foco: cabeçalho -> modalidade -> dia -> horários -> ações -> salvar.
- Rótulo de ícone como “Editar horário das 08:00 de segunda-feira” no elemento interativo pai.
- Diálogos de confirmação com foco inicial em opção não destrutiva.
- Acionadores de dose não usam somente cor para diferenciar seleção.
- Testar com fonte 200%: grade de dias pode virar lista vertical sem cortar o conteúdo.
- O usuário pode alternar entre formato de relógio 12/24 horas conforme idioma/configuração, sem modificar valor normalizado da hora.

## Dados e visualização

- A prévia **não é registro de tomada**; é projeção do calendário.
- `confirmed` depende de evento explícito no histórico.
- Fotos e nomes podem ser ocultados em notificações na tela bloqueada (preferência de privacidade).
- Em tablets/foldables, o estado do editor deve sobreviver a redimensionamento; não resetar valores quando breakpoint mudar.

Mockup estático: `../softcare-responsive-preview.png`.
