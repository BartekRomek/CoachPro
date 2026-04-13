import React, { useState } from 'react';
import { MessageSquare, Send, Users, CheckSquare, Square, Clock } from 'lucide-react';
import { useAppStore, useCoachData } from '../store';
import { cn } from '../lib/utils';

export function MessagesView() {
  const { players, messages, settings } = useCoachData();
  const { sendMessage } = useAppStore();
  const [content, setContent] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedPlayers.length === players.length) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(players.map(p => p.id));
    }
  };

  const togglePlayer = (id: string) => {
    if (selectedPlayers.includes(id)) {
      setSelectedPlayers(selectedPlayers.filter(pId => pId !== id));
    } else {
      setSelectedPlayers([...selectedPlayers, id]);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && selectedPlayers.length > 0) {
      sendMessage(selectedPlayers, content.trim());
      setContent('');
      setSelectedPlayers([]);
    }
  };

  // Group messages by content and date to show history
  const groupedMessages = messages.reduce((acc, msg) => {
    const key = `${msg.date}_${msg.content}`;
    if (!acc[key]) {
      acc[key] = { date: msg.date, content: msg.content, playerIds: [] };
    }
    acc[key].playerIds.push(msg.playerId);
    return acc;
  }, {} as Record<string, { date: string, content: string, playerIds: string[] }>);

  const history = Object.values(groupedMessages).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!settings?.enableParentModule) {
    return (
      <div className="p-4 md:p-8 h-full overflow-y-auto flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md text-center">
          <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Moduł wyłączony</h2>
          <p className="text-gray-400">
            Moduł wiadomości i strefa rodzica są obecnie wyłączone. Możesz je włączyć w ustawieniach na Stronie Głównej.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Wiadomości</h2>
          <p className="text-gray-400">Komunikacja z rodzicami i zawodnikami</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Message */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-500" />
              Nowa wiadomość
            </h3>
            
            <form onSubmit={handleSend} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Treść wiadomości</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Napisz wiadomość do wybranych osób..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors min-h-[120px] resize-y"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-400">Odbiorcy ({selectedPlayers.length})</label>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-sm text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1"
                  >
                    {selectedPlayers.length === players.length && players.length > 0 ? (
                      <><CheckSquare className="w-4 h-4" /> Odznacz wszystkich</>
                    ) : (
                      <><Square className="w-4 h-4" /> Zaznacz wszystkich</>
                    )}
                  </button>
                </div>
                
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-2 max-h-[300px] overflow-y-auto">
                  {players.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm">Brak zawodników w bazie</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {players.map(player => (
                        <button
                          key={player.id}
                          type="button"
                          onClick={() => togglePlayer(player.id)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg text-left transition-colors border",
                            selectedPlayers.includes(player.id)
                              ? "bg-blue-500/10 border-blue-500/30 text-white"
                              : "bg-gray-900 border-transparent text-gray-400 hover:bg-gray-800"
                          )}
                        >
                          {selectedPlayers.includes(player.id) ? (
                            <CheckSquare className="w-5 h-5 text-blue-500 shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-600 shrink-0" />
                          )}
                          <div className="truncate">
                            <div className="font-medium truncate">{player.name}</div>
                            <div className="text-xs opacity-60">{player.position}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!content.trim() || selectedPlayers.length === 0}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Wyślij wiadomość
              </button>
            </form>
          </div>
        </div>

        {/* Message History */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col h-[calc(100vh-8rem)]">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 shrink-0">
            <Clock className="w-5 h-5 text-gray-400" />
            Historia wysłanych
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Brak wysłanych wiadomości</p>
            ) : (
              history.map((msg, idx) => {
                const isAll = msg.playerIds.length === players.length && players.length > 0;
                const recipientNames = isAll 
                  ? 'Wszyscy zawodnicy' 
                  : msg.playerIds.map(id => players.find(p => p.id === id)?.name).filter(Boolean).join(', ');

                return (
                  <div key={idx} className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2 gap-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg w-fit">
                        <Users className="w-3 h-3" />
                        <span className="truncate max-w-[150px]" title={recipientNames}>{recipientNames}</span>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{formatDate(msg.date)}</span>
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.content}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
