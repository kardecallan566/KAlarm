# 12 — Plano de QA, testes e matriz de dispositivos

## Pirâmide de testes

1. **Unitários (core):** recorrência, calendário local, alternância, período de efetividade, slots, exceções, decimais, IDs estáveis.
2. **Integração SQLite:** CRUD, versões, transações, migrations, dados antigos, no-confirmation, notificações idempotentes.
3. **UI:** formulários, validação, teclado, botões críticos, rotação e fonte ampliada.
4. **E2E:** onboard→cadastro→revisão→salvar→alerta→confirmar→histórico→editar.
5. **Físicos:** Android/iOS com app encerrado, aparelho bloqueado/reiniciado e permissões alteradas.

## Casos mínimos de domínio

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| D01 | Seg 1, ter 2, qua 3, qui 4, sex 1, sáb 2, dom 3 | Repete por dia ISO da semana |
| D02 | Ciclo 1/2 com início domingo | Segunda é etapa 2, não reinício semanal |
| D03 | Ciclo 1/2/3/4 em mês de 31 dias | Continua após 1º dia do mês seguinte |
| D04 | Ciclo de 9 etapas atravessando feriado/ano | Índice correto, independente de dias úteis |
| D05 | 08:00 1 e 20:00 2 num mesmo dia | Duas ocorrências independentes |
| D06 | Dia explicitamente sem dose | Nenhuma ocorrência, sem status de erro |
| D07 | 0,5 comprimido e 2,5 mL | Quantidades intactas, unidades distintas |
| D08 | Exceção em quarta | Só quarta muda; quinta segue regra original |
| D09 | Esquecer segunda sem marcar tomada | Terça mantém quantidade prescrita |
| D10 | Confirmar duas vezes | Um único estado efetivo, trilha consistente |
| D11 | Editar da próxima semana em diante | Histórico antes do marco preservado |
| D12 | Encerrar na sexta | Nenhuma ocorrência a partir de sábado |
| D13 | Duas doses para medicamentos diferentes às 08:00 | Ambas permanecem identificáveis |
| D14 | Hora 02:30 inexiste num dia DST | Política explícita, comportamento determinístico |
| D15 | Hora 01:30 ocorre duas vezes em DST | Política definida e testada, sem duplicação inesperada |
| D16 | Fuso muda por viagem | Comportamento conforme política da rotina, prévia clara |
| D17 | Celular offline | Cálculo e calendário continuam disponíveis |
| D18 | Permissão negada | Alerta de capacidade, sem falsa confirmação |
| D19 | Reiniciar dispositivo | Comportamento registrado e recuperação aplicada se suportada |
| D20 | Cadastro durante mudança de orientação | Dados inseridos não desaparecem |
| D21 | Reconciliação repetida 100 vezes | Não duplica notificações/jobs |
| D22 | DB migration entre versões | Mantém regras e histórico |

## Matriz de dispositivos

**Layouts**: 320×568, 360×640, 393×852, 412×915, 600×960, 800×1280, tablet 1024×768; paisagem/janela dividida, fonte 100/150/200%, TalkBack/VoiceOver.

**Android:** selecionar dispositivos reais e fabricantes diferentes em Android 13, 14, 15 e 16 (na medida da disponibilidade). Testar background, force-stop, reboot, economia de bateria, permissão de notificações, permissão de alarme exato, modos de bloqueio, fuso manual.

**iOS:** testar iPhone físico, permissão granted/denied/provisional, Silencioso/Foco, app encerrado, reinício e limites de pendentes.

## Evidências exigidas nos PRs

- Logs de testes **sem dados de saúde**, versões do dispositivo, captura de tela/screen recording (dados fictícios).
- Para alarmes, tabela com atraso observado e cenários de falha, não somente mensagem 'funcionou'.
- Revisão visual em pelo menos dois tamanhos de tela, fontes grandes e acessibilidade.
- Critério de bloqueio do lançamento: divergência silenciosa na dose calculada, confirmação falsa, perda de dados, permissão representada incorretamente ou alarme prometido além da capacidade verificada.
