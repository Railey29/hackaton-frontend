import React from 'react';
import { FlairType } from '@/lib/rants';

const FLAIR_STYLES: Record<FlairType, string> = {
  Anxiety: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  Burnout: 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100',
  Grief: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
  Loneliness: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
  'Just venting': 'bg-sage-50 text-sage-800 border-sage-200 hover:bg-sage-100',
  'Feeling lost': 'bg-pink-50 text-pink-800 border-pink-200 hover:bg-pink-100',
};

type FlairPillProps = {
  flair: FlairType;
  selected?: boolean;
  onClick?: () => void;
};

export function FlairPill({ flair, selected, onClick }: FlairPillProps) {
  const baseStyle = FLAIR_STYLES[flair] || FLAIR_STYLES['Just venting'];
  
  // If selected, we override some styles to make it appear active
  const activeStyle = selected ? 'ring-2 ring-sage-400 ring-offset-1' : '';

  return (
    <button
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors ${baseStyle} ${activeStyle} ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      role={onClick ? 'radio' : undefined}
      aria-checked={selected}
    >
      {flair}
    </button>
  );
}
