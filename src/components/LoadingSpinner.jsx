export default function LoadingSpinner({ size = "md", className = "", fullPage = false }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
    xl: "h-16 w-16 border-4",
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-campus-200 border-t-campus-600 ${sizeClasses[size] ?? sizeClasses.md} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
