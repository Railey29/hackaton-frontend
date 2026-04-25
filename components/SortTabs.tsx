import React from 'react';

const TABS = ['Latest', 'Trending', 'Supported'];

export function SortTabs() {
  return (
    <div className="flex items-center gap-6 border-b border-stone-200 pb-px mb-6">
      {TABS.map((tab, idx) => {
        const isActive = idx === 0; // Defaulting first tab as active for MVP
        return (
          <button
            key={tab}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              isActive
                ? 'border-sage-500 text-sage-700'
                : 'border-transparent text-stone-400 hover:text-stone-600'
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
