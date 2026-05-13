import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Briefcase, Users, BookOpen,
  FilePlus, FileX, Files, Settings, ChevronLeft, ChevronRight,
  GraduationCap, Menu, X, LogOut, GitBranch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/solicitacoes', label: 'Solicitações', icon: FileText },
  { path: '/nova-solicitacao', label: 'Nova Solicitação', icon: FilePlus },
  { path: '/analise-projetos', label: 'Análise de Projetos', icon: GitBranch },
  { path: '/setor-bolsas', label: 'Setor de Bolsas', icon: BookOpen },
  { path: '/bolsistas', label: 'Cadastro do Bolsista', icon: GraduationCap },
  { path: '/contratos-ativos', label: 'Contratos Ativos', icon: Briefcase },
  { path: '/aditivos', label: 'Aditivos', icon: FilePlus },
  { path: '/distratos', label: 'Distratos', icon: FileX },
  { path: '/documentos', label: 'Documentos', icon: Files },
  { path: '/admin', label: 'Administração', icon: Settings },
  { path: '/usuarios-permissoes', label: 'Usuários e Permissões', icon: Users },
  { path: '/relatorios', label: 'Relatórios', icon: LayoutDashboard },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: alertas = [] } = useQuery({
    queryKey: ['alertas'],
    queryFn: () => base44.entities.Alerta.list('-created_date', 50),
    refetchInterval: 60000,
  });
  const unreadCount = alertas.filter(a => !a.lido).length;

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-sm tracking-wide">FAPED</h1>
            <p className="text-sidebar-foreground/60 text-[10px] leading-tight">Processo de Bolsas</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-white shadow-sm'
                  : 'text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent/50'
              )}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span className="flex-1">{label}</span>}
              {!collapsed && path === '/admin' && unreadCount > 0 && (
                <span className="bg-destructive text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:text-white hover:bg-sidebar-accent/50 transition-all w-full',
          )}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden bg-primary text-white hover:bg-primary/90 shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full z-40 bg-sidebar transition-transform duration-300 md:hidden w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <NavContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden md:flex flex-col h-screen bg-sidebar sticky top-0 transition-all duration-300 border-r border-sidebar-border',
        collapsed ? 'w-16' : 'w-60'
      )}>
        <NavContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary border-2 border-background flex items-center justify-center text-white hover:bg-primary/90 transition-colors shadow-md"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>
    </>
  );
}
