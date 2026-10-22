# 33 — Checkpoint de implementação Expo e UI SoftCare

## Status

A pasta `mobile/` agora contém um projeto Expo 57 inicial com navegação por quatro abas, tema SoftCare, componentes de cartões/botões e 35 ícones SVG, além da tela de diagnóstico de alarmes Android. O produto se chama **KAlarm** oficialmente.

## Checkpoint de entrega

| Item | Estado |
| --- | --- |
| Marca atualizada nas especificações | Implementada no pacote local |
| Tema SoftCare compartilhado | Código inicial |
| Ícones SVG personalizados no aplicativo | Componentes integrados em código |
| Navegação Início/Remédios/Calendário/Histórico | Código inicial; testar em aparelho |
| Alarme técnico local após 60 segundos | Código escrito; testar no Android |
| Consulta de permissão exata | Código escrito; testar no Android |
| Editor com múltiplas doses + persistência | Não implementado |
| Historico real e SQLite Expo | Não implementado |
| Build e instalação das dependências | Não realizados neste ambiente |
| Publicação na main do GitHub | Não concluída (permissão 403 nas tentativas anteriores) |

## Próximo checkpoint

1. Executar `pnpm install` e `pnpm exec expo install --fix` com rede; gerar lockfile e checar tipagem.
2. Obter APK development e documentar teste A01 da entrega de 60 segundos em aparelho Android.
3. Integrar motor de recorrências testado em `proofs/scheduling/` ao app mobile sem duplicar cálculo.
4. Integrar migração do SQLite experimental com rotinas reais e histórico auditável.
5. Implementar editor semanal e ciclos em telas adaptáveis e salvar rascunhos.

> O nome KAlarm foi escolhido pelo usuário. Arquivos de imagem e mockups ainda são propostas visuais, não screenshots de um aplicativo final.
