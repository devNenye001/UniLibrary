import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

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
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

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
        <div className="relative">
          <input
            className={`${INPUT_CLASS} ${isPassword ? "pr-12" : ""}`}
            id={fieldId}
            name={name}
            type={actualType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition focus:outline-none"
            >
              {showPassword ? (
                <IoEyeOffOutline className="text-xl" />
              ) : (
                <IoEyeOutline className="text-xl" />
              )}
            </button>
          )}
        </div>
      )}

      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
