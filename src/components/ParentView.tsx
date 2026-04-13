import React from 'react';
import { useAuthStore } from '../authStore';
import { useAppStore } from '../store';
import { Calendar, MessageSquare, TrendingUp, LogOut } from 'lucide-react';

export function ParentView() {
  const { parentAccessCode, logoutParent } = useAuthStore();
  const { coachesData } = useAppStore();

  // Find the player and coach data based on the access code
  let playerData = null;
  let coachData = null;

  for (const coachId in coachesData) {
    const coach = coachesData[coachId];
    if (coach.settings?.enableParentModule) {
      const player = coach.players.find(p => p.accessCode === parentAccessCode);
      if (player) {
        playerData = player;
        coachData = coach;
        break;
      }
    }
  }

  if (!playerData || !coachData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">Nie znaleziono danych lub moduł został wyłączony.</p>
          <button onClick={logoutParent} className="text-blue-500 hover:underline">Wróć do logowania</button>
        </div>
      </div>
    );
  }

  const playerMessages = coachData.messages.filter(m => m.playerId === playerData.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const upcomingEvents = coachData.events.filter(e => new Date(e.date).getTime() >= new Date().setHours(0,0,0,0)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
              <span className="text-blue-400 font-bold">{playerData.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">{playerData.name}</h1>
              <p className="text-xs text-gray-400">Strefa Rodzica / Zawodnika</p>
            </div>
          </div>
          <button 
            onClick={logoutParent}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        
        {/* Stats Section */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-bold">Rozwój i statystyki</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-500">{playerData.stats.goals}</div>
              <div className="text-xs text-gray-400 mt-1">Bramki</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{playerData.stats.assists}</div>
              <div className="text-xs text-gray-400 mt-1">Asysty</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">{playerData.stats.minutes}</div>
              <div className="text-xs text-gray-400 mt-1">Minuty</div>
            </div>
          </div>
        </section>

        {/* Messages Section */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold">Wiadomości od trenera</h2>
          </div>
          <div className="space-y-4">
            {playerMessages.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Brak wiadomości</p>
            ) : (
              playerMessages.map(msg => (
                <div key={msg.id} className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-2">
                    {formatDateTime(msg.date)}
                  </div>
                  <p className="text-gray-300">{msg.content}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Schedule Section */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold">Terminarz</h2>
          </div>
          <div className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Brak nadchodzących wydarzeń</p>
            ) : (
              upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-xl p-4">
                  <div>
                    <h3 className="font-bold text-white">{event.title}</h3>
                    <p className="text-sm text-gray-400">{event.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-500 font-medium">{formatDate(event.date)}</div>
                    <div className="text-sm text-gray-500">{event.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
