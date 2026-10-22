# 15 — Architecture Decision Record (ADR), riscos e pendências

## Direção definida

| ADR | Decisão | Status |
| --- | --- | --- |
| 001 | KAlarm = repo; KAlarm = marca provisória | Proposto |
| 002 | SoftCare claro/acolhedor, SVGs autorais | Direção definida |
| 003 | Offline-first, sem conta no MVP | Direção definida |
| 004 | Expo/React Native/TypeScript + pnpm | Direção definida |
| 005 | SQLite fonte de verdade; histórico event-sourced | Proposto |
| 006 | Regra semanal e ciclo N separados | Definido |
| 007 | Dose prevista ≠ tomada confirmada | Definido |
| 008 | Alterações versionadas e efetivas por data | Proposto |
| 009 | Não sugerir compensações ou dose clínica | Definido |
| 010 | Layout adaptável por largura da janela | Definido |
| 011 | Teste nativo de alarmes antes de prometer precisão | Definido |

## Decisões pendentes priorizadas

| Prioridade | Pergunta | Experimento/decisão necessária |
| --- | --- | --- |
| Crítica | Como garantir cobertura de alarmes para ciclos variáveis com app sem abrir semanas? | Spike Android/iOS, fila nativa, limite de pendentes, considerar módulo nativo |
| Crítica | Qual política usar para horário inexistente/duplicado por DST? | Testar cidades/fusos e escolher regra explícita |
| Alta | Fuso fixo original ou segue dispositivo em viagem? | Proposta inicial: fuso da rotina, com aviso |
| Alta | Criptografia/backup local adequados em Expo? | Prova técnica e revisão de riscos |
| Alta | Ação 'Tomei' direto na notificação é segura em todas plataformas? | Testar idempotência e UI de confirmação |
| Média | Prescrição com horário por intervalo fixo (ex. 8/8h) entra no MVP? | Exigir regra, janela e cálculo explícitos; não inferir de cadastro diário |
| Média | Campos de unidade/dose permitidos sem conversão automática? | Prototipar com pessoas e revisar com especialista clínico |
| Média | Marca, pacote Android e domínio de suporte? | Verificar disponibilidades antes da loja |
| Média | Modo privacidade na tela bloqueada por padrão | Pesquisa de usabilidade e política clara |

## Riscos

- **R1 — Alarme perdido:** mitigação por avaliação nativa precoce, checks de permissão, diagnóstico e publicidade honesta.
- **R2 — Dose incorreta por algoritmo:** suíte de propriedades/data e prévia obrigatória.
- **R3 — Dados sensíveis expostos:** local-first, auditoria de SDKs, controles de notificação, criptografia avaliada.
- **R4 — UI confusa para idosos:** tamanho de toque/fonte, leitura com usuários, rótulos e rotinas progressivas.
- **R5 — Rejeição Google Play:** checagem API 36, declarações saúde, alarmes exatos e Data Safety.
- **R6 — Troca de telefone:** comunicação clara de ausência de backup; não prometer continuidade sem restauração validada.

## Critério para encerrar pendência

Registrar data, alternativa escolhida, evidência de teste, impacto e responsável em alteração deste ADR. Evitar tratar hipóteses como capacidade implementada.
