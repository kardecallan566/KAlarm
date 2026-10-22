# Gate de fechamento da especificação v4

## Produto
- [x] Público, proposta e limites clínicos descritos.
- [x] Tipos de rotina, slots e exceções especificados.
- [x] Diferença entre semanal e ciclo contínuo formalizada.
- [ ] Política DST/fuso totalmente validada em teste e aprovada.

## Design
- [x] Paleta, tipografia, componentes e ícones previstos.
- [x] Layouts previstos por largura de janela.
- [ ] Iconografia 24dp auditada, contraste e fonte 200% testados.
- [ ] Telas completas implementadas e avaliadas em aparelho.

## Alarmes
- [x] Contrato domain/outbox/adapter e reconciliação escrito.
- [ ] Ensaio nativo exatidão/permissões/reboot/longa ausência concluído.
- [ ] Decisão `USE_EXACT_ALARM` vs `SCHEDULE_EXACT_ALARM` fundamentada e validada para Play.

## Dados
- [x] Separação entre programação e histórico.
- [x] Versionamento e falha de agendamento documentados.
- [ ] Criptografia/backup/restauração testados; disclosure confirmado.

## QA e loja
- [x] Gates, matriz de testes e documentação de publicação.
- [ ] Play listing e declaração Health/Data safety concluídos conforme binário.
- [ ] Target API, build AAB e teste fechado (se necessário) validados.

**Conclusão:** especificação funcional suficientemente detalhada para codificar; NÃO é autorização para publicar sem fechar os bloqueadores.
