# Processo de Bolsas — alterações aplicadas

## O que foi reestruturado

- Mantido o design visual existente.
- Adicionada camada `src/lib/processoBolsasRules.js` com regras de campos, listas, perfis, status, documentos e placeholders amigáveis.
- Refeito o formulário de solicitação para mudar conforme perfil e tipo de solicitação.
- Criadas rotas/menus para os módulos exigidos: Nova Solicitação, Análise de Projetos, Setor de Bolsas, Contratos Ativos, Usuários e Permissões e Relatórios.
- Refeita a aba Administração com: campos, listas, fluxo de status, modelos, placeholders e perfis.
- Refeito o detalhe da solicitação com fluxo de status e histórico.
- Refeito o gerador documental com 7 botões funcionais conforme status/tipo.
- Adicionado schema de referência Supabase em `supabase/processo_bolsas_schema.sql`.

## Observação importante

O ZIP enviado não continha os modelos DOCX reais anexados nem credenciais/serviço Supabase ativo. Por isso, a camada documental gera um arquivo `.txt` local com os placeholders amigáveis substituídos, registra histórico no estado da solicitação e deixa pronta a regra para integração com DOCX real.

Para geração DOCX/PDF real em produção, conectar o botão ao serviço de backend/edge function responsável por:

1. buscar o modelo cadastrado em `modelos_documentos`;
2. abrir o DOCX;
3. substituir placeholders como `{{Nome do solicitante}}`;
4. salvar o arquivo gerado;
5. registrar em `documentos`;
6. atualizar o link na solicitação.

## Comandos

```bash
npm install
npm run dev
npm run build
```

## Status que liberam documentos

- Termo de Referência: `Aprovado - Projetos`
- Edital: `Aguardando emissão do edital`
- Termo de Outorga: `Aguardando emissão do termo de outorga`
- Aditivos: `Aguardando emissão do aditivo`
- Distrato: `Aguardando emissão do distrato`
