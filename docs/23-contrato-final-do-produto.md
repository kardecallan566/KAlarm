# 23 — Contrato de produto, limites e prioridades (v4)

**Estado:** especificação aprovada como direção de projeto; requisitos de plataforma marcados como _a validar_ não são capacidades demonstradas. **Produto:** KAlarm; **repositório:** KAlarm.

## Missão e restrição

Permitir que uma pessoa registre um esquema de medicação **conforme a prescrição que já tem**, receba lembretes e consulte o histórico de **confirmações declaradas por ela**. O software não indica, calcula nem modifica tratamentos por decisão própria.

## P0 (indispensável para a primeira versão pública)

- Criar/remover/pausar medicamentos com nome, apresentação, concentração descritiva opcional e unidade de tomada.
- Doses fixas, dias selecionados, matriz semanal personalizada, ciclo contínuo de N dias e exceções datadas.
- Múltiplas tomadas no mesmo dia e horários distintos; valores decimais exatos sem arredondamento silencioso.
- Prévia explícita de 14 dias para rotinas simples e 30 dias para complexas; confirmação da configuração.
- Notificações locais sujeitas à disponibilidade nativa, permissão e validação de confiabilidade.
- Separar programado, agendado pelo SO e declarado como tomado; histórico local editável com trilha de correção.
- Interface acessível em celulares e tablets, com identidade SoftCare coerente.
- Modo discreto na tela bloqueada como padrão; política de privacidade e exclusão de dados.

## P1 (alta prioridade após validação do P0)

- Copiar dia/horário e selecionar vários destinos com confirmação de substituição.
- Foto da embalagem opt-in; rascunhos interrompidos e retomada do formulário.
- Aviso de cobertura dos próximos agendamentos, quando a API suportar consulta.
- Exportação local e restauração segura em formato versionado, após prova de criptografia.

## Fora de escopo deliberadamente

- Sugestão de doses, ajuste terapêutico, interação medicamentosa, recomendação de compensação por esquecimento.
- Tomada por reconhecimento de câmera, medição de ingestão ou telemedicina.
- Alarmes declarados “infalíveis”, bypass de silêncio e modo Foco sem entitlement/consentimento.
- Cloud, perfis familiares, sincronização e cobrança em assinatura no MVP.

## Critérios de lançamento não negociáveis

1. Qualquer sequência semanal/cíclica gera projeção determinística coerente nos fusos testados.
2. Nenhuma notificação dispensada ou expirada pode gerar evento de ingestão confirmada.
3. Editar o futuro preserva os registros do passado, mesmo se a antiga agenda era diferente.
4. O usuário é informado quando os lembretes estão indisponíveis ou a capacidade é limitada.
5. Nenhum dado de medicação chega a rede/logs/analytics inadvertidamente; comportamento de backup explicitado.
6. O app nunca comunica orientações sobre dose atrasada ou compensatória.
7. Telas críticas funcionam com leitor de tela, fonte 200%, navegação por teclado e janela redimensionada.

## Perfil de publicação inicial

Android primeiro, Play Store, português brasileiro; iOS previsto na arquitetura, sem prometer uma data. Nenhum plano pago nem ads dentro de fluxos de medicação na versão inicial. Nome comercial e identificador Android precisam passar por verificação antes de assets definitivos.

## Fluxo de produto em uma linha

**Novo medicamento → escolher recorrência → definir quantidade/horário por dia/etapa → conferir calendário → ativar e verificar alarmes → confirmar/adiar → consultar histórico.**
