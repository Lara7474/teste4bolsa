import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { tipoLabels } from '@/pages/Documentos';

export default function ModelosUpload({ modelos, onRefresh }) {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ nome: '', tipo: '', instituicao: 'FAPED', versao: '', descricao: '', observacoes: '' });
  const [file, setFile] = useState(null);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleUpload = async () => {
    if (!file || !form.nome || !form.tipo) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.ModeloDocumento.create({
      ...form,
      arquivo_url: file_url,
      arquivo_nome: file.name,
      formato: file.name.split('.').pop().toLowerCase(),
      ativo: true,
    });
    onRefresh?.();
    setForm({ nome: '', tipo: '', instituicao: 'FAPED', versao: '', descricao: '', observacoes: '' });
    setFile(null);
    setUploading(false);
    toast.success('Modelo enviado com sucesso!');
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover este modelo?')) return;
    await base44.entities.ModeloDocumento.delete(id);
    onRefresh?.();
    toast.success('Modelo removido.');
  };

  const toggleAtivo = async (modelo) => {
    await base44.entities.ModeloDocumento.update(modelo.id, { ativo: !modelo.ativo });
    onRefresh?.();
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Enviar Novo Modelo</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Nome do Modelo *</Label>
              <Input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex: Termo de Outorga Embrapa v2024" />
            </div>
            <div>
              <Label className="text-xs">Tipo de Documento *</Label>
              <Select value={form.tipo} onValueChange={v => set('tipo', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{Object.entries(tipoLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Instituição</Label>
              <Input value={form.instituicao} onChange={e => set('instituicao', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Versão</Label>
              <Input value={form.versao} onChange={e => set('versao', e.target.value)} placeholder="Ex: v1.0, 2024" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Descrição</Label>
            <Textarea value={form.descricao} onChange={e => set('descricao', e.target.value)} rows={2} />
          </div>
          <div>
            <Label className="text-xs">Arquivo (.docx, .pdf, .doc) *</Label>
            <div className="mt-1 border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/40 transition-colors">
              <input
                type="file"
                id="modelo-upload"
                className="hidden"
                accept=".docx,.doc,.pdf,.txt"
                onChange={e => setFile(e.target.files[0])}
              />
              <label htmlFor="modelo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                {file ? (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{file.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Clique para selecionar o arquivo</span>
                )}
              </label>
            </div>
          </div>
          <Button onClick={handleUpload} disabled={uploading || !file || !form.nome || !form.tipo} className="bg-primary">
            {uploading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Enviando...</> : <><Upload className="w-4 h-4 mr-2" /> Enviar Modelo</>}
          </Button>
        </CardContent>
      </Card>

      {/* Modelos list */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Modelos Cadastrados ({modelos.length})</h3>
        {modelos.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum modelo cadastrado ainda.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {modelos.map(m => (
            <Card key={m.id} className={`border ${m.ativo ? 'border-border' : 'border-border/40 opacity-60'}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{m.nome}</p>
                      <p className="text-xs text-muted-foreground">{tipoLabels[m.tipo] || m.tipo}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => toggleAtivo(m)} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${m.ativo ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {m.ativo ? 'Ativo' : 'Inativo'}
                    </button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(m.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {m.instituicao && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{m.instituicao}</span>}
                  {m.versao && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{m.versao}</span>}
                  {m.formato && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">{m.formato}</span>}
                </div>
                {m.arquivo_url && (
                  <a href={m.arquivo_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 block">
                    Baixar arquivo →
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
