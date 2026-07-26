import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/utils';

interface LoadingProps {
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export default function Loading({ text = 'Loading...', className, fullScreen = false }: LoadingProps) {
  const containerClasses = cn(
    "flex flex-col items-center justify-center space-y-4",
    fullScreen ? "fixed inset-0 z-50 bg-midnight-900/80 backdrop-blur-sm" : "w-full p-12",
    className
  );

  return (
    <div className={containerClasses}>
      <Loader2 className="w-10 h-10 text-accent-cyan animate-spin" />
      <p className="text-slate-300 font-medium animate-pulse">{text}</p>
    </div>
  );
}
