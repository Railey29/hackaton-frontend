import React from 'react';
import { Home, Clock, Star, UserCircle2 } from 'lucide-react';

type LeftSidebarProps = {
  onShareRant: () => void;
};

const NAV_ITEMS = [
  { name: 'Feed', icon: Home, active: true },
  { name: 'Recent', icon: Clock, active: false },
  { name: 'Most Helpful', icon: Star, active: false },
  { name: 'My Rants', icon: UserCircle2, active: false },
];

export function LeftSidebar({ onShareRant }: LeftSidebarProps) {
  return (
    <aside className="w-[220px] hidden md:flex flex-col fixed h-screen overflow-y-auto pt-8 pb-8 pr-6">
      
      {/* Brand */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Antigravity AI</div>
          <div className="w-1.5 h-1.5 rounded-full bg-sage-400" />
        </div>
        <h1 className="font-lora text-2xl text-sage-800 font-semibold tracking-tight">SafeSpace</h1>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2 mb-10">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.name}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm ${
              item.active 
                ? 'bg-sage-100 text-sage-700' 
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
            }`}
          >
            <item.icon size={18} />
            {item.name}
          </button>
        ))}
      </nav>

      {/* Button */}
      <button 
        onClick={onShareRant}
        className="w-full bg-sage-500 hover:bg-sage-600 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-none text-sm"
      >
        + Share a rant
      </button>

    </aside>
  );
}
