import * as React from 'react';
import { cn } from '@/lib/utils/cn';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  label: string;
};

export function ToolbarButton({ active, className, label, ...props }: Props) {
  return (
    <button
      aria-label={label}
      className={cn(
        'px-2 py-1 rounded text-sm border',
        active ? 'bg-gray-200 border-gray-300' : 'bg-white hover:bg-gray-50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  );
}


