# Checklist — MVP funcional

## Produto e design

- [ ] Interface pt-BR coerente e tema SoftCare com ícones autorais.
- [ ] 320dp a tablet com reflow; sem overflow com fonte a 200%.
- [ ] Fluxos acessíveis por leitor de tela/teclado e alvos de toque adequados.
- [ ] Cadastro fixo simples e avançado sob demanda.
- [ ] Editor semanal com slots independentes e dias sem dose.
- [ ] Ciclo N dias com âncora e prévia real, sem reiniciar por semana.
- [ ] Doses fracionadas/unidades sem conversão clínica.

## Engenharia e domínio

- [ ] SQLite+migrations resistentes à atualização, com histórico versionado.
- [ ] 22 cenários QA cobertos (ou exceção justificada).
- [ ] Todas ocorrências deterministicamente identificadas.
- [ ] Exceção de data não desloca ciclo.
- [ ] Confirmação explícita e idempotente; descartar alarme não confirma.
- [ ] Adiamento preserva horário prescrito.
- [ ] Múltiplas medicações e múltiplos horários num dia suportados.

## Alarmes e confiabilidade

- [ ] Permissões corretamente explicadas e lidas.
- [ ] Cobertura da janela de agendamento documentada.
- [ ] Background/reboot/force stop e limites de SO testados fisicamente.
- [ ] Reconciliação não duplica nem mantém alarmes cancelados.
- [ ] Falhas de agendamento exibidas de forma clara.
- [ ] Sem promessas de alarme infalível.

## Segurança

- [ ] Dados sensíveis não vazam em logs; políticas de backup e fotos definidas.
- [ ] Exclusão total e retenção revisadas.
- [ ] Política de privacidade representa o aplicativo real.
- [ ] Sem recomendações médicas automatizadas.
