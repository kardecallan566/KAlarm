# 18 — Checkpoint visual: SoftCare Icons (primeira implementação)

## Entregues neste pacote v3

- 35 SVGs autorais independentes com viewBox 64×64 e fundo transparente: `assets/icons/softcare/*.svg`.
- Script determinístico e auditável `assets/icons/softcare/generate_softcare.py`.
- Mapa TypeScript `components/softcare/softcareIconXml.ts` e wrapper `SoftCareIcon.tsx`, utilizando `SvgXml` do `react-native-svg`.
- Galeria visual `softcare-preview.png`, que permite revisar coerência e escala.
- Conceito de launcher `assets/brand/kalarm-launcher.svg` e preview PNG.
- Estudo de layout telefone/tablet `softcare-responsive-preview.png` (ilustração estática, não app interativo).

## Regras de uso

1. Ícones funcionais devem ter rótulos visíveis ou acessíveis. Em botões com rótulo já acessível, tratar o ícone como decorativo para não duplicar leitura.
2. Tamanhos-base: 24dp navegação, 32dp cartões, 48/64dp estados ilustrados.
3. Evitar SVGs complexos/gradientes de difícil renderização em telas pequenas.
4. Preenchimentos pastel são ilustrativos; texto precisa de contraste próprio.
5. Ícones de risco, permissão negada e erro não devem parecer celebração.
6. Preparar variantes de seleção/desabilitado/foco durante integração no Expo; as peças atuais são apenas **estado base**.

## Checklist de homologação antes de CP01 completo

- [ ] Testes Android com `react-native-svg` na versão do Expo escolhida.
- [ ] Conferência de foco/semântica com TalkBack.
- [ ] Conferência de 24dp, 32dp e 64dp em aparelhos de baixa densidade.
- [ ] Legibilidade da biblioteca em alto contraste e escala de cinza.
- [ ] Testar o launcher como ícone adaptativo com foreground/mask/monocromático (a versão enviada é **conceito**, não asset final pronto da Play).
- [ ] Definir variantes de ícones `disabled`, `focused` e `selected`.

Não confundir a prévia estática PNG com aplicativo Expo em execução.
