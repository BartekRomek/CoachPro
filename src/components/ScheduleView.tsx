import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Plus, Edit2, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useAppStore, useCoachData } from '../store';
import { AppEvent } from '../types';
import { cn } from '../lib/utils';

export function ScheduleView() {
  const { events } = useCoachData();
  const { addEvent, updateEvent, deleteEvent } = useAppStore();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    type: 'Trening' as 'Trening' | 'Mecz' | 'Odprawa',
    location: ''
  });

  const openAddModal = (initialDate?: string) => {
    setEditingEvent(null);
    setIsConfirmingDelete(false);
    setFormData({ title: '', date: initialDate || '', time: '', type: 'Trening', location: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (event: AppEvent) => {
    setEditingEvent(event);
    setIsConfirmingDelete(false);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type as 'Trening' | 'Mecz' | 'Odprawa',
      location: event.location
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
    } else {
      addEvent(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (editingEvent) {
      deleteEvent(editingEvent.id);
      setIsModalOpen(false);
      setIsConfirmingDelete(false);
    }
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startingDay = (firstDayOfMonth + 6) % 7; // Monday = 0, Sunday = 6

  const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
  const dayNames = ['Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob', 'Nie'];

  return (
    <div className="p-8 h-full overflow-y-auto relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Terminarz</h2>
          <p className="text-gray-400">Zarządzaj wydarzeniami w kalendarzu</p>
        </div>
        <button 
          onClick={() => openAddModal()}
          className="bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Dodaj wydarzenie
        </button>
      </div>
      
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl flex flex-col mb-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-emerald-500" />
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 font-medium transition-colors text-sm">
              Dzisiaj
            </button>
            <button onClick={nextMonth} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 bg-gray-800 gap-[1px]">
          {dayNames.map(day => (
            <div key={day} className="bg-gray-900 p-3 text-center text-sm font-semibold text-gray-400">
              {day}
            </div>
          ))}

          {Array.from({ length: startingDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-950/50 min-h-[120px] p-2"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === cellDateStr);
            
            // Get today's date string in local timezone
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const isToday = cellDateStr === todayStr;

            return (
              <div
                key={day}
                onClick={() => openAddModal(cellDateStr)}
                className={cn(
                  "bg-gray-950 min-h-[120px] p-2 flex flex-col gap-1 cursor-pointer hover:bg-gray-900 transition-colors group",
                  isToday ? "bg-emerald-900/10" : ""
                )}
              >
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                    isToday ? "bg-emerald-500 text-gray-950" : "text-gray-400 group-hover:text-gray-200"
                  )}>
                    {day}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  {dayEvents.map(e => (
                    <div
                      key={e.id}
                      onClick={(ev) => { ev.stopPropagation(); openEditModal(e); }}
                      className={cn(
                        "text-xs px-2 py-1.5 rounded-md truncate transition-colors border",
                        e.type === 'Mecz' ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20" :
                        e.type === 'Trening' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" :
                        "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                      )}
                      title={`${e.time} - ${e.title}`}
                    >
                      <span className="font-semibold mr-1">{e.time}</span>
                      {e.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingEvent ? 'Edytuj wydarzenie' : 'Dodaj wydarzenie'}
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
                <label className="block text-sm font-medium text-gray-400 mb-1">Tytuł</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Typ</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="Trening">Trening</option>
                  <option value="Mecz">Mecz</option>
                  <option value="Odprawa">Odprawa</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Data</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Godzina</label>
                  <input 
                    type="time" 
                    required
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Lokalizacja</label>
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="pt-4">
                {isConfirmingDelete ? (
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={handleDelete}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      Potwierdź usunięcie
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsConfirmingDelete(false)}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      Anuluj
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    {editingEvent && (
                      <button 
                        type="button"
                        onClick={() => setIsConfirmingDelete(true)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
                        title="Usuń wydarzenie"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold py-3 rounded-xl transition-colors"
                    >
                      {editingEvent ? 'Zapisz zmiany' : 'Dodaj wydarzenie'}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
