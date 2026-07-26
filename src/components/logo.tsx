'use client';

import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 font-bold", className)}>
      <div className="p-2 bg-primary rounded-lg shadow-[0_0_20px_rgba(var(--primary),0.4)]">
        <Shield className="h-5 w-5 text-white" />
      </div>
      <span className="text-xl font-black tracking-tighter text-white uppercase">
        OMNI<span className="text-primary">MEET</span>
      </span>
    </div>
  );
}