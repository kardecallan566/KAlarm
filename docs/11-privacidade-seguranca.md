# 11 — Privacidade, segurança, LGPD e limite clínico

## Natureza dos dados

Nome do medicamento, dose, horários e confirmações podem revelar **dados pessoais sensíveis de saúde**. Tratar como informações sensíveis desde o MVP, mesmo sem login, analytics ou servidor.

## Coleta mínima

- Nome do medicamento, regras, unidade, histórico e preferências no próprio aparelho.
- Foto opcional somente após avaliar proteção local; evitar pedir acesso desnecessário à galeria inteira.
- Nenhuma conta obrigatória; nenhum cadastro remoto; não enviar dados para publicidade ou recomendações.
- Definir política de retenção e botão de exclusão total verificável; limpar arquivos locais e jobs nativos vinculados.

## Ameaças e proteções planejadas

| Ameaça | Medida |
| --- | --- |
| Tela bloqueada revela medicamento | Notificação discreta por padrão, opção explícita para detalhes |
| Backup em claro vaza histórico | Avaliar criptografia, chave do sistema e regras de backup; testar restauração |
| Relatório de erro inclui doses | Redação de logs e revisão dos SDKs |
| Outro aplicativo lê mídia local | Salvar em sandbox e aplicar permissões mínimas |
| Apagar/editar indevidamente | Confirmações de ações destrutivas e histórico versionado |
| Dependências com telemetria | Inventário e auditoria de SDKs para declaração Play |

**SQLite simples não equivale a banco criptografado.** Definir criptografia em repouso e política de chave compatíveis com Android/Expo antes de prometer proteção além da sandbox do SO.

## Informações e documentação para a Play

- Política de Privacidade pública e acessível no app e na loja, ajustada às práticas reais da versão distribuída.
- Formulário Segurança dos Dados preenchido com base nos SDKs e fluxos reais, não em uma promessa de 'não coletamos nada'.
- Declaração de aplicativos de saúde: categoria 'Medication and Treatment Management'.
- Revisar se o produto exige aviso de que não presta serviço médico/regulatório e documentos locais aplicáveis; consulta jurídica/regulatória antes de afirmação de isenção.

## Delimitação clínica

O app **não** prescreve, diagnostica, recomenda dose, altera tratamento, calcula dose a partir da concentração, decide se a pessoa deve tomar dose atrasada ou aconselha dobrar uma dose. Todas as regras são cadastradas pelo usuário conforme indicação recebida.

Texto-base de aviso (a revisar com a política final): “O KAlarm ajuda a organizar lembretes de medicamentos informados por você. Confira sempre sua prescrição e siga a orientação do profissional responsável. Alertas podem ser afetados pelas configurações do celular.”
