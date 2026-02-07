import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-slate-600">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn('w-full bg-slate-100 rounded-full overflow-hidden', {
          'h-1.5': size === 'sm',
          'h-2.5': size === 'md',
          'h-4': size === 'lg',
        })}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', {
            'bg-indigo-600': color === 'primary',
            'bg-emerald-500': color === 'success',
            'bg-amber-500': color === 'warning',
            'bg-red-500': color === 'danger',
          })}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
