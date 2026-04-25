"use client";

import React from 'react';
import { Home, Clock } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { name: 'Feed', icon: Home, href: '/feed' },
  { name: 'Chat', icon: Clock, href: '/chat' },
];

export function LeftSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] hidden md:flex flex-col sticky top-0 h-screen overflow-y-auto pt-8 pb-8 pr-6">

      {/* Brand */}
      <div className="mb-10">
        <h1 className="font-lora text-2xl text-sage-800 font-semibold tracking-tight">SafeSpace</h1>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm ${
              pathname === item.href
                ? 'bg-sage-100 text-sage-700'
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
            }`}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </nav>

    </aside>
  );
}