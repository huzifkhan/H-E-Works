// Loading Skeleton Component
export const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Card Skeleton
export const CardSkeleton = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card p-6">
        <Skeleton className="h-12 w-12 rounded-xl mb-4" />
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ))}
  </>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    ))}
  </div>
);

// Stats Skeleton
export const StatsSkeleton = ({ count = 4 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-16 mb-1" />
        <Skeleton className="h-3 w-32" />
      </div>
    ))}
  </>
);

// Page Loader
export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

// Inline Loader
export const InlineLoader = ({ size = 'sm' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };
  
  return (
    <div className={`inline-block animate-spin rounded-full border-b-2 border-primary-600 ${sizes[size]}`} />
  );
};
