import { useConfigStore } from '../../store/useConfigStore';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  error?: string;
}

export default function ColorPicker({ label, value, onChange, error }: ColorPickerProps) {
  const theme = useConfigStore((s) => s.theme);
  const d = theme === 'dark';

  return (
    <div className="space-y-1.5">
      <label className={`block text-xs font-medium ${d ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value.startsWith('#') ? value : '#000000'}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className={`w-9 h-9 rounded-lg border-2 ${d ? 'border-gray-600' : 'border-gray-300'} cursor-pointer transition-transform hover:scale-105`}
            style={{ backgroundColor: value }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`input-base ${d ? 'input-dark' : 'input-light'} flex-1 font-mono text-xs ${error ? 'ring-2 ring-brand-error/50 border-brand-error' : ''}`}
          placeholder="#000000"
        />
      </div>
      {error && <p className="text-xs text-brand-error">{error}</p>}
    </div>
  );
}
