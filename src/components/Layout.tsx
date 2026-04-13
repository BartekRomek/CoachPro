import React, { useState } from 'react';
import { Users, Activity, LayoutDashboard, Calendar, BarChart3, Home, Menu, X, FileText, LogOut, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../authStore';
import { useAppStore } from '../store';

export type TabType = 'dashboard' | 'schedule' | 'players' | 'training' | 'lineup' | 'analytics' | 'reports' | 'messages';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuthStore();
  const { setCoachId } = useAppStore();

  const handleLogout = () => {
    logout();
    setCoachId(null);
  };

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 z-40">
        <h1 className="text-xl font-bold text-emerald-500 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          CoachPro
        </h1>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-500 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            CoachPro
          </h1>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => handleTabClick('dashboard')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
              activeTab === 'dashboard' 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            )}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Strona Główna</span>
          </button>

          <button
            onClick={() => handleTabClick('schedule')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
              activeTab === 'schedule' 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            )}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Terminarz</span>
          </button>

          <button
            onClick={() => handleTabClick('players')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
              activeTab === 'players' 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            )}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Baza Zawodników</span>
          </button>

          <button
            onClick={() => handleTabClick('training')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
              activeTab === 'training' 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            )}
          >
            <Activity className="w-5 h-5" />
            <span className="font-medium">Moduł Treningu</span>
          </button>

          <button
            onClick={() => handleTabClick('reports')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
              activeTab === 'reports' 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            )}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Raporty</span>
          </button>
          
          <button
            onClick={() => handleTabClick('lineup')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
              activeTab === 'lineup' 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Taktyka & Skład</span>
          </button>

          <button
            onClick={() => handleTabClick('analytics')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
              activeTab === 'analytics' 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            )}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Statystyki</span>
          </button>

          <button
            onClick={() => handleTabClick('messages')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
              activeTab === 'messages' 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            )}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Wiadomości</span>
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">{currentUser?.name || 'Trener'}</span>
              <span className="text-xs text-gray-500">Konto trenerskie</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Wyloguj się"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <div className="text-xs text-gray-600 text-center">
            &copy; 2026 CoachPro
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}

