import React from 'react';
import { useAppStore, useCoachData } from '../store';
import { FileText, Calendar, Users, Activity } from 'lucide-react';

export function ReportsView() {
  const { reports, players } = useCoachData();

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Raporty Treningowe</h2>
        <p className="text-gray-400">Przeglądaj zapisane raporty z odbytych treningów</p>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <FileText className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg">Brak zapisanych raportów.</p>
          <p className="text-sm mt-2">Przejdź do modułu treningu i zapisz pierwszy raport.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {reports.map(report => {
            const presentCount = report.attendances.filter(a => a.isPresent).length;
            const totalScore = report.attendances.reduce((acc, curr) => {
              if (curr.isPresent && curr.performanceSliders) {
                return acc + curr.performanceSliders.engagement + curr.performanceSliders.tactics + curr.performanceSliders.technique;
              }
              return acc;
            }, 0);
            
            const scoredPlayersCount = report.attendances.filter(a => a.isPresent && a.performanceSliders).length;
            const avgScore = scoredPlayersCount > 0 ? (totalScore / (scoredPlayersCount * 3)).toFixed(1) : '-';

            return (
              <div key={report.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{report.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {report.date}
                    </div>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-sm font-bold">
                    Śr. ocena: {avgScore}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-950 rounded-xl p-4 border border-gray-800/50">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Obecność</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {presentCount} <span className="text-sm text-gray-500 font-normal">/ {players.length}</span>
                    </div>
                  </div>
                  <div className="bg-gray-950 rounded-xl p-4 border border-gray-800/50">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Activity className="w-4 h-4" />
                      <span className="text-sm">Ocenionych</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {scoredPlayersCount}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4">
                  <p className="text-xs text-gray-500">
                    Zapisano: {new Date(report.createdAt).toLocaleString('pl-PL')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
