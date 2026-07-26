'use client';

import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 font-bold group", className)}>
      <div className="p-2.5 bg-primary rounded-xl shadow-lg blue-glow group-hover:rotate-12 transition-all duration-300">
        <Shield className="h-6 w-6 text-white" />
      </div>
      <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
        TEAM<span className="text-primary not-italic">SYNC</span>
      </span>
    </div>
  );
}