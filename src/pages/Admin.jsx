import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, ListChecks, GitBranch, FileText, Shield } from 'lucide-react';
import { getAdminCamposRows, LISTA_KEYS, getListaOptions, FLUXO_STATUS, DOCUMENT_BUTTONS, MAPEAMENTO_DOCUMENTOS, placeholderOf } from '@/lib/processoBolsasRules';

const campos = getAdminCamposRows();
const modelos = DOCUMENT_BUTTONS.map((d) => ({
  NomeModelo: `Modelo - ${d.tipo}`,
  TipoDocumento: d.tipo,
  InstituicaoModeloContrato: 'Configurável',
  UnidadeExecutora: 'Quando aplicável',
  ArquivoModelo: 'Cadastrar arquivo DOCX/PDF',
  Status: 'Ativo',
  DataAtualizacao: new Date().toLocaleDateString('pt-BR'),
  UsuarioResponsavel: 'Administração',
}));

function SimpleTable({ columns, rows, max = 80 }) {
  return (
    <div className="rounded-xl border overflow-auto bg-white">
      <Table>
        <TableHeader>
          <TableRow>{columns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow>
        </TableHeader>
        <TableBody>
          {rows.slice(0, max).map((row, index) => (
            <TableRow key={index}>{columns.map((c) => <TableCell key={c} className="text-xs whitespace-nowrap">{row[c] || '—'}</TableCell>)}</TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Admin() {
  const listaRows = LISTA_KEYS.flatMap((key) => getListaOptions(key).map((value) => ({ Lista: key, Valor: value, Ativo: 'Sim' })));
  const fluxoRows = FLUXO_STATUS.map((f) => ({
    'Tipo de solicitação': f.Processo,
    'Status atual': f.Status,
    'Próximo status': f['Próximo status'],
    'Setor responsável': f.Responsável,
    'Ação esperada': f['Automação/ação'],
    Ordem: f.Ordem,
    Ativo: 'Sim',
  }));
  const placeholders = campos.map((c) => ({ Campo: c.NomeCampo, 'Nome técnico': c.NomeTecnico, Placeholder: placeholderOf(c.NomeTecnico), 'Usado em': c.UsadoEm || 'Disponível para modelos' }));

  return (
    <div className="space-y-4">
      <PageHeader title="Administração" description="Campos, listas, fluxos, modelos, permissões e placeholders do Processo de Bolsas." />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">{campos.length}</div><div className="text-xs text-slate-500">Campos cadastrados</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">{LISTA_KEYS.length}</div><div className="text-xs text-slate-500">Listas de validação</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">{DOCUMENT_BUTTONS.length}</div><div className="text-xs text-slate-500">Modelos de documentos</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">5</div><div className="text-xs text-slate-500">Perfis de acesso</div></CardContent></Card>
      </div>

      <Tabs defaultValue="campos" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="campos" className="gap-2"><Settings className="w-3.5 h-3.5" /> Campos</TabsTrigger>
          <TabsTrigger value="listas" className="gap-2"><ListChecks className="w-3.5 h-3.5" /> Listas</TabsTrigger>
          <TabsTrigger value="fluxo" className="gap-2"><GitBranch className="w-3.5 h-3.5" /> Fluxo de Status</TabsTrigger>
          <TabsTrigger value="modelos" className="gap-2"><FileText className="w-3.5 h-3.5" /> Modelos</TabsTrigger>
          <TabsTrigger value="placeholders" className="gap-2"><FileText className="w-3.5 h-3.5" /> Placeholders</TabsTrigger>
          <TabsTrigger value="perfis" className="gap-2"><Shield className="w-3.5 h-3.5" /> Perfis</TabsTrigger>
        </TabsList>

        <TabsContent value="campos">
          <Card><CardHeader><CardTitle className="text-base">Campos do formulário</CardTitle></CardHeader><CardContent>
            <SimpleTable columns={['NomeCampo','NomeTecnico','Secao','Subprocesso','TipoCampo','Obrigatorio','QuemPreenche','MostrarQuando','ValidacaoLista','AjudaUsuario','UsadoEm']} rows={campos} />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="listas">
          <Card><CardHeader><CardTitle className="text-base">Listas de valores cadastráveis</CardTitle></CardHeader><CardContent>
            <SimpleTable columns={['Lista','Valor','Ativo']} rows={listaRows} max={200} />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="fluxo">
          <Card><CardHeader><CardTitle className="text-base">Fluxo de status</CardTitle></CardHeader><CardContent>
            <SimpleTable columns={['Tipo de solicitação','Status atual','Próximo status','Setor responsável','Ação esperada','Ordem','Ativo']} rows={fluxoRows} />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="modelos">
          <Card><CardHeader><CardTitle className="text-base">Modelos de documentos</CardTitle></CardHeader><CardContent>
            <SimpleTable columns={['NomeModelo','TipoDocumento','InstituicaoModeloContrato','UnidadeExecutora','ArquivoModelo','Status','DataAtualizacao','UsuarioResponsavel']} rows={modelos} />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="placeholders">
          <Card><CardHeader><CardTitle className="text-base">Placeholders amigáveis</CardTitle></CardHeader><CardContent>
            <SimpleTable columns={['Campo','Nome técnico','Placeholder','Usado em']} rows={placeholders} max={200} />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="perfis">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ['Solicitante', 'Cria solicitações, visualiza as próprias solicitações e preenche apenas campos do solicitante.'],
              ['Bolsista', 'Preenche dados pessoais e documentação após liberação do setor de Bolsas.'],
              ['Projetos', 'Analisa viabilidade, plano de trabalho, saldo, tabela aplicável e status da etapa.'],
              ['Bolsas', 'Gerencia edital, contratação, aditivos, distratos, documentos e histórico contratual.'],
              ['Administração', 'Gerencia campos, listas, fluxos, modelos, usuários e permissões.'],
            ].map(([perfil, desc]) => (
              <Card key={perfil}><CardHeader><CardTitle className="text-base flex justify-between"><span>{perfil}</span><Badge>Ativo</Badge></CardTitle></CardHeader><CardContent><p className="text-sm text-slate-600">{desc}</p></CardContent></Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
