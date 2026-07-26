'use client';

import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const containerSizes = {
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={cn("flex items-center gap-3 font-semibold group", className)}>
      <div className={cn(
        "bg-white rounded-xl shadow-lg transition-all duration-300",
        containerSizes[size]
      )}>
        <Shield className={cn("text-black", iconSizes[size])} />
      </div>
      <span className={cn("font-semibold tracking-tighter text-white uppercase not-italic", textSizes[size])}>
        TEAM<span className="opacity-60">SYNC</span>
      </span>
    </div>
  );
}