# 27 — Segurança, privacidade, backup e recuperação (v4)

## Classificação e minimização

Nome dos medicamentos, concentrações, dosagens e horários podem revelar **dados pessoais sensíveis relativos à saúde**. Tratar o banco e as capturas da interface como informações privadas, mesmo sem conta de usuário.

### Padrões obrigatórios

- Offline-first e nenhuma conta exigida no MVP.
- Nenhum SDK de analytics/ads coleta nome, dose, horário ou foto de remédio.
- Nenhuma notificação remota com dados do usuário por padrão; notificações locais.
- Permissões de foto apenas quando usuário pedir; persistência de imagem no diretório privado da aplicação e remoção com exclusão do medicamento.
- Logs e relatórios de crash nunca contêm dados de medicação, fotos, payloads ou nomes de pacientes.
- Política de privacidade presente no app e em URL pública, consistente com o que o binário realmente faz.

## Proteção em repouso

**Candidato:** **SQLCipher** no `expo-sqlite` por meio de development build/prebuild; não funciona no Expo Go. A chave deve ter ciclo de vida seguro apoiado no sistema operacional (ex.: Keystore/Keychain via solução apropriada), sem hardcode em JavaScript nem no repositório. **É uma hipótese técnica a validar**, não uma proteção já implementada. Modelar migração de banco não criptografado para criptografado com transação recuperável antes de publicar.

## Notificação e tela bloqueada

Modo discreto padrão: `Está na hora de conferir seu medicamento` sem nome, concentração e dose em tela bloqueada; ao abrir o app, mostrar os detalhes. Alternativa opt-in `Exibir nome e dose na notificação` com aviso claro de visibilidade a terceiros.

## Backup e restauração

**Decisão inicial:** não afirmar que há backup enquanto não existir uma restauração de ponta a ponta validada. Um app sem sincronização pode perder dados quando desinstalado ou quando o telefone é trocado.

### Exportação futura segura

1. Solicitação explícita de exportação (sem envio automático).
2. Arquivo com esquema versionado, verificação de integridade e criptografia autenticada, com gestão correta de chaves.
3. Avisar o que contém; não fazer backup de payloads secretos de permissões/IDs nativos, que devem ser reconstruídos.
4. Restaurar rotinas e histórico, **não confiar em alarmes previamente agendados no aparelho antigo**.
5. Após restauração: solicitar permissões necessárias no novo aparelho, conciliar notificações e mostrar cobertura real.
6. Testar backup corrompido, versão antiga, arquivo sem chave e restauração parcial sem duplicar histórico.

## Exclusão e controle pelo usuário

- `Excluir medicamento`: pedir confirmação, explicar tratamento de histórico e implementar política explícita de remoção de dados associados.
- `Apagar todos os dados`: confirmação em duas etapas, cancelar os alarmes, apagar banco/fotos/chaves de maneira validada e reinicializar o onboarding.
- Mostrar `Última verificação de alarmes` separada de `Última cópia de segurança`, quando backup existir.

## Resposta a falhas

| Evento | Resposta |
| --- | --- |
| Banco indisponível/corrompido | Bloquear gravações arriscadas; explicar, registrar diagnóstico não sensível e oferecer recuperação verificável |
| Pouco armazenamento | Evitar confirmação falsa; informar que registro não foi salvo |
| Reinstalação | Sem dados antigos, explicar ausência de backup local |
| Permissão revogada | Mostrar falha de alarmes; manter acesso ao calendário |
| Mudança de horário/fuso | Recompor apenas o futuro conforme política definida |
| Criptografia falhou | **Não afirmar proteção**; bloquear publicação até resolver risco |

## LGPD/loja e segurança de release

- Definir base legal apropriada e transparência com revisão responsável; nunca afirmar conformidade automática só por ser offline.
- Preencher Data safety conforme todas as bibliotecas utilizadas.
- Revisar o manifesto, permissões, link de política, export/delete e armazenamento seguro em todos os builds.
- Usar dependências suportadas, revisão de atualizações e geração segura de artefatos.

Fontes: https://docs.expo.dev/versions/latest/sdk/sqlite/ · https://support.google.com/googleplay/android-developer/answer/16679511
