'use client';

import { Orbit } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 font-bold", className)}>
      <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
        <Orbit className="h-5 w-5 text-primary animate-pulse" />
      </div>
      <span className="text-2xl font-black tracking-tighter text-white">
        OMNI<span className="text-primary">MEET</span>
      </span>
    </div>
  );
}