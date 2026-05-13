import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Layout
import AppLayout from '@/components/layout/AppLayout';

// Pages
import Dashboard from '@/pages/Dashboard';
import Solicitacoes from '@/pages/Solicitacoes';
import Contratos from '@/pages/Contratos';
import Editais from '@/pages/Editais';
import Bolsistas from '@/pages/Bolsistas';
import Aditivos from '@/pages/Aditivos';
import Distratos from '@/pages/Distratos';
import Documentos from '@/pages/Documentos';
import Admin from '@/pages/Admin';
import FluxoAprovacao from '@/pages/FluxoAprovacao';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/solicitacoes" element={<Solicitacoes />} />
        <Route path="/nova-solicitacao" element={<Solicitacoes />} />
        <Route path="/analise-projetos" element={<FluxoAprovacao />} />
        <Route path="/setor-bolsas" element={<Documentos />} />
        <Route path="/contratos" element={<Contratos />} />
        <Route path="/contratos-ativos" element={<Contratos />} />
        <Route path="/editais" element={<Editais />} />
        <Route path="/bolsistas" element={<Bolsistas />} />
        <Route path="/aditivos" element={<Aditivos />} />
        <Route path="/distratos" element={<Distratos />} />
        <Route path="/documentos" element={<Documentos />} />
        <Route path="/fluxo" element={<FluxoAprovacao />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/usuarios-permissoes" element={<Admin />} />
        <Route path="/relatorios" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
