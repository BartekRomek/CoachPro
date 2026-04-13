import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Player } from '../types';
import { Flame, Plus as CrossIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppStore } from '../store';

interface DraggablePlayerProps {
  player: Player;
  inForm: boolean;
}

export function DraggablePlayer({ player, inForm }: DraggablePlayerProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.id,
    data: { player }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "relative flex flex-col items-center justify-center p-2 rounded-xl cursor-grab active:cursor-grabbing transition-all bg-gray-900 border-2 w-24",
        isDragging ? "opacity-80 scale-105 shadow-2xl" : "hover:scale-105 shadow-md",
        inForm && !player.isInjured ? "border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]" : "border-gray-800",
        player.isInjured ? "opacity-50 grayscale" : ""
      )}
    >
      {inForm && !player.isInjured && (
        <div className="absolute -top-2 -right-2 bg-gray-950 rounded-full p-1 border border-orange-500/30">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
        </div>
      )}

      {player.isInjured && (
        <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
          <CrossIcon className="w-4 h-4 text-white" />
        </div>
      )}

      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-300 mb-2">
        {player.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="text-xs font-bold text-gray-200 text-center truncate w-full">{player.name.split(' ').pop()}</div>
      <div className="text-[10px] text-gray-500 font-medium">{player.position}</div>
    </div>
  );
}

