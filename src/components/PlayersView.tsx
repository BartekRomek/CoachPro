import React, { useState } from 'react';
import { Plus, Flame, Plus as CrossIcon, Edit2, X, BarChart2, Trash2, Key, MessageSquare, Send } from 'lucide-react';
import { useAppStore, useCoachData } from '../store';
import { Player } from '../types';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function PlayersView() {
  const { players, events, attendances, reports, settings } = useCoachData();
  const { isPlayerInForm, toggleInjury, addPlayer, updatePlayer, deletePlayer, sendMessage } = useAppStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    position: 'ST',
    goals: 0,
    assists: 0,
    minutes: 0,
    photoUrl: '',
  });

  const openAddModal = () => {
    setEditingPlayer(null);
    setIsConfirmDelete(false);
    setFormData({ name: '', position: 'ST', goals: 0, assists: 0, minutes: 0, photoUrl: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (player: Player) => {
    setEditingPlayer(player);
    setIsConfirmDelete(false);
    setFormData({
      name: player.name,
      position: player.position,
      goals: player.stats.goals,
      assists: player.stats.assists,
      minutes: player.stats.minutes,
      photoUrl: player.photoUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG to save localStorage space
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setFormData(prev => ({ ...prev, photoUrl: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const openDetailsModal = (player: Player) => {
    setSelectedPlayer(player);
    setMessageContent('');
    setIsDetailsModalOpen(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayer && messageContent.trim()) {
      sendMessage(selectedPlayer.id, messageContent.trim());
      setMessageContent('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlayer) {
      updatePlayer(editingPlayer.id, {
        name: formData.name,
        position: formData.position,
        photoUrl: formData.photoUrl,
        stats: {
          ...editingPlayer.stats,
          goals: formData.goals,
          assists: formData.assists,
          minutes: formData.minutes,
        }
      });
    } else {
      addPlayer({
        name: formData.name,
        position: formData.position,
        photoUrl: formData.photoUrl,
        baseSkills: { pace: 50, shooting: 50, passing: 50, dribbling: 50, defending: 50, physical: 50 },
        stats: { goals: formData.goals, assists: formData.assists, minutes: formData.minutes },
        isInjured: false
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Baza Zawodników</h2>
          <p className="text-gray-400">Zarządzaj kadrą zespołu</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Dodaj zawodnika
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {players.map(player => {
          const inForm = isPlayerInForm(player.id);
          
          // Calculate real attendance %
          const totalTrainings = events.filter(e => e.type === 'Trening').length;
          const attendedTrainings = attendances.filter(a => a.playerId === player.id && a.isPresent).length;
          const attendancePct = totalTrainings > 0 ? Math.round((attendedTrainings / totalTrainings) * 100) : 0;
          
          return (
            <div key={player.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center relative hover:border-gray-700 transition-colors group">
              <button 
                onClick={() => openEditModal(player)}
                className="absolute top-4 left-4 p-1.5 bg-gray-800 text-gray-400 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Edytuj zawodnika"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button 
                onClick={() => openDetailsModal(player)}
                className="absolute top-4 left-12 p-1.5 bg-gray-800 text-emerald-400 hover:text-emerald-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Statystyki i rozwój"
              >
                <BarChart2 className="w-4 h-4" />
              </button>

              {inForm && !player.isInjured && (
                <div className="absolute top-4 right-4 bg-gray-950 rounded-full p-1 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                  <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" />
                </div>
              )}

              {player.isInjured && (
                <div className="absolute top-4 right-4 bg-red-500 rounded-full p-1 shadow-[0_0_15px_rgba(239,68,68,0.4)] z-10">
                  <CrossIcon className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold text-gray-300 mb-4 shadow-inner overflow-hidden border-2 border-gray-700">
                {player.photoUrl ? (
                  <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  player.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              
              <h3 className="text-lg font-bold text-white">{player.name}</h3>
              <p className="text-emerald-500 font-medium text-sm mb-4">{player.position}</p>

              <button 
                onClick={() => toggleInjury(player.id)}
                className={`mb-6 px-3 py-1 rounded-full text-xs font-bold transition-colors ${player.isInjured ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              >
                {player.isInjured ? 'Kontuzjowany' : 'Oznacz kontuzję'}
              </button>
              
              <div className="w-full grid grid-cols-3 gap-2 border-t border-gray-800 pt-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Gole</div>
                  <div className="font-bold text-white">{player.stats.goals}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Asysty</div>
                  <div className="font-bold text-white">{player.stats.assists}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Obecność</div>
                  <div className="font-bold text-white">{attendancePct}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingPlayer ? 'Edytuj zawodnika' : 'Dodaj zawodnika'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Imię i nazwisko</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Pozycja</label>
                <select 
                  value={formData.position}
                  onChange={e => setFormData({...formData, position: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="GK">GK (Bramkarz)</option>
                  <option value="CB">CB (Środkowy obrońca)</option>
                  <option value="LB">LB (Lewy obrońca)</option>
                  <option value="RB">RB (Prawy obrońca)</option>
                  <option value="CDM">CDM (Defensywny pomocnik)</option>
                  <option value="CM">CM (Środkowy pomocnik)</option>
                  <option value="CAM">CAM (Ofensywny pomocnik)</option>
                  <option value="LW">LW (Lewoskrzydłowy)</option>
                  <option value="RW">RW (Prawoskrzydłowy)</option>
                  <option value="ST">ST (Napastnik)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Zdjęcie zawodnika</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700 shrink-0">
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500 text-xs">Brak</span>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20 transition-colors cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Gole</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.goals}
                    onChange={e => setFormData({...formData, goals: parseInt(e.target.value) || 0})}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Asysty</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.assists}
                    onChange={e => setFormData({...formData, assists: parseInt(e.target.value) || 0})}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                {isConfirmDelete ? (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col gap-3">
                    <p className="text-red-400 text-sm text-center font-medium">Czy na pewno chcesz usunąć tego zawodnika? Tej operacji nie można cofnąć.</p>
                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setIsConfirmDelete(false)}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded-lg transition-colors"
                      >
                        Anuluj
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          if (editingPlayer) {
                            deletePlayer(editingPlayer.id);
                            setIsModalOpen(false);
                          }
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-colors"
                      >
                        Tak, usuń
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    {editingPlayer && (
                      <button 
                        type="button"
                        onClick={() => setIsConfirmDelete(true)}
                        className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl transition-colors flex items-center justify-center"
                        title="Usuń zawodnika"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold py-3 rounded-xl transition-colors"
                    >
                      {editingPlayer ? 'Zapisz zmiany' : 'Dodaj zawodnika'}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Player Details & Charts Modal */}
      {isDetailsModalOpen && selectedPlayer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-300 shadow-inner overflow-hidden border-2 border-gray-700">
                  {selectedPlayer.photoUrl ? (
                    <img src={selectedPlayer.photoUrl} alt={selectedPlayer.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    selectedPlayer.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedPlayer.name}</h3>
                  <p className="text-emerald-500 font-medium">{selectedPlayer.position}</p>
                  {settings?.enableParentModule && selectedPlayer.accessCode && (
                    <div className="flex items-center gap-2 mt-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg border border-blue-500/20 w-fit">
                      <Key className="w-4 h-4" />
                      <span className="text-sm font-medium">Kod dostępu: <span className="font-bold tracking-wider">{selectedPlayer.accessCode}</span></span>
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attendance Pie Chart */}
              <div className="bg-gray-950 border border-gray-800/50 rounded-xl p-4 flex flex-col items-center">
                <h4 className="text-lg font-semibold text-white mb-4">Frekwencja na treningach</h4>
                {(() => {
                  const totalTrainings = events.filter(e => e.type === 'Trening').length;
                  const attendedTrainings = attendances.filter(a => a.playerId === selectedPlayer.id && a.isPresent).length;
                  const missedTrainings = totalTrainings - attendedTrainings;
                  
                  if (totalTrainings === 0) {
                    return <div className="text-gray-500 py-10">Brak zaplanowanych treningów</div>;
                  }

                  const pieData = [
                    { name: 'Obecny', value: attendedTrainings },
                    { name: 'Nieobecny', value: missedTrainings }
                  ];
                  const COLORS = ['#10b981', '#ef4444'];

                  return (
                    <>
                      <div className="w-full h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={70}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                              itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-2xl font-bold text-white">
                          {Math.round((attendedTrainings / totalTrainings) * 100)}%
                        </p>
                        <p className="text-sm text-gray-400">Obecności ({attendedTrainings}/{totalTrainings})</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Development Line Chart */}
              <div className="bg-gray-950 border border-gray-800/50 rounded-xl p-4 lg:col-span-2">
                <h4 className="text-lg font-semibold text-white mb-4">Wykres rozwoju (Oceny z treningów)</h4>
                {(() => {
                  const playerReports = reports.filter(r => r.attendances.some(a => a.playerId === selectedPlayer.id && a.isPresent && a.performanceSliders));
                  
                  if (playerReports.length === 0) {
                    return <div className="text-gray-500 py-20 text-center flex-1">Brak ocen z treningów dla tego zawodnika.</div>;
                  }

                  const chartData = playerReports.map(r => {
                    const att = r.attendances.find(a => a.playerId === selectedPlayer.id);
                    const sliders = att!.performanceSliders!;
                    return {
                      date: r.date.substring(5), // MM-DD
                      Zaangażowanie: sliders.engagement,
                      Taktyka: sliders.tactics,
                      Technika: sliders.technique,
                      Średnia: parseFloat(((sliders.engagement + sliders.tactics + sliders.technique) / 3).toFixed(1))
                    };
                  }).sort((a, b) => a.date.localeCompare(b.date));

                  return (
                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickMargin={10} />
                          <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 10]} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '0.5rem' }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '10px' }} />
                          <Line type="monotone" dataKey="Zaangażowanie" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="Taktyka" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="Technika" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="Średnia" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })()}
              </div>

              {/* Messaging Section (if enabled) */}
              {settings?.enableParentModule && (
                <div className="bg-gray-950 border border-gray-800/50 rounded-xl p-4 lg:col-span-3">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    <h4 className="text-lg font-semibold text-white">Wiadomość do rodzica / zawodnika</h4>
                  </div>
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={messageContent}
                      onChange={e => setMessageContent(e.target.value)}
                      placeholder="Napisz wiadomość..."
                      className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!messageContent.trim()}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-800 disabled:text-gray-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Wyślij
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

