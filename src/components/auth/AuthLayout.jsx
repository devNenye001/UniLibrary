export default function AuthLayout({
  children,
  maxWidth = "max-w-md",
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6 py-10 selection:bg-campus-600/30">
      <div className="absolute inset-0 aurora-bg -z-10 opacity-60" />
      
      <div
        className={`relative w-full ${maxWidth} overflow-hidden rounded-[2.5rem] glass-card p-8 md:p-10 shadow-2xl backdrop-blur-xl bg-white/80`}
      >
        {children}
      </div>
    </div>
  );
}
