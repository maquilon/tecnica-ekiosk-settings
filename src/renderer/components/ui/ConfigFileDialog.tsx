import { FileQuestion } from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';

interface ConfigFileDialogProps {
  open: boolean;
  onFileSelect: () => void;
  onCancel: () => void;
}

export default function ConfigFileDialog({ open, onFileSelect, onCancel }: ConfigFileDialogProps) {
  const theme = useConfigStore((s) => s.theme);
  const d = theme === 'dark';

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div
        className={`relative w-full max-w-md mx-4 rounded-xl p-6 shadow-2xl animate-slide-up ${
          d ? 'bg-[#1a1a1a] border border-[#2c2c2c]' : 'bg-white border border-gray-200'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-brand-warning/10">
            <FileQuestion className="w-5 h-5 text-brand-warning" />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>
              Config File Not Found
            </h3>
            <p className={`mt-2 text-sm ${d ? 'text-gray-400' : 'text-gray-600'}`}>
              The configuration file could not be found at the expected location. Please select the
              tecnicaSystemsKioskSettings.json file.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className={`btn ${d ? 'btn-secondary btn-secondary-dark' : 'btn-secondary btn-secondary-light'}`}
          >
            Cancel
          </button>
          <button onClick={onFileSelect} className="btn btn-primary">
            Select Config File
          </button>
        </div>
      </div>
    </div>
  );
}
