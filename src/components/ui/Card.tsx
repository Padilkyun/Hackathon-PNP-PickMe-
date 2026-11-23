import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'neon';
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverable = false, children, ...props }, ref) => {
    const baseStyles =
      'rounded-2xl border transition-all duration-300';

    const variants = {
      default:
        'bg-slate-900/70 border-slate-800/30',
      glass:
        'bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-slate-800/40',
      neon:
        'bg-slate-900 border-slate-800/50',
    };

    const hoverStyles = hoverable
      ? 'hover:border-slate-700/60 cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';