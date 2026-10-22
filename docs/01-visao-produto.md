# 01 — Visão de produto e escopo

## Identidade

**KAlarm** é um nome de exibição provisório (verificar disponibilidade de marca antes do lançamento); **KAlarm** é o nome técnico do repositório. Slogan provisório: **“Seu cuidado, no seu tempo.”**

### Problema

Aplicativos básicos de alarme não explicam **qual quantidade** corresponde a cada horário. A criação manual de vários alarmes para esquemas alternados é propensa a confusão. Aplicativos complexos podem ter fluxo difícil, especialmente em telas pequenas.

### Princípios

- Clareza acima de densidade: **o próximo lembrete e a dose prevista** dominam a tela.
- Uso rápido: permitir a programação simples sem abrir recursos avançados.
- Complexidade progressiva: editor avançado aparece apenas sob demanda.
- Multimedicação: não assumir que existe apenas um medicamento ou uma tomada por dia.
- Independência: funcionar offline e sem login.
- Cuidado com a saúde: o produto **lembra prescrições informadas**, não decide a prescrição.

## Perfis previstos

1. Usuário com dose fixa, lembrete único diário.
2. Usuário de calendário semanal com 7 doses diferentes.
3. Usuário de ciclo contínuo 2–N dias, atravessando fins de semana e meses.
4. Usuário que toma vários remédios com 2+ horários por dia.
5. Pessoa idosa ou com pouca familiaridade com celular; textos simples, fonte grande e controle acessível.

## MVP aprovado como direção de produto

- Onboarding curto, sem conta; permissão contextual de notificações.
- CRUD de medicamento: nome, apresentação, concentração **opcional como texto**, unidade, cor/ícone e foto **opcional condicionada à revisão de segurança**.
- Modos: fixo diário, dias selecionados, grade semanal, ciclo contínuo, exceções por data.
- Múltiplos horários/quantidades por dia, frações e medidas decimais.
- Ativação com prévia de calendário e revisão explícita das doses.
- Calendário previsto separado de histórico de confirmações.
- Ações confirmar/adiar/ver detalhes; suportadas conforme SO/permissões.
- Pausar, encerrar e editar a partir de data futura, sem reescrever histórico.
- Diagnóstico de permissões e aviso sobre limites de entrega.
- Layout adaptável em celulares compactos, grandes, tablets e janelas redimensionáveis.

## Fora do MVP

Cálculo clínico de doses, reconhecimento automático de comprimidos, recomendações de tratamento, interações medicamentosas, prescrição eletrônica, apoio médico, IA médica, cuidador sincronizado, sincronização cloud, publicidade personalizada, gamificação por 'adesão perfeita'.

## Metas internas (não fatos medidos)

- Concluir cadastro fixo com poucas decisões e sem consultar manual.
- Programar 7 dias diferentes sem criar 7 alarmes independentes.
- 100% dos casos de recorrência da suíte sem divergência entre prévia e alerta agendado.
- Nenhuma confirmação de tomada gerada implicitamente.
- Zero perda de histórico em mudança futura ou atualização de app no cenário suportado.
- Cobertura documentada, observada em aparelhos reais, para os alarmes.

**Linguagem segura:** “Dose programada”, “Confirmou que tomou?”, “Tomada não confirmada”; evitar “esqueceu”, “deve dobrar”, “dose certa para você”, “tomou automaticamente”.
