import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '../lib/utils';
import { Player } from '../types';
import { DraggablePlayer } from './DraggablePlayer';

interface DroppableSlotProps {
  id: string;
  label: string;
  player: Player | null;
  inForm: boolean;
}

export function DroppableSlot({ id, label, player, inForm }: DroppableSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-28 h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all",
        isOver ? "border-emerald-400 bg-emerald-500/10 scale-105" : "border-white/20 bg-black/20",
        player ? "border-solid border-transparent bg-transparent" : ""
      )}
    >
      {player ? (
        <DraggablePlayer player={player} inForm={inForm} />
      ) : (
        <span className="text-white/40 font-bold text-sm">{label}</span>
      )}
    </div>
  );
}
