import { forwardRef, InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { useConfigStore } from '../../store/useConfigStore';

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  hint?: string;
}

export function FormField({ label, error, children, hint }: FormFieldProps) {
  const theme = useConfigStore((s) => s.theme);
  const d = theme === 'dark';
  return (
    <div className="space-y-1.5">
      <label className={`block text-xs font-medium ${d ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className={`text-xs ${d ? 'text-gray-600' : 'text-gray-400'}`}>{hint}</p>
      )}
      {error && <p className="text-xs text-brand-error">{error}</p>}
    </div>
  );
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    const theme = useConfigStore((s) => s.theme);
    const d = theme === 'dark';
    return (
      <FormField label={label} error={error} hint={hint}>
        <input
          ref={ref}
          className={`input-base ${d ? 'input-dark' : 'input-light'} ${error ? 'ring-2 ring-brand-error/50 border-brand-error' : ''} ${className || ''}`}
          {...props}
        />
      </FormField>
    );
  }
);
InputField.displayName = 'InputField';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  hint?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, hint, className, ...props }, ref) => {
    const theme = useConfigStore((s) => s.theme);
    const d = theme === 'dark';
    return (
      <FormField label={label} error={error} hint={hint}>
        <select
          ref={ref}
          className={`input-base ${d ? 'input-dark' : 'input-light'} ${error ? 'ring-2 ring-brand-error/50 border-brand-error' : ''} ${className || ''}`}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FormField>
    );
  }
);
SelectField.displayName = 'SelectField';

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}

export function ToggleField({ label, checked, onChange, hint }: ToggleFieldProps) {
  const theme = useConfigStore((s) => s.theme);
  const d = theme === 'dark';
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <span className={`text-sm font-medium ${d ? 'text-gray-200' : 'text-gray-700'}`}>
          {label}
        </span>
        {hint && (
          <p className={`text-xs mt-0.5 ${d ? 'text-gray-500' : 'text-gray-400'}`}>{hint}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 ${
          checked ? 'bg-brand-primary' : d ? 'bg-gray-700' : 'bg-gray-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  hint?: string;
}

export function NumberField({ label, value, onChange, min, max, step, error, hint }: NumberFieldProps) {
  const theme = useConfigStore((s) => s.theme);
  const d = theme === 'dark';
  return (
    <FormField label={label} error={error} hint={hint}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step || 1}
        className={`input-base ${d ? 'input-dark' : 'input-light'} ${error ? 'ring-2 ring-brand-error/50 border-brand-error' : ''}`}
      />
    </FormField>
  );
}
