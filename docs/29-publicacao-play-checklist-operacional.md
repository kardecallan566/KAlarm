# 29 — Plano de distribuição e submissão à Google Play (v4)

## Requisitos públicos verificados em 21/10/2026

- Novos aplicativos e atualizações Android para Google Play em geral precisam de **target API 36 ou superior** a partir de 31/08/2026. Confirmar políticas vigentes no dia da submissão.
- Declaração de aplicativos de saúde no Play Console é obrigatória; incluir política de privacidade ativa, pública e presente no app.
- `USE_EXACT_ALARM` é permissão **restrita**, condicionada a funcionalidades centrais qualificadas e revisão; não incluir por conveniência.
- Contas pessoais criadas após 13/11/2023 precisam de teste fechado com pelo menos **12 testadores continuamente por 14 dias** e solicitação de acesso à produção. Aplicabilidade à conta deve ser verificada no Play Console.

## Antes de subir a primeira build

- Confirmar o nome KAlarm e disponibilidade da identidade visual.
- Escolher package/applicationId único (`com...`), imutável após publicar; não reutilizar ID de outro projeto.
- Definir versão `1.0.0` e `versionCode` inicial, estratégia de incremento, bundle AAB para loja e APK apenas para testes fora da loja.
- Configurar splash, adaptive icon, ícone monocromático, textos pt-BR, gráficos de loja e screenshots reais.
- Assinatura com EAS/Play App Signing e proteção de credenciais.
- Habilitar testes automatizados CI e preparar build de produção (`targetSdkVersion` compatível com regra vigente).

## Política, permissão e transparência

- Política de privacidade hospedada publicamente sem login, também acessível dentro do app.
- Formulário de segurança de dados condizente com operações reais e SDKs incluídos.
- Declaração de aplicativo de saúde, sem alegações de diagnóstico ou garantia médica.
- Permissions rationale: notificações/exatidão pedidas contextualizadas após o primeiro cadastro.
- Sem permissão de alarme exato no manifesto antes de auditoria de elegibilidade.
- Aviso dentro do app de que a entrega pode ser atrasada ou bloqueada pelo sistema.

## Teste e lançamento

1. Teste interno com contas confiáveis para verificar instalação, permissões, migração e crashes.
2. Teste fechado conforme exigências aplicáveis à conta.
3. Instrumentar apenas métricas operacionais **sem dados de saúde**; medir estabilidade do app.
4. Reunir evidências de onboarding, edição semanal, ciclos variáveis, tela de alarme e diagnóstico de permissões.
5. Solicitar acesso de produção quando aplicável; submeter AAB; revisão de política.
6. Distribuição gradual, monitorar crashes e feedback, plano de rollback/mitigação funcional.

## Material de página na loja (rascunho de intenção)

- Título provisório: **KAlarm — Lembretes de Remédios** (verificar limite e disponibilidade ao cadastrar).
- Valor principal: lembretes personalizados, horários, doses diferentes por dia e calendário claro.
- Não dizer: “garante que você jamais esquecerá”, “substitui orientação médica” ou “evita todos os erros de medicação”.
- Imagens: tela inicial, cadastro, grade semanal, ciclo alternado, confirmação e histórico; usar somente dados fictícios.

## Fonts, assets e licença

Antes da distribuição, auditar licenças das fontes/ilustrações, proprietários dos SVGs autorais, dependências e textos de terceiros.

## Links oficiais

- Target API: https://support.google.com/googleplay/android-developer/answer/11926878
- Saúde: https://support.google.com/googleplay/android-developer/answer/16679511
- Exatos: https://support.google.com/googleplay/android-developer/answer/16558241
- Testes: https://support.google.com/googleplay/android-developer/answer/14151465
