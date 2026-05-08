const INPUT_CLASS =
  "w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100";

export default function InputField({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  as: tag,
  children,
  required,
}) {
  const fieldId = id ?? name;

  return (
    <div>
      {label ? (
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={fieldId}>
          {label}
        </label>
      ) : null}

      {tag === "select" ? (
        <select
          className={INPUT_CLASS}
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          {children}
        </select>
      ) : (
        <input
          className={INPUT_CLASS}
          id={fieldId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}

      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
