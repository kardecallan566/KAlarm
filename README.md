# KAlarm

**Nome do repositório:** KAlarm · **Nome oficial do produto:** KAlarm · **Projeto:** React Native + Expo + TypeScript · **Idioma base:** português brasileiro · **Estado:** primeira base Expo com identidade SoftCare v6 integrada; cadastros, alarmes reais e histórico ainda em desenvolvimento (21/10/2026).

> **Já existe uma primeira base Expo na pasta `mobile/`, mas ainda não é um aplicativo funcional de medicamentos.** Ela inclui a identidade visual, navegação inicial e um teste técnico de notificações. O motor e o SQLite continuam em provas de conceito isoladas; não há armazenamento clínico nem entrega de alarmes validados. Esta documentação não é orientação de uso de medicamentos.

## Missão

Um despertador de medicação **simples para uma dose fixa e flexível para um tratamento complexo**. A pessoa informa os medicamentos e a programação prescrita: todos os dias, dias específicos, doses distintas por dia da semana, ciclos contínuos com qualquer número de etapas, exceções e múltiplas tomadas diárias. O aplicativo mostra o que foi programado, avisa quando possível e registra **somente confirmações explícitas**.

**Proposta visual:** SoftCare — ambiente claro, confortável e profissional, ícones autorais com contornos arredondados e personalização sem infantilização.

## Documentação navegável

| Categoria | Documento |
| --- | --- |
| Produto | [01 — Visão, públicos e escopo](docs/01-visao-produto.md) |
| Produto | [02 — Requisitos, fluxos e estados](docs/02-requisitos-fluxos.md) |
| Design | [03 — SoftCare: tokens, componentes e ícones](docs/03-design-softcare.md) |
| Design | [04 — Responsividade e acessibilidade](docs/04-responsividade.md) |
| Domínio | [05 — Regras completas de doses e recorrência](docs/05-motor-doses.md) |
| Domínio | [06 — Contratos de tipos e invariantes](specs/06-contratos-tipos.md) |
| Dados | [07 — SQLite, versões e migrações](docs/07-dados-sqlite.md) |
| Alarmes | [08 — Agendamento, entrega e reconciliação](docs/08-alarmes-notificacoes.md) |
| Engenharia | [09 — Arquitetura Expo e qualidade de código](docs/09-arquitetura.md) |
| Produto | [10 — Estados de erro, recuperação e observabilidade](docs/10-falhas-recuperacao.md) |
| Governança | [11 — Privacidade, segurança e limites clínicos](docs/11-privacidade-seguranca.md) |
| Testes | [12 — Estratégia de QA e matriz de dispositivos](docs/12-qa-testes.md) |
| Distribuição | [13 — Google Play e plano de publicação](docs/13-google-play.md) |
| Execução | [14 — Roadmap, checkpoints e Definition of Done](docs/14-roadmap.md) |
| Controle | [15 — ADR: decisões, riscos e pendências](docs/15-adr-decisoes.md) |
| Produto | [16 — Copywriting, notificações e localização](docs/16-mensagens-l10n.md) |
| Checklist | [Checklist de aceitação do MVP](checklists/mvp-aceitacao.md) |
| Checklist | [Checklist de publicação](checklists/playstore-aceitacao.md) |
| Referências | [Fontes oficiais verificadas em outubro de 2026](docs/17-referencias.md) |
| Entrega técnica | [18 — SoftCare Icons e assets](docs/18-softcare-assets.md) |
| Entrega técnica | [19 — Motor TypeScript executável](docs/19-engine-implementation.md) |
| Design | [20 — Contrato do editor responsivo](docs/20-editor-responsivo.md) |
| Dados | [21 — SQLite experimental](docs/21-sqlite-proof.md) |
| Alarmes | [22 — Reconciliação e máquina de estados](docs/22-reconcile-state-machine.md) |

## Entregas técnicas herdadas da v3

- [Galeria dos 35 ícones SoftCare](softcare-preview.png) e [SVGs originais](assets/icons/softcare/).
- [Comparação de layouts compactos/tablet](softcare-responsive-preview.png) (mockup estático).
- [Componente React Native `SoftCareIcon`](components/softcare/SoftCareIcon.tsx) + mapa XML do pack.
- [Motor de agendamentos TypeScript](proofs/scheduling/src/engine.ts) com 23 testes locais aprovados.
- [Esquema SQLite](proofs/sqlite/migrations/0001_core.sql) com 7 testes locais aprovados.
- [Conceito de ícone do aplicativo](assets/brand/kalarm-launcher.svg) (não é adaptive icon final).

### Comandos de verificação local

```bash
cd proofs/scheduling
node --experimental-strip-types --test tests/*.test.ts
tsc --noEmit

cd ../sqlite
python3 -m unittest discover -s tests -v
```

## Critérios inegociáveis

1. Não recomendar mudanças de dose, diagnósticos, tratamento ou compensações por esquecimento.
2. Não converter concentrações em posologia automaticamente.
3. Não classificar silêncio, ausência de resposta ou abertura da notificação como tomada confirmada.
4. Não deslocar uma sequência porque o usuário deixou de confirmar um evento.
5. Não prometer entrega infalível de alarmes em Android/iOS: verificar e comunicar permissões, limites e testes físicos.
6. Não destruir registros anteriores quando uma programação for editada.
7. Não coletar ou enviar dados sensíveis desnecessariamente.

## Plano de execução resumido

**CP00** documentação → **CP01** biblioteca SVG (primeira versão entregue; homologação pendente) → **CP02** protótipos adaptáveis → **CP03** scaffold Expo/CI → **CP04** motor e SQLite (provas locais, integração pendente) → **CP05** editor e calendário → **CP06** alarmes e histórico → **CP07** acessibilidade/segurança → **CP08** beta Play → **CP09** lançamento.

**Status GitHub:** na tentativa anterior a integração retornou **HTTP 403** ao criar arquivos no repositório. Este ZIP é um pacote local pronto para publicação; não declarar que conteúdo foi enviado à `main` sem um commit verificável.


## Planejamento v4 — fechamento de requisitos

A rodada v4 aprofunda alarmes, editor, responsividade, privacidade, QA e publicação sem alegar recursos já implementados. Leia [o resumo desta rodada](PLANO-V4-RESUMO.md) e [o checklist de fechamento](checklists/planejamento-v4-fechamento.md).

**Bloqueadores antes de produção:** comprovar alarmes em aparelhos reais, encerrar política de fusos/DST, revisar armazenamento sensível e restaurar dados se o recurso for anunciado, homologar acessibilidade, validar declarações e permissões da Google Play. Documento ≠ funcionalidade pronta.


## Atualização v5 — KAlarm oficial e primeira base Expo

- O nome do aplicativo está decidido: **KAlarm**, substituindo o nome provisório anterior. Consulte [a decisão de marca](docs/31-marca-oficial-kalarm.md).
- A pasta [mobile/](mobile/) contém um projeto inicial Expo SDK 57 com navegação, tema SoftCare, ícones SVG e [diagnóstico de notificações](mobile/app/alarm-test.tsx).
- [Protocolo de teste real Android](docs/32-experimentos-android.md) e [checkpoint da implementação](docs/33-inicio-expo-checkpoint.md).
- **Atenção:** sem dependências instaladas, sem APK testado e sem tratamentos persistidos nesta versão. A entrega de uma notificação ainda precisa ser comprovada em aparelho real.


## Atualização v6 — Ícones ilustrados realmente integrados ao Expo

- [Galeria dos 30 novos PNGs SoftCare](softcare-icons-v6-preview.png) — 6 famílias, exportadas de cartelas de imagem com fundo transparente.
- [Catálogo e hashes](mobile/assets/softcare/manifest.json) — imagens individuais em [`mobile/assets/softcare/icons/`](mobile/assets/softcare/icons/).
- [Ícone oficial do KAlarm](mobile/assets/icon.png), [ícone adaptativo](mobile/assets/adaptive-icon.png), [monocromático](mobile/assets/adaptive-icon-monochrome.png), [splash](mobile/assets/splash.png) e [marca](mobile/assets/brandmark.png).
- [Componente SoftCareIcon](mobile/src/components/icons/SoftCareIcon.tsx) seleciona os **novos PNGs** por importações estáticas, com SVGs como fallback.
- [Galeria dentro do app](mobile/app/icon-gallery.tsx), acessível na aba **Início**.
- Verificações executadas: integridade dos 30 assets e referências, parse de arquivos TypeScript/TSX.
- **Sem build de APK concluída**: dependências não foram instaladas neste ambiente. Necessário validar a renderização visual no aparelho antes de concluir o checkpoint.
- Detalhes em [Checkpoint v6](CHECKPOINT-V6.md) e [documentação mobile](mobile/ASSETS-SOFTCARE.md).
