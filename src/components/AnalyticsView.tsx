import React from 'react';
import { BarChart3 } from 'lucide-react';

export function AnalyticsView() {
  return (
    <div className="p-8 h-full overflow-y-auto flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-xl">
        <BarChart3 className="w-12 h-12 text-emerald-500" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">Statystyki Zespołu</h2>
      <p className="text-gray-400 max-w-md">
        Moduł analityczny jest w trakcie budowy. Wkrótce znajdziesz tutaj zaawansowane wykresy formy, analizę xG oraz raporty meczowe.
      </p>
    </div>
  );
}
