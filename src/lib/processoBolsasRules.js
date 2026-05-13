import {
  FORM_SOLICITACOES_FIELDS,
  FORM_SECTIONS,
  LISTAS_VALIDACAO_SEED,
  FLUXO_STATUS,
  MAPEAMENTO_DOCUMENTOS,
  DOCUMENT_MODELS,
  getFieldInputType,
  calcularVigenciaMeses,
} from './planilhaMaeConfig';

export const FIELD_LABELS = {
  TipoSolicitacao: 'Tipo de solicitação',
  Prioridade: 'Prioridade da solicitação',
  Status: 'Status',
  EtapaAtual: 'Etapa atual',
  ResponsavelAtual: 'Responsável atual',
  NomeSolicitante: 'Nome do solicitante',
  EmailSolicitante: 'E-mail do solicitante',
  SetorSolicitante: 'Setor do solicitante',
  TelefoneSolicitante: 'Telefone do solicitante',
  Projeto: 'Nome do projeto',
  CodigoProjeto: 'Código / identificação do projeto',
  Financiadora: 'Financiadora',
  InstituicaoModeloContrato: 'Instituição/modelo contratual',
  ModeloContrato: 'Modelo contratual',
  UnidadeExecutora: 'Unidade executora',
  DataAssinaturaProjeto: 'Data de assinatura do projeto',
  DataInicioProjeto: 'Data inicial de vigência do projeto',
  DataFimProjeto: 'Data final de vigência do projeto',
  MetaTED: 'Meta TED',
  EtapaTED: 'Etapa TED',
  ObjetivoContratacao: 'Objetivo da contratação',
  AreaAtuacao: 'Área de atuação',
  LocalTrabalho: 'Local de trabalho',
  Coordenador: 'Nome do coordenador do projeto',
  CPFCoordenador: 'CPF do coordenador',
  EmailCoordenador: 'E-mail do coordenador',
  Orientador: 'Nome do orientador da bolsa',
  CPFOrientador: 'CPF do orientador',
  EmailOrientador: 'E-mail do orientador',
  Modalidade: 'Modalidade da bolsa',
  DescricaoModalidade: 'Descrição da modalidade',
  TabelaBolsa: 'Tabela aplicável da bolsa',
  ValorBolsa: 'Valor mensal da bolsa',
  QuantidadeVagas: 'Quantidade de vagas',
  CargaHoraria: 'Carga horária / horas-mês',
  VigenciaMeses: 'Vigência em meses',
  DataInicioVigencia: 'Data inicial da vigência da bolsa',
  DataFimVigencia: 'Data final da vigência da bolsa',
  DataLimiteInscricao: 'Data limite de inscrição',
  RequisitosObrigatorios: 'Requisitos obrigatórios',
  RequisitosDesejaveis: 'Requisitos desejáveis',
  AtividadesDesenvolvidas: 'Atividades a serem desenvolvidas',
  Entrevistador1: 'Nome do 1º entrevistador',
  EmailEntrevistador1: 'E-mail do 1º entrevistador',
  Entrevistador2: 'Nome do 2º entrevistador',
  EmailEntrevistador2: 'E-mail do 2º entrevistador',
  IDContratoOrigem: 'ID do contrato de origem',
  TipoAditivo: 'Tipo de aditivo',
  NovoValor: 'Novo valor mensal',
  NovaModalidade: 'Nova modalidade',
  NovaDataInicio: 'Nova data inicial',
  NovaDataFim: 'Nova data final',
  JustificativaAditivo: 'Justificativa do aditivo',
  DespachoLink: 'Link do despacho/autorização',
  TipoDesligamento: 'Tipo de desligamento',
  DataDesligamento: 'Data do desligamento',
  MotivoDesligamento: 'Motivo do desligamento',
  JustificativaDistrato: 'Justificativa do distrato',
  NomeBolsista: 'Nome do bolsista aprovado',
  NomeSocial: 'Nome social',
  CPF: 'CPF',
  RG: 'RG',
  OrgaoExpedidor: 'Órgão expedidor do RG',
  DataExpedicaoRG: 'Data de expedição do RG',
  DataNascimento: 'Data de nascimento',
  EstadoCivil: 'Estado civil',
  Naturalidade: 'Naturalidade',
  Nacionalidade: 'Nacionalidade',
  Endereco: 'Endereço',
  NumeroEndereco: 'Número',
  ComplementoEndereco: 'Complemento',
  Bairro: 'Bairro',
  CEP: 'CEP',
  Cidade: 'Cidade',
  Estado: 'UF',
  Telefone: 'Telefone do bolsista',
  EmailBolsista: 'E-mail do bolsista',
  Banco: 'Banco',
  Agencia: 'Agência',
  Conta: 'Conta',
  TipoConta: 'Tipo de conta',
  ChavePIX: 'Chave PIX',
  Graduacao: 'Curso de graduação',
  InstituicaoGraduacao: 'Instituição da graduação',
  Mestrado: 'Curso de mestrado',
  InstituicaoMestrado: 'Instituição do mestrado',
  Doutorado: 'Curso de doutorado',
  InstituicaoDoutorado: 'Instituição do doutorado',
  CurriculoLattesLink: 'Link do currículo Lattes',
  ComprovantesLink: 'Link para comprovantes e documentos',
  ContratacaoPrevistaPlanoTrabalho: 'A contratação está prevista no plano de trabalho?',
  SaldoRubrica: 'Saldo disponível na rubrica',
  ObservacaoProjetos: 'Observações do setor de projetos',
  NumeroEdital: 'Número do edital',
  DataPublicacaoEdital: 'Data de publicação do edital',
  NumeroApoliceSeguro: 'Número da apólice do seguro',
  DocumentosPessoaisConferidos: 'Documentos pessoais conferidos?',
  LinkTermoReferencia: 'Link do Termo de Referência',
  LinkMinutaEdital: 'Link do Edital',
  LinkMinutaContrato: 'Link do Termo de Outorga',
  LinkAditivo: 'Link do Aditivo',
  LinkDistrato: 'Link do Distrato',
};

export const labelOf = (field) => FIELD_LABELS[field] || field.replace(/([A-ZÁÉÍÓÚÃÕÇ])/g, ' $1').trim();
export const placeholderOf = (field) => `{{${labelOf(field)}}}`;

export const LISTA_KEYS = ['TipoSolicitacao','Prioridade','Status','EtapaAtual','ResponsavelAtual','InstituicaoModeloContrato','ModeloContrato','TipoAditivo','TipoDesligamento','TipoConta','Confirmacao','TabelaBolsa','UF','Modalidade','EstadoCivil'];

export function getListaOptions(key) {
  const values = new Set();
  LISTAS_VALIDACAO_SEED.forEach((row) => {
    if (row[key]) values.add(row[key]);
    if (row.Lista === key && row.Valor) values.add(row.Valor);
  });
  const defaults = {
    TipoSolicitacao: ['Contratação', 'Aditivo de valor', 'Aditivo de modalidade', 'Aditivo de período', 'Distrato'],
    Prioridade: ['Baixa', 'Média', 'Alta', 'Urgente'],
    Status: ['Recebido', 'Em análise - Projetos', 'Aprovado - Projetos', 'Aguardando emissão do edital', 'Edital emitido', 'Candidato aprovado', 'Documentos recebidos', 'Aguardando emissão do termo de outorga', 'Contrato gerado', 'Contrato ativo', 'Aguardando emissão do aditivo', 'Aditivo gerado', 'Aguardando emissão do distrato', 'Distrato gerado', 'Encerrado'],
    EtapaAtual: ['Solicitante', 'Projetos', 'Bolsas', 'Bolsista', 'Assinaturas', 'Encerrado'],
    ResponsavelAtual: ['Solicitante', 'Projetos', 'Bolsas', 'Bolsista', 'Administração'],
    TipoAditivo: ['Valor', 'Modalidade', 'Período'],
    TipoDesligamento: ['A pedido', 'Término de vigência', 'Cancelamento', 'Desligamento por descumprimento'],
    TipoConta: ['Conta corrente', 'Conta poupança', 'Conta salário'],
    Confirmacao: ['Sim', 'Não', 'Não se aplica'],
    UF: ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'],
    EstadoCivil: ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União estável'],
  };
  (defaults[key] || []).forEach((v) => values.add(v));
  return Array.from(values).filter(Boolean);
}

export const SOLICITANTE_GERAIS = ['TipoSolicitacao','Prioridade','NomeSolicitante','EmailSolicitante','SetorSolicitante','TelefoneSolicitante','Projeto','CodigoProjeto','Financiadora','InstituicaoModeloContrato','UnidadeExecutora','DataAssinaturaProjeto','DataInicioProjeto','DataFimProjeto','MetaTED','EtapaTED','ObjetivoContratacao','AreaAtuacao','LocalTrabalho','Coordenador','CPFCoordenador','EmailCoordenador','Orientador','CPFOrientador','EmailOrientador'];
export const CAMPOS_POR_TIPO = {
  'Contratação': ['Modalidade','QuantidadeVagas','CargaHoraria','DataInicioVigencia','DataFimVigencia','DataLimiteInscricao','RequisitosObrigatorios','RequisitosDesejaveis','AtividadesDesenvolvidas','Entrevistador1','EmailEntrevistador1','Entrevistador2','EmailEntrevistador2'],
  'Aditivo de valor': ['IDContratoOrigem','TipoAditivo','NovoValor','JustificativaAditivo','DespachoLink'],
  'Aditivo de modalidade': ['IDContratoOrigem','TipoAditivo','NovaModalidade','NovoValor','JustificativaAditivo','DespachoLink'],
  'Aditivo de período': ['IDContratoOrigem','TipoAditivo','NovaDataInicio','NovaDataFim','JustificativaAditivo','DespachoLink'],
  'Distrato': ['IDContratoOrigem','TipoDesligamento','DataDesligamento','MotivoDesligamento','JustificativaDistrato'],
};
export const BOLSISTA_FIELDS = ['NomeBolsista','NomeSocial','CPF','RG','OrgaoExpedidor','DataExpedicaoRG','DataNascimento','EstadoCivil','Naturalidade','Nacionalidade','Endereco','NumeroEndereco','ComplementoEndereco','Bairro','CEP','Cidade','Estado','Telefone','EmailBolsista','Banco','Agencia','Conta','TipoConta','ChavePIX','Graduacao','InstituicaoGraduacao','Mestrado','InstituicaoMestrado','Doutorado','InstituicaoDoutorado','CurriculoLattesLink','ComprovantesLink'];
export const PROJETOS_CONTRATACAO = ['ContratacaoPrevistaPlanoTrabalho','SaldoRubrica','ObservacaoProjetos','TabelaBolsa','ValorBolsa','Status'];
export const PROJETOS_ADITIVO = ['IDContratoOrigem','ContratacaoPrevistaPlanoTrabalho','SaldoRubrica','ObservacaoProjetos','Status'];
export const PROJETOS_DISTRATO = ['ObservacaoProjetos','Status'];
export const BOLSAS_EDITAL = ['NumeroEdital','DataPublicacaoEdital','DataLimiteInscricao','NumeroApoliceSeguro','Status'];
export const BOLSAS_CONTRATACAO = ['DocumentosPessoaisConferidos','NumeroApoliceSeguro','Status'];
export const BOLSAS_ADITIVO_DISTRATO = ['DocumentosPessoaisConferidos','Status'];

export function getVisibleFields({ perfil = 'Solicitante', tipoSolicitacao = 'Contratação', etapa = 'solicitante' } = {}) {
  if (perfil === 'Bolsista') return BOLSISTA_FIELDS;
  if (perfil === 'Projetos') {
    if (tipoSolicitacao === 'Distrato') return PROJETOS_DISTRATO;
    if (tipoSolicitacao?.startsWith('Aditivo')) return PROJETOS_ADITIVO;
    return PROJETOS_CONTRATACAO;
  }
  if (perfil === 'Bolsas') {
    if (etapa === 'edital') return BOLSAS_EDITAL;
    if (tipoSolicitacao?.startsWith('Aditivo') || tipoSolicitacao === 'Distrato') return BOLSAS_ADITIVO_DISTRATO;
    return BOLSAS_CONTRATACAO;
  }
  return [...SOLICITANTE_GERAIS, ...(CAMPOS_POR_TIPO[tipoSolicitacao] || CAMPOS_POR_TIPO['Contratação'])];
}

export const DOCUMENT_BUTTONS = [
  { tipo: 'Termo de Referência', button: 'Gerar Termo de Referência', status: 'Aprovado - Projetos', tipos: ['Contratação', 'Termo de Referência - Abertura de Edital'], linkField: 'LinkTermoReferencia' },
  { tipo: 'Edital', button: 'Gerar Edital', status: 'Aguardando emissão do edital', tipos: ['Contratação'], linkField: 'LinkMinutaEdital' },
  { tipo: 'Termo de Outorga', button: 'Gerar Termo de Outorga', status: 'Aguardando emissão do termo de outorga', tipos: ['Contratação'], linkField: 'LinkMinutaContrato' },
  { tipo: 'Aditivo de Modalidade', button: 'Gerar Aditivo de Modalidade', status: 'Aguardando emissão do aditivo', tipos: ['Aditivo de modalidade'], linkField: 'LinkAditivo' },
  { tipo: 'Aditivo de Período', button: 'Gerar Aditivo de Período', status: 'Aguardando emissão do aditivo', tipos: ['Aditivo de período'], linkField: 'LinkAditivo' },
  { tipo: 'Aditivo de Valor', button: 'Gerar Aditivo de Valor', status: 'Aguardando emissão do aditivo', tipos: ['Aditivo de valor'], linkField: 'LinkAditivo' },
  { tipo: 'Distrato', button: 'Gerar Distrato', status: 'Aguardando emissão do distrato', tipos: ['Distrato'], linkField: 'LinkDistrato' },
];

export function getAllowedDocumentButtons(row = {}) {
  const status = row.Status;
  const tipo = row.TipoSolicitacao;
  return DOCUMENT_BUTTONS.filter((doc) => doc.status === status && doc.tipos.includes(tipo));
}

export function buildDocumentPayload(row = {}, doc) {
  const now = new Date();
  const id = row.ID || row.id || `SOL-${now.getTime()}`;
  const filename = `${doc.tipo} - ${row.Projeto || row.NomeBolsista || id} - v${(row.__documentVersions?.[doc.tipo] || 0) + 1}.txt`;
  const campos = FORM_SOLICITACOES_FIELDS.map((field) => ({ campo: labelOf(field), valor: row[field] ?? '', placeholder: placeholderOf(field) }));
  const content = [
    doc.tipo.toUpperCase(),
    `Solicitação vinculada: ${id}`,
    `Tipo de solicitação: ${row.TipoSolicitacao || ''}`,
    `Status no momento da geração: ${row.Status || ''}`,
    `Gerado em: ${now.toLocaleString('pt-BR')}`,
    '',
    'PLACEHOLDERS SUBSTITUÍDOS',
    ...campos.filter((c) => c.valor !== '').map((c) => `${c.placeholder}: ${c.valor}`),
    '',
    'Observação: este arquivo é gerado pela camada documental do sistema. Ao cadastrar modelo DOCX real, o mesmo mapeamento de placeholders amigáveis é usado para substituição.'
  ].join('\n');
  return { filename, content, campos };
}

export function downloadGeneratedDocument(row, doc) {
  const payload = buildDocumentPayload(row, doc);
  const blob = new Blob([payload.content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = payload.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return payload;
}

export function markDocumentUpdated(row = {}, doc, payload) {
  return {
    ...row,
    [doc.linkField]: payload.filename,
    [`Status ${doc.tipo}`]: 'Gerado',
    [`Data de geração ${doc.tipo}`]: new Date().toISOString(),
    __documentVersions: { ...(row.__documentVersions || {}), [doc.tipo]: ((row.__documentVersions?.[doc.tipo] || 0) + 1) },
    __documentHistory: [
      ...(row.__documentHistory || []),
      { tipo: doc.tipo, arquivo: payload.filename, data: new Date().toISOString(), status: 'Gerado' },
    ],
  };
}

export function getAdminCamposRows() {
  return FORM_SOLICITACOES_FIELDS.map((field) => ({
    NomeCampo: labelOf(field),
    NomeTecnico: field,
    Secao: Object.entries(FORM_SECTIONS).find(([, fields]) => fields.includes(field))?.[0] || 'Geral',
    Subprocesso: field.includes('Aditivo') || field.startsWith('Nova') || field === 'NovoValor' ? 'Aditivo' : field.includes('Distrato') || field.includes('Desligamento') ? 'Distrato' : BOLSISTA_FIELDS.includes(field) ? 'Bolsista' : 'Contratação',
    TipoCampo: getFieldInputType(field),
    Obrigatorio: ['TipoSolicitacao','NomeSolicitante','EmailSolicitante','Projeto','CodigoProjeto'].includes(field) ? 'Sim' : 'Conforme regra',
    QuemPreenche: SOLICITANTE_GERAIS.includes(field) || Object.values(CAMPOS_POR_TIPO).flat().includes(field) ? 'Solicitante' : BOLSISTA_FIELDS.includes(field) ? 'Bolsista' : PROJETOS_CONTRATACAO.includes(field) ? 'Projetos' : 'Bolsas',
    MostrarQuando: 'Conforme tipo de solicitação, perfil e status',
    ValidacaoLista: LISTA_KEYS.includes(field) || field === 'Estado' ? (field === 'Estado' ? 'UF' : field) : '',
    AjudaUsuario: `Campo ${labelOf(field)} integrado aos placeholders e formulários dinâmicos.`,
    UsadoEm: MAPEAMENTO_DOCUMENTOS.filter((m) => m['Campo origem'] === field).map((m) => m.Documento).join(', '),
  }));
}

export { FORM_SECTIONS, LISTAS_VALIDACAO_SEED, FLUXO_STATUS, MAPEAMENTO_DOCUMENTOS, DOCUMENT_MODELS, calcularVigenciaMeses, getFieldInputType };
