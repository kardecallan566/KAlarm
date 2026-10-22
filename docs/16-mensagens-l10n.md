# 16 — Textos do produto, exemplos de notificações e localização

## Linguagem de produto

Tom humano, sereno, não acusatório e orientado à ação; linguagem pt-BR de fácil leitura. Evitar “você falhou”, “você perdeu o remédio” e “dobrar próxima dose”.

| Contexto | Texto proposto |
| --- | --- |
| Bem-vindo | “Organize seus lembretes de medicamentos com tranquilidade.” |
| CTA cadastro | “Adicionar medicamento” |
| Campo | “Nome do medicamento” |
| Rotina | “Como as doses se repetem?” |
| Sem dose | “Sem dose programada” |
| Próxima ocorrência | “Próximo lembrete às 08:00” |
| Antes de salvar | “Confira se os horários e quantidades correspondem à sua prescrição.” |
| Confirmar | “Confirmar que tomei” |
| Ação adiar | “Lembrar novamente” |
| Sem confirmação | “Ainda não confirmado” |
| Permissão negada | “Notificações desativadas. O calendário continua disponível, mas não podemos enviar lembretes.” |
| Agendamento falhou | “Sua rotina foi salva, mas alguns avisos não puderam ser programados.” |
| Fuso alterado | “O fuso do celular mudou. Confira seus próximos lembretes.” |
| Sem dados | “Você ainda não cadastrou medicamentos.” |

## Notificação em modo privado (padrão proposto)

Título: “Hora do seu lembrete” — corpo: “Abra o KAlarm para conferir os detalhes”. Dentro do app, exibir nome e dose; permitir optar por mostrar detalhes na tela bloqueada.

## Notificação com detalhes permitidos

Título: “Medicamento A — 08:00” — corpo: “Dose programada: 0,5 comprimido”. Dados fictícios. Botões: “Tomei”, “Adiar” e “Detalhes” conforme suporte real.

## Pluralização e dados regionais

- “1 comprimido”, “2 comprimidos”, “0,5 comprimido”; “1 cápsula”, “2 cápsulas”; “2,5 mL”.
- pt-BR exibe vírgula decimal; armazenamento canônico usa ponto decimal.
- Data exibida em formato local legível: “quarta-feira, 21 de outubro”; internacionalização prevista com catálogo de chaves, sem strings hardcoded em lógica.
- Horários em 24h por padrão brasileiro, com preferência de formato se internacionalizar.
- Dose e horário devem ter descrição acessível por leitor de tela, nunca somente símbolos.

## Aviso de uso seguro

“O KAlarm organiza lembretes que você configura. Confirme seus dados com a prescrição e siga a orientação do profissional de saúde. Notificações podem depender das permissões e configurações do aparelho.”
