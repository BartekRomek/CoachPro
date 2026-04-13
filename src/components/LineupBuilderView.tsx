import React from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, TouchSensor, useDroppable } from '@dnd-kit/core';
import { useAppStore, useCoachData } from '../store';
import { DroppableSlot } from './DroppableSlot';
import { DraggablePlayer } from './DraggablePlayer';
import { Flame, Copy } from 'lucide-react';
import { cn } from '../lib/utils';

const FORMATION_433 = [
  { id: 'lw', label: 'LW', row: 0 },
  { id: 'st', label: 'ST', row: 0 },
  { id: 'rw', label: 'RW', row: 0 },
  { id: 'cm1', label: 'CM', row: 1 },
  { id: 'cam', label: 'CAM', row: 1 },
  { id: 'cm2', label: 'CM', row: 1 },
  { id: 'lb', label: 'LB', row: 2 },
  { id: 'cb1', label: 'CB', row: 2 },
  { id: 'cb2', label: 'CB', row: 2 },
  { id: 'rb', label: 'RB', row: 2 },
  { id: 'gk', label: 'GK', row: 3 },
];

function BenchArea({ benchedPlayers, isPlayerInForm }: { benchedPlayers: any[], isPlayerInForm: (id: string) => boolean }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'bench',
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex-1 overflow-y-auto p-4 transition-colors",
        isOver ? "bg-gray-800/50" : ""
      )}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
        {benchedPlayers.map(player => {
          const inForm = isPlayerInForm(player.id);
          return (
            <DraggablePlayer key={player.id} player={player} inForm={inForm} />
          );
        })}
        {benchedPlayers.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 text-sm">
            Wszyscy zawodnicy są na boisku.
          </div>
        )}
      </div>
    </div>
  );
}

export function LineupBuilderView() {
  const { players, events, activeEventId } = useCoachData();
  const { setEventLineupSlot, copyPreviousLineup, isPlayerInForm } = useAppStore();

  const activeEvent = events.find(e => e.id === activeEventId) || events.find(e => e.type === 'Mecz');
  const lineup = activeEvent?.lineup || {};

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id && activeEvent) {
      const playerId = active.id as string;
      const slotId = over.id as string;
      
      if (slotId === 'bench') {
        setEventLineupSlot(activeEvent.id, '', playerId); // Passing empty slotId clears the player from lineup
      } else {
        setEventLineupSlot(activeEvent.id, slotId, playerId);
      }
    }
  };

  const benchedPlayers = players.filter(p => !Object.values(lineup).includes(p.id));

  if (!activeEvent) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-gray-500 text-center">
        Wybierz mecz ze strony głównej lub terminarza, aby ustalić skład.
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden">
        
        {/* Pitch Area */}
        <div className="flex-1 p-4 md:p-8 lg:overflow-y-auto bg-gray-950 flex flex-col items-center">
          <div className="w-full max-w-4xl mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Taktyka & Skład</h2>
              <p className="text-gray-400">Mecz: <span className="text-red-400 font-medium">{activeEvent.title}</span> ({activeEvent.date})</p>
            </div>
            <button 
              onClick={() => copyPreviousLineup(activeEvent.id)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-gray-700 text-sm sm:text-base"
            >
              <Copy className="w-4 h-4" /> Użyj składu z poprzedniego meczu
            </button>
          </div>

          <div className="relative w-full max-w-3xl aspect-[1/1.4] sm:aspect-[1/1.2] bg-emerald-800 rounded-3xl border-4 border-emerald-600/50 overflow-hidden shadow-2xl flex flex-col justify-around py-4 sm:py-8">
            {/* Pitch markings */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/4 border-b-2 border-x-2 border-white rounded-b-lg"></div>
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-1/4 h-1/6 border-b-2 border-x-2 border-white rounded-b-lg"></div>
              <div className="absolute top-1/2 left-0 w-full border-t-2 border-white"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/4 border-t-2 border-x-2 border-white rounded-t-lg"></div>
            </div>

            {/* Rows */}
            {[0, 1, 2, 3].map(rowIdx => (
              <div key={rowIdx} className="flex justify-center gap-2 sm:gap-12 z-10">
                {FORMATION_433.filter(slot => slot.row === rowIdx).map(slot => {
                  const playerId = lineup[slot.id];
                  const player = playerId ? players.find(p => p.id === playerId) || null : null;
                  return (
                    <DroppableSlot 
                      key={slot.id} 
                      id={slot.id} 
                      label={slot.label} 
                      player={player} 
                      inForm={player ? isPlayerInForm(player.id) : false}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Bench Area */}
        <div className="w-full lg:w-80 bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-800 flex flex-col min-h-[300px] lg:min-h-0">
          <div className="p-4 md:p-6 border-b border-gray-800">
            <h3 className="text-xl font-bold text-white">Ławka Rezerwowych</h3>
            <p className="text-sm text-gray-400 mt-1">Dostępni zawodnicy (przeciągnij na boisko)</p>
          </div>
          
          <BenchArea benchedPlayers={benchedPlayers} isPlayerInForm={isPlayerInForm} />
        </div>

      </div>
    </DndContext>
  );
}

