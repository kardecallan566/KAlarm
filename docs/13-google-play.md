# 13 — Google Play: preparação de publicação (verificado 21/10/2026)

**Estas exigências mudam:** revisar fontes oficiais imediatamente antes de subir o AAB.

## Requisitos atuais confirmados em fonte oficial

- **Target API:** a partir de **31/08/2026**, novos apps e atualizações da Google Play devem segmentar **Android 16 / API 36+** (exceções específicas de outros formatos não são o foco deste app).
- **Aplicativos de saúde:** formulário Health apps declaration obrigatório para apps publicados, inclusive faixas de teste; categoria aplicável é **Medication and Treatment Management**.
- **Privacidade:** política de privacidade e formulário **Segurança dos Dados** devem representar fielmente práticas e SDKs.
- **Alarmes exatos:** `USE_EXACT_ALARM` é restrita a casos elegíveis e sujeita a análise; avaliar `SCHEDULE_EXACT_ALARM` e declarações. Não assumir aprovação de full-screen intent.
- **Teste fechado para novas contas pessoais:** contas criadas após 13/11/2023 precisam, em regra, **12 testadores contínuos por 14 dias** e pedido de acesso à produção. Não afirmar que se aplica à conta específica sem checagem de sua categoria/data.
- **Android 16+:** adaptar layout para telas grandes, janelas redimensionáveis e orientações; restringir portrait pode falhar/ser ignorado em tablets.

## Checklist documental

- Nome/ícone finais e checagem básica de marca.
- Package ID único e definitivo, exemplos a decidir em conjunto (não registrar placeholder no lançamento).
- Política de Privacidade URL HTTPS e texto interno; aviso de limitações e dados.
- Declaração de saúde; avaliação se o recurso configura alegação de dispositivo médico e obrigações locais.
- Segurança dos Dados, inclusive SDKs terceiros; classificação etária e público-alvo.
- Capturas reais com dados fictícios (celulares/telas grandes se suportados), descrição curta e longa, ícone 512x512, feature graphic 1024x500 conforme requisitos vigentes da console.
- Contato de suporte, e-mail e página pública adequada.

## Builds e faixas

1. Expo/EAS em profile dev para testes físicos.
2. APK local para QA; AAB assinado para Google Play (não subir apenas APK como release padrão).
3. Teste interno → teste fechado obrigatório conforme conta → feedback → correções → solicitação de produção.
4. Monitorar ANRs/crashes sem enviar dados clínicos identificáveis.
5. VersionCode incremental, changelog e plano de rollback/update.

## Restrições de posicionamento comercial

- Evitar claims 'nunca mais perca um horário', 'garantido', 'certifica tomada', 'substitui orientação médica'.
- Preferir gratuito/offline primeiro. Se monetização futura: não inserir anúncios dentro de telas de alarme/dose; avaliar impacto da inclusão de SDKs/assinaturas na privacidade, declaração de dados e UX.

## Fontes oficiais

Consulte [17 — Referências](17-referencias.md) antes de criar o projeto ou publicar.
