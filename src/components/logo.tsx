import { Eye } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-bold text-primary ${className}`}>
      <Eye className="h-6 w-6" />
      <span className="text-xl font-headline font-semibold text-foreground">OptiCare AI</span>
    </div>
  );
}
