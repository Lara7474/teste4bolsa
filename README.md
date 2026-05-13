# Bolsas FAPED — versão reestruturada pela planilha mãe

Este pacote foi ajustado para seguir a planilha `planilha_mae_bolsistas_forms_automacao.xlsx` e os modelos DOCX enviados.

## O que foi alinhado

- Entidade `Solicitacao` com os 131 campos exatos da aba `FORM_SOLICITACOES`.
- Entidade `Contrato` com os 24 campos exatos da aba `BD_CONTRATOS`.
- Novas entidades auxiliares: `UnidadeExecutora`, `FluxoStatus`, `MapeamentoDocumento`, `ListaValidacao` e histórico de `Documento`.
- Arquivo central `src/lib/planilhaMaeConfig.js` com campos, seções, fluxo, validações, modelos e mapeamento de placeholders.
- Modelos DOCX copiados para `public/modelos/`.
- Formulário de solicitações reorganizado por seções da planilha mãe, usando nomes técnicos originais.
- Lista de solicitações em cards no padrão visual dos ativos enviados.
- Correção do import do toaster/use-toast para evitar falha de build.

## Regra principal

Não usar campos inventados. Qualquer nova regra deve ser incluída primeiro na planilha mãe e depois refletida no arquivo `planilhaMaeConfig.js`.
