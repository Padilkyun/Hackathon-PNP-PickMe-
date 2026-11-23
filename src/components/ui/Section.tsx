import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  background?: 'primary' | 'secondary' | 'gradient' | 'transparent';
}

export function Section({
  className,
  containerSize = 'lg',
  background = 'primary',
  children,
  ...props
}: SectionProps) {
  const containers = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-none',
  };

  const backgrounds = {
    primary: 'bg-slate-900',
    secondary: 'bg-slate-800',
    gradient:
      'bg-slate-950',
    transparent: 'bg-transparent',
  };

  return (
    <section
      className={cn('w-full py-16 px-4 sm:px-6 lg:px-8', backgrounds[background], className)}
      {...props}
    >
      <div className={cn('mx-auto w-full', containers[containerSize])}>{children}</div>
    </section>
  );
}
