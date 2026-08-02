import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, icon, trailing, id, className = '', ...rest }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-sm font-medium text-ink-700">
          {label}
        </label>
        <div
          className={`flex items-center gap-2 rounded-lg border bg-white px-3.5 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-sage/30 ${
            error ? 'border-red-400' : 'border-ink-100 focus-within:border-sage'
          }`}
        >
          {icon && <span className="text-ink-400">{icon}</span>}
          <input
            ref={ref}
            id={fieldId}
            className={`w-full bg-transparent text-[15px] text-ink-700 placeholder:text-ink-400 outline-none ${className}`}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            {...rest}
          />
          {trailing}
        </div>
        {error && (
          <p id={`${fieldId}-error`} className="text-xs font-medium text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
