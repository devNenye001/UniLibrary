export default function AuthLayout({
  heading,
  eyebrow = "UniLibrary",
  description,
  features,
  children,
  variant = "centered",
  maxWidth = "max-w-5xl",
  gridCols = "md:grid-cols-[1.1fr_0.9fr]",
}) {
  if (variant === "scrollable") {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef4fb_100%)] px-6 py-10">
        <div className={`mx-auto grid ${maxWidth} gap-8 ${gridCols}`}>
          <LeftPanel
            eyebrow={eyebrow}
            heading={heading}
            description={description}
            features={features}
            scrollable
          />
          <section className="rounded-[2rem] border border-slate-200 bg-white px-8 py-10 shadow-[0_20px_50px_rgba(15,23,42,0.08)] md:px-10">
            {children}
          </section>
        </div>
      </div>
    );
  }

  // centered variant — Login, ForgotPassword
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#edf2f7_45%,#dbe8f4_100%)] px-6 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(35,72,118,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,116,144,0.12),transparent_30%)]" />
      <div
        className={`relative grid w-full ${maxWidth} gap-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur ${gridCols}`}
      >
        <LeftPanel
          eyebrow={eyebrow}
          heading={heading}
          description={description}
          features={features}
        />
        <section className="px-8 py-12 md:px-10">{children}</section>
      </div>
    </div>
  );
}

function LeftPanel({ eyebrow, heading, description, features, scrollable }) {
  return (
    <section
      className={`bg-campus-900 px-8 py-12 text-white md:px-10 ${
        scrollable ? "rounded-[2rem] shadow-[0_30px_80px_rgba(15,23,42,0.16)]" : ""
      }`}
    >
      <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
        {eyebrow}
      </p>
      <h1 className="max-w-md text-4xl font-semibold leading-tight">{heading}</h1>
      {description ? (
        <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">{description}</p>
      ) : null}
      {features?.length ? (
        <div className="mt-10 space-y-4">
          {features.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-100"
            >
              {item}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
