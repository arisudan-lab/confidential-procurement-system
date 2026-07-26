import type { ReactNode } from 'react';
import { FileQuestion } from 'lucide-react';
import { cn } from '../../utils/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-12 bg-midnight-800/30 rounded-2xl border border-midnight-700/50 border-dashed", className)}>
      <div className="w-16 h-16 mb-4 rounded-full bg-midnight-800 flex items-center justify-center text-slate-400">
        {icon || <FileQuestion className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
