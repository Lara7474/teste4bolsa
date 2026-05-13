-- Schema de referência para migração Supabase do Processo de Bolsas.
-- O front atual preserva Base44, mas estes nomes dão suporte à evolução para Supabase.
create table if not exists public.solicitacoes (
  id uuid primary key default gen_random_uuid(),
  dados jsonb not null default '{}'::jsonb,
  tipo_solicitacao text generated always as (dados->>'TipoSolicitacao') stored,
  status text generated always as (coalesce(dados->>'Status','Recebido')) stored,
  responsavel_atual text generated always as (dados->>'ResponsavelAtual') stored,
  solicitante_email text generated always as (dados->>'EmailSolicitante') stored,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create table if not exists public.contratos (
  id uuid primary key default gen_random_uuid(),
  id_contrato text unique not null,
  solicitacao_id uuid references public.solicitacoes(id),
  dados jsonb not null default '{}'::jsonb,
  status_contrato text not null default 'Ativo',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create table if not exists public.documentos (
  id uuid primary key default gen_random_uuid(),
  solicitacao_id uuid references public.solicitacoes(id),
  contrato_id uuid references public.contratos(id),
  tipo_documento text not null,
  nome_documento text not null,
  link_arquivo text,
  versao int not null default 1,
  status_geracao text not null default 'Gerado',
  hash_dados text,
  gerado_por uuid,
  created_at timestamptz default now()
);
create table if not exists public.modelos_documentos (
  id uuid primary key default gen_random_uuid(),
  nome_modelo text not null,
  tipo_documento text not null,
  instituicao_modelo_contratual text,
  unidade_executora text,
  arquivo_modelo_url text,
  placeholders jsonb default '[]'::jsonb,
  ativo boolean default true,
  usuario_responsavel uuid,
  updated_at timestamptz default now()
);
create table if not exists public.campos_formulario (
  id uuid primary key default gen_random_uuid(),
  nome_campo text not null,
  nome_tecnico text not null unique,
  secao text,
  subprocesso text,
  tipo_campo text,
  obrigatorio text,
  quem_preenche text,
  mostrar_quando text,
  validacao_lista text,
  ajuda_usuario text,
  usado_em text,
  ativo boolean default true
);
create table if not exists public.listas_validacao (
  id uuid primary key default gen_random_uuid(),
  lista text not null,
  valor text not null,
  ordem int default 0,
  ativo boolean default true,
  unique(lista, valor)
);
create table if not exists public.fluxo_status (
  id uuid primary key default gen_random_uuid(),
  tipo_solicitacao text not null,
  status_atual text not null,
  proximo_status text,
  setor_responsavel text,
  acao_esperada text,
  ordem int not null default 0,
  ativo boolean default true
);
create table if not exists public.historico_alteracoes (
  id uuid primary key default gen_random_uuid(),
  entidade text not null,
  entidade_id uuid,
  acao text not null,
  dados_anteriores jsonb,
  dados_novos jsonb,
  usuario_id uuid,
  created_at timestamptz default now()
);
create table if not exists public.perfis_usuarios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  perfil text not null check (perfil in ('Solicitante','Bolsista','Projetos','Bolsas','Administração')),
  ativo boolean default true,
  created_at timestamptz default now()
);
