import { useConfigStore } from '../../store/useConfigStore';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const theme = useConfigStore((s) => s.theme);
  const d = theme === 'dark';

  if (!open) return null;

  const confirmClass =
    variant === 'danger'
      ? 'btn btn-danger'
      : variant === 'warning'
        ? 'btn bg-brand-warning text-black hover:bg-yellow-500'
        : 'btn btn-primary';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div
        className={`relative w-full max-w-md mx-4 rounded-xl p-6 shadow-2xl animate-slide-up ${
          d ? 'bg-[#1a1a1a] border border-[#2c2c2c]' : 'bg-white border border-gray-200'
        }`}
      >
        <div className="flex items-start gap-4">
          {variant !== 'default' && (
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                variant === 'danger' ? 'bg-brand-error/10' : 'bg-brand-warning/10'
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${variant === 'danger' ? 'text-brand-error' : 'text-brand-warning'}`}
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
            <p className={`mt-2 text-sm ${d ? 'text-gray-400' : 'text-gray-600'}`}>{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className={`btn ${d ? 'btn-secondary btn-secondary-dark' : 'btn-secondary btn-secondary-light'}`}
          >
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={confirmClass}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
