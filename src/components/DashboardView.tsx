import React from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Plus, ArrowRight, Settings, Users } from 'lucide-react';
import { useAppStore, useCoachData } from '../store';
import { TabType } from './Layout';
import { cn } from '../lib/utils';

interface DashboardViewProps {
  setActiveTab: (tab: TabType) => void;
}

export function DashboardView({ setActiveTab }: DashboardViewProps) {
  const { events, settings } = useCoachData();
  const { setActiveEvent, updateSettings } = useAppStore();
  
  // Find next event (closest in the future)
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextEvent = sortedEvents[0]; // Assuming all mock events are in the future for simplicity

  const handleEventClick = () => {
    if (!nextEvent) return;
    
    setActiveEvent(nextEvent.id);
    if (nextEvent.type === 'Mecz') {
      setActiveTab('lineup');
    } else if (nextEvent.type === 'Trening') {
      setActiveTab('training');
    } else {
      setActiveTab('schedule');
    }
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Strona Główna</h2>
          <p className="text-gray-400">Podsumowanie i widgety</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Next Event Widget */}
        {nextEvent ? (
          <div 
            onClick={handleEventClick}
            className={cn(
              "rounded-2xl p-6 shadow-xl cursor-pointer transition-all hover:scale-[1.02] border-2",
              nextEvent.type === 'Mecz' 
                ? "bg-red-950/30 border-red-500/50 hover:border-red-500" 
                : nextEvent.type === 'Trening'
                  ? "bg-yellow-950/30 border-yellow-500/50 hover:border-yellow-500"
                  : "bg-blue-950/30 border-blue-500/50 hover:border-blue-500"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={cn(
                "px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider",
                nextEvent.type === 'Mecz' ? "bg-red-500/20 text-red-400" :
                nextEvent.type === 'Trening' ? "bg-yellow-500/20 text-yellow-400" :
                "bg-blue-500/20 text-blue-400"
              )}>
                Najbliższe: {nextEvent.type}
              </span>
              <ArrowRight className={cn(
                "w-5 h-5",
                nextEvent.type === 'Mecz' ? "text-red-400" :
                nextEvent.type === 'Trening' ? "text-yellow-400" :
                "text-blue-400"
              )} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">{nextEvent.title}</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-4 h-4 text-gray-400" /> 
                <span className="font-medium text-gray-200">{nextEvent.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400" /> 
                <span className="font-medium text-gray-200">{nextEvent.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" /> 
                <span className="font-medium text-gray-200">{nextEvent.location}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-center text-gray-500">
            Brak nadchodzących wydarzeń
          </div>
        )}

        {/* Settings Widget */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-white">Ustawienia modułów</h3>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-950 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-white">Moduł Rodzica</p>
                <p className="text-xs text-gray-400">Dostęp dla rodziców / dzieci</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ enableParentModule: !settings?.enableParentModule })}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                settings?.enableParentModule ? "bg-emerald-500" : "bg-gray-700"
              )}
            >
              <div className={cn(
                "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                settings?.enableParentModule ? "translate-x-7" : "translate-x-1"
              )} />
            </button>
          </div>
        </div>

        {/* Placeholder for other widgets */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center text-gray-500 border-dashed">
          <Plus className="w-8 h-8 mb-2 opacity-50" />
          <p>Dodaj widget</p>
        </div>
      </div>
    </div>
  );
}
