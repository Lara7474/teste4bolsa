import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, ArrowLeft, UserRound, BriefcaseBusiness, GraduationCap, Building2 } from 'lucide-react';
import {
  labelOf,
  getListaOptions,
  getVisibleFields,
  calcularVigenciaMeses,
  getFieldInputType,
  LISTA_KEYS,
} from '@/lib/processoBolsasRules';
import { LONG_TEXT_FIELDS } from '@/lib/planilhaMaeConfig';

const PERFIS = [
  { key: 'Solicitante', label: 'Solicitante', icon: UserRound },
  { key: 'Projetos', label: 'Setor de Projetos', icon: BriefcaseBusiness },
  { key: 'Bolsas', label: 'Setor de Bolsas', icon: Building2 },
  { key: 'Bolsista', label: 'Bolsista', icon: GraduationCap },
];

const listForField = (field) => {
  if (field === 'Estado') return getListaOptions('UF');
  if (LISTA_KEYS.includes(field)) return getListaOptions(field);
  if (field === 'ContratacaoPrevistaPlanoTrabalho' || field === 'DocumentosPessoaisConferidos') return getListaOptions('Confirmacao');
  return [];
};

function FieldInput({ field, value, onChange }) {
  const options = listForField(field);
  const type = getFieldInputType(field);
  const isLong = LONG_TEXT_FIELDS.has(field) || ['ObjetivoContratacao', 'JustificativaAditivo', 'JustificativaDistrato', 'AtividadesDesenvolvidas'].includes(field);
  const colSpan = isLong ? 'md:col-span-2' : '';

  return (
    <div className={colSpan}>
      <Label htmlFor={field} className="text-xs font-semibold text-slate-700">{labelOf(field)}</Label>
      {options.length ? (
        <Select value={value || ''} onValueChange={(v) => onChange(field, v)}>
          <SelectTrigger id={field} className="mt-1"><SelectValue placeholder={`Selecione ${labelOf(field).toLowerCase()}`} /></SelectTrigger>
          <SelectContent>
            {options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
          </SelectContent>
        </Select>
      ) : isLong ? (
        <Textarea id={field} value={value ?? ''} onChange={(event) => onChange(field, event.target.value)} rows={3} className="mt-1" />
      ) : (
        <Input id={field} type={type} value={value ?? ''} onChange={(event) => onChange(field, type === 'number' && event.target.value !== '' ? Number(event.target.value) : event.target.value)} className="mt-1" />
      )}
    </div>
  );
}

export default function SolicitacaoForm({ item, onSubmit, onCancel, isLoading }) {
  const [perfil, setPerfil] = useState(item?.__perfilFormulario || 'Solicitante');
  const [etapaBolsas, setEtapaBolsas] = useState('edital');
  const [formData, setFormData] = useState({
    TipoSolicitacao: 'Contratação',
    Prioridade: 'Média',
    Status: 'Recebido',
    EtapaAtual: 'Solicitante',
    ResponsavelAtual: 'Projetos',
    ...(item || {}),
  });

  const tipoSolicitacao = formData.TipoSolicitacao || 'Contratação';
  const fields = useMemo(() => getVisibleFields({ perfil, tipoSolicitacao, etapa: etapaBolsas }), [perfil, tipoSolicitacao, etapaBolsas]);
  const groups = useMemo(() => {
    const base = { 'Dados principais': [], 'Dados específicos': [], 'Status e controle': [] };
    fields.forEach((field) => {
      if (['TipoSolicitacao','Prioridade','Status','EtapaAtual','ResponsavelAtual'].includes(field)) base['Status e controle'].push(field);
      else if (['NomeSolicitante','EmailSolicitante','SetorSolicitante','TelefoneSolicitante','Projeto','CodigoProjeto','Financiadora','InstituicaoModeloContrato','UnidadeExecutora','DataAssinaturaProjeto','DataInicioProjeto','DataFimProjeto','MetaTED','EtapaTED','Coordenador','CPFCoordenador','EmailCoordenador','Orientador','CPFOrientador','EmailOrientador','ObjetivoContratacao','AreaAtuacao','LocalTrabalho'].includes(field)) base['Dados principais'].push(field);
      else base['Dados específicos'].push(field);
    });
    return Object.entries(base).filter(([, values]) => values.length);
  }, [fields]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value, UltimaAtualizacao: new Date().toISOString() };
      if (field === 'TipoSolicitacao') {
        next.Status = 'Recebido';
        next.EtapaAtual = 'Solicitante';
        next.ResponsavelAtual = value === 'Contratação' ? 'Projetos' : 'Projetos';
        if (value === 'Aditivo de valor') next.TipoAditivo = 'Valor';
        if (value === 'Aditivo de modalidade') next.TipoAditivo = 'Modalidade';
        if (value === 'Aditivo de período') next.TipoAditivo = 'Período';
      }
      if (field === 'DataInicioVigencia' || field === 'DataFimVigencia') {
        next.VigenciaMeses = calcularVigenciaMeses(
          field === 'DataInicioVigencia' ? value : next.DataInicioVigencia,
          field === 'DataFimVigencia' ? value : next.DataFimVigencia,
        );
      }
      if (prev.__documentHistory?.length) next.__documentNeedsRefresh = true;
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ ...formData, __perfilFormulario: perfil });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{item ? 'Editar Solicitação' : 'Nova Solicitação'}</h1>
          <p className="text-sm text-slate-500">Formulário dinâmico por perfil, tipo de solicitação e fluxo de status.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
          <Button type="submit" disabled={isLoading}><Save className="w-4 h-4 mr-2" />Salvar</Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-base">Perfil do formulário</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {PERFIS.map(({ key, label, icon: Icon }) => (
            <Button key={key} type="button" variant={perfil === key ? 'default' : 'outline'} onClick={() => setPerfil(key)} className="gap-2">
              <Icon className="w-4 h-4" />{label}
            </Button>
          ))}
          {perfil === 'Bolsas' && (
            <Select value={etapaBolsas} onValueChange={setEtapaBolsas}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="edital">Edital</SelectItem>
                <SelectItem value="contratacao">Contratação</SelectItem>
                <SelectItem value="aditivo">Aditivo/Distrato</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue={groups[0]?.[0]} className="w-full">
        <TabsList className="flex flex-wrap h-auto justify-start bg-slate-100 p-1">
          {groups.map(([name]) => <TabsTrigger key={name} value={name} className="text-xs">{name}</TabsTrigger>)}
        </TabsList>
        {groups.map(([name, groupFields]) => (
          <TabsContent key={name} value={name}>
            <Card>
              <CardHeader><CardTitle className="text-base">{name}</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupFields.map((field) => <FieldInput key={field} field={field} value={formData[field]} onChange={handleChange} />)}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </form>
  );
}
