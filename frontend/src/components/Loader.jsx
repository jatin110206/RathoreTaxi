import { Loader2 } from 'lucide-react';

export function FullPageLoader({ message = 'Loading RathoreTaxi...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
        <div className="absolute w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-amber-400 font-bold text-xs">
          RT
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-gray-700 tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
}

export function InlineSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2 className={`animate-spin text-amber-500 ${sizeClasses[size]} ${className}`} />
  );
}

export function SkeletonCard({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded-md w-1/4" />
            <div className="h-4 bg-gray-200 rounded-full w-16" />
          </div>
          <div className="space-y-2.5">
            <div className="h-3 bg-gray-200 rounded-md w-3/4" />
            <div className="h-3 bg-gray-200 rounded-md w-1/2" />
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
            <div className="h-5 bg-gray-200 rounded-md w-20" />
            <div className="h-8 bg-gray-200 rounded-full w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default FullPageLoader;
