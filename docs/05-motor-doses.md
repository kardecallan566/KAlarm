# 05 — Motor de doses: lógica formal e decisões de domínio

## Princípios invariantes

1. O calendário gera **ocorrências previstas** sem depender de notificação/Internet.
2. Confirmação é **evento explícito e independente** do cálculo.
3. Semana e ciclo contínuo são modos diferentes; **ausência de confirmação não reinicia, pausa nem avança ciclo**.
4. Alteração de regra futura cria nova revisão; histórico anterior permanece.
5. Sem horário = nenhum evento. **Sem dose** é opção explícita; 0 não é dose administrável.
6. Dose usa representação decimal exata (string normalizada), unidade separada da concentração.

## Cinco tipos de rotina

| Modo | Regra de repetição | Exemplos fictícios |
| --- | --- | --- |
| DAILY | Mesma lista de slots todos os dias | 08:00 1 comprimido |
| WEEKDAYS | Lista de dias selecionados + slots fixos | seg/qua/sex 08:00 1 |
| WEEK_MATRIX | Cada dia ISO 1..7 tem lista própria | seg 1, ter 2, qua 3 às 08:00 |
| CYCLE_N | N etapas, âncora local YYYY-MM-DD, cada etapa lista de slots | 1/2/3/4 alternando independente da semana |
| DATE_PLAN | Datas individuais com listas de slots | 01/11 e 04/11 diferentes |

Um **slot** = horário local, quantidade positiva e unidade. Pode haver muitos slots no mesmo dia, inclusive no mesmo horário; perguntar quando parecem duplicados, mas não proibir múltiplos medicamentos diferentes. Não fundir duas ocorrências distintas.

## Representação de tempo

- Datas locais `YYYY-MM-DD`, horas `HH:mm`, identificador IANA do fuso e horário absoluto para cada ocorrência materializada.
- Fuso da rotina deve ter política explícita (padrão proposto: **horário local do tratamento no fuso cadastrado**, avisar quando usuário viaja). Oferecer futuramente 'seguir fuso do dispositivo' com confirmação.
- Ciclo N: `index = positiveModulo(calendarDayDifference(localDate, anchorLocalDate), N)`. Diferença em **dias de calendário local**, não divisão de milissegundos por 86.400.000.
- Anterior à âncora/início não gera ocorrências; término é inclusivo em sua data local.
- Data de exceção supera regra base **somente na data**. Lista vazia = sem dose explícita.
- DST com hora inexistente/ambígua: definir e documentar política antes de implementar (ver ADR); motor não pode escolher silenciosamente sem teste.

## Validação de quantidade

- Aceitar entrada pt-BR `0,5` ou `2,5`, normalizar para `"0.5"` / `"2.5"` na camada de domínio.
- Rejeitar valores negativos, vazios, NaN, infinito e excesso de casas decimais além da precisão definida por unidade.
- Stepper +/- não pode ser único meio de entrada: tipos de frações requerem input decimal ou seletor adequado.
- Evitar automaticamente converter '5 mg por comprimido' em 'número de comprimidos'. Mostrar campos separados.
- Apresentar unidades completas: 1 comprimido, 2 comprimidos; 1 mL; 0,5 comprimido.

## Edição e versões

- 'Só esta data' cria/atualiza DateOverride, não toca no plano principal.
- 'Desta data em diante' encerra efetividade da versão antiga antes do marco e cria versão nova.
- Se a edição conflita com tomada confirmada naquele dia, mostrar revisão e exigir escolha explícita, sem modificar registro confirmado.
- Pausar = não gerar futuras ocorrências enquanto pausa ativa; retomar com regras de calendário originais, sem “recuperar” todas como próximas doses.
- Encerrar = impedir novas ocorrências após data de término; manter logs.

## Determinismo e idempotência

- Gerar IDs estáveis para ocorrências pela combinação de schedule-version + date + slot-id + índice de desambiguação.
- Calcular janelas sem produzir duplicatas: mesmo input + fuso + versão → mesmo resultado.
- Agendamentos no passado não viram automaticamente 'tomar agora'.
- Há distinção entre **agendado**, **notificado/entrega incerta**, **confirmado**, **adiado** e **não confirmado**.

## Casos de fronteira obrigatórios

- Domingo→segunda no ciclo de 2/4/9 etapas; ano bissexto; 28/29/30/31; 31/12→01/01.
- Horários entre 23:50 e 00:10; duas tomadas iguais; múltiplas medicações no mesmo minuto.
- Um dia de ciclo sem dose; 2 horários num dia e 0 no próximo.
- Mudança de fuso, DST 23h/25h, opção de seguir fuso; mudança manual de relógio do aparelho.
- Exceção no dia 2 do ciclo, seguida pelo dia 3 normal sem deslocamento.
- Esquecimento, edição retroativa e confirmação duplicada.
