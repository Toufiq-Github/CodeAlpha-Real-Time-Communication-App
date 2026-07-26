
'use client';

import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 font-bold", className)}>
      <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/30">
        <Layers className="h-5 w-5 text-white" />
      </div>
      <span className="text-xl font-black tracking-tight text-white">
        Omni<span className="text-primary">Meet</span>
      </span>
    </div>
  );
}
