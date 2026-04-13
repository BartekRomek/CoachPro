import React, { useState } from 'react';
import { useAppStore, useCoachData } from '../store';
import { CheckCircle2, Circle, Flame, ChevronRight, Save } from 'lucide-react';
import { cn } from '../lib/utils';

export function TrainingView() {
  const { players, events, activeEventId, attendances, reports } = useCoachData();
  const { toggleAttendance, updatePerformance, isPlayerInForm, saveTrainingReport } = useAppStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isEditingReport, setIsEditingReport] = useState(false);
  
  const activeTraining = events.find(e => e.id === activeEventId) || events.find(e => e.type === 'Trening');

  const existingReport = activeTraining ? reports.find(r => r.eventId === activeTraining.id) : undefined;
  const isLocked = existingReport && !isEditingReport && step !== 3;

  const handleSaveReport = () => {
    if (activeTraining) {
      saveTrainingReport(activeTraining.id);
      setIsEditingReport(false);
      setStep(3);
    }
  };

  if (!activeTraining) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-gray-500">
        Brak zaplanowanych treningów.
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Save className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Raport zapisany</h3>
          <p className="text-gray-400 mb-8">
            Raport dla tego treningu ({activeTraining.date}) został już zapisany. 
            Możesz go edytować, ale nadpisze to poprzednie dane.
          </p>
          <button 
            onClick={() => setIsEditingReport(true)}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-xl transition-colors border border-gray-700"
          >
            Odblokuj i edytuj dane
          </button>
        </div>
      </div>
    );
  }

  const handleSliderChange = (playerId: string, field: 'engagement' | 'tactics' | 'technique', value: number) => {
    const attendance = attendances.find(a => a.trainingId === activeTraining.id && a.playerId === playerId);
    if (attendance) {
      const currentSliders = attendance.performanceSliders || { engagement: 5, tactics: 5, technique: 5 };
      updatePerformance(activeTraining.id, playerId, {
        ...currentSliders,
        [field]: value
      });
    }
  };

  const presentPlayers = players.filter(p => {
    const att = attendances.find(a => a.trainingId === activeTraining.id && a.playerId === p.id);
    return att?.isPresent;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Moduł Treningu</h2>
        <p className="text-gray-400">
          Aktywny trening: <span className="text-emerald-400 font-medium">{activeTraining.date} - {activeTraining.title}</span>
        </p>
      </header>

      {/* Stepper */}
      <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
        <button 
          onClick={() => setStep(1)}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap",
            step === 1 ? "bg-emerald-500 text-gray-950" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          )}
        >
          1. Obecność
        </button>
        <ChevronRight className="w-5 h-5 text-gray-600 shrink-0" />
        <button 
          onClick={() => setStep(2)}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap",
            step === 2 ? "bg-emerald-500 text-gray-950" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          )}
        >
          2. Ocena Wydajności
        </button>
        <ChevronRight className="w-5 h-5 text-gray-600 shrink-0" />
        <button 
          onClick={() => step === 3 && setStep(3)}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-default",
            step === 3 ? "bg-emerald-500 text-gray-950" : "bg-gray-800/50 text-gray-500"
          )}
        >
          3. Podsumowanie
        </button>
      </div>

      {/* Step 1: Attendance */}
      {step === 1 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-950/50 border-b border-gray-800">
                  <th className="p-4 font-medium text-gray-400">Zawodnik</th>
                  <th className="p-4 font-medium text-gray-400">Pozycja</th>
                  <th className="p-4 font-medium text-gray-400 text-center">Status</th>
                  <th className="p-4 font-medium text-gray-400 text-right">Akcja</th>
                </tr>
              </thead>
              <tbody>
                {players.map(player => {
                  const att = attendances.find(a => a.trainingId === activeTraining.id && a.playerId === player.id);
                  const isPresent = att?.isPresent ?? false;
                  const inForm = isPlayerInForm(player.id);

                  return (
                    <tr key={player.id} className={cn("border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors", player.isInjured ? "opacity-50" : "")}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-300 shrink-0">
                            {player.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-200 flex items-center gap-2 flex-wrap">
                              {player.name}
                              {player.isInjured && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">Kontuzja</span>}
                              {inForm && !player.isInjured && <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">{player.position}</td>
                      <td className="p-4 text-center">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          isPresent ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        )}>
                          {isPresent ? 'Obecny' : 'Nieobecny'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggleAttendance(activeTraining.id, player.id)}
                          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          {isPresent ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-600" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 md:p-6 bg-gray-950/50 flex justify-end">
            <button 
              onClick={() => setStep(2)}
              className="flex items-center justify-center w-full md:w-auto gap-2 bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Zatwierdź obecność i przejdź do ocen
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Performance Sliders */}
      {step === 2 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {presentPlayers.map(player => {
            const att = attendances.find(a => a.trainingId === activeTraining.id && a.playerId === player.id);
            const sliders = att?.performanceSliders || { engagement: 5, tactics: 5, technique: 5 };
            
            return (
              <div key={player.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-800">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold text-gray-300">
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-100">{player.name}</h3>
                    <p className="text-sm text-gray-400">{player.position}</p>
                  </div>
                  <div className="ml-auto text-2xl font-black text-emerald-500/50">
                    {((sliders.engagement + sliders.tactics + sliders.technique) / 3).toFixed(1)}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Engagement Slider */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-300">Zaangażowanie</label>
                      <span className="text-sm font-bold text-emerald-400">{sliders.engagement}/10</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" max="10" 
                      value={sliders.engagement}
                      onChange={(e) => handleSliderChange(player.id, 'engagement', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Tactics Slider */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-300">Taktyka</label>
                      <span className="text-sm font-bold text-blue-400">{sliders.tactics}/10</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" max="10" 
                      value={sliders.tactics}
                      onChange={(e) => handleSliderChange(player.id, 'tactics', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Technique Slider */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-300">Technika</label>
                      <span className="text-sm font-bold text-purple-400">{sliders.technique}/10</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" max="10" 
                      value={sliders.technique}
                      onChange={(e) => handleSliderChange(player.id, 'technique', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                </div>
              </div>
            );
          })}
          
          {presentPlayers.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Brak obecnych zawodników na tym treningu.
            </div>
          )}

          <div className="col-span-full mt-6 flex justify-end">
            <button 
              onClick={handleSaveReport}
              className="flex items-center justify-center w-full md:w-auto gap-2 bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              <Save className="w-5 h-5" />
              Zapisz raport treningowy
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Success / Summary */}
      {step === 3 && (
        <div className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-8 shadow-xl text-center max-w-2xl mx-auto mt-12">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Raport zapisany pomyślnie!</h3>
          <p className="text-gray-400 mb-8">
            Oceny wydajności z dzisiejszego treningu zostały zapisane w bazie. 
            Wpłyną one na formę zawodników w nadchodzących meczach.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setStep(1)}
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Wróć do obecności
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

