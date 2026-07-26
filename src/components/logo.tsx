
import { Video } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 font-bold text-primary", className)}>
      <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
        <Video className="h-5 w-5 text-white" />
      </div>
      <span className="text-xl font-black uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors">
        EyeMeet <span className="text-primary italic">AI</span>
      </span>
    </div>
  );
}
