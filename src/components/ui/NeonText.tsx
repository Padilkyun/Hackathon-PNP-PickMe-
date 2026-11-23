import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface NeonTextProps extends HTMLAttributes<HTMLSpanElement> {
  color?: 'white' | 'purple';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function NeonText({
  className,
  color = 'white',
  size = 'md',
  children,
  ...props
}: NeonTextProps) {
  const colorStyles = {
    white: 'text-slate-50',
    purple: 'text-slate-50',
  };

  const sizeStyles = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
    '2xl': 'text-5xl',
  };

  return (
    <span className={cn('font-bold', colorStyles[color], sizeStyles[size], className)} {...props}>
      {children}
    </span>
  );
}
