import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConfigStore } from '../../store/useConfigStore';
import { Metadata, metadataSchema } from '../../types/config';
import { InputField } from '../ui/FormField';
import { Clock } from 'lucide-react';

export default function MetadataTab() {
  const { getSelectedCompany, updateCompany, theme } = useConfigStore();
  const selected = getSelectedCompany();
  const d = theme === 'dark';

  const { register, watch, formState: { errors }, reset } = useForm<Metadata>({
    resolver: zodResolver(metadataSchema),
    defaultValues: selected?.metadata,
    mode: 'onChange',
  });

  useEffect(() => {
    if (selected) reset(selected.metadata);
  }, [selected?.company.id]);

  const values = watch();
  useEffect(() => {
    if (selected) {
      updateCompany(selected.company.id, 'metadata', values);
    }
  }, [JSON.stringify(values)]);

  if (!selected) return null;

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>Metadata</h2>
        <p className={`text-sm mt-1 ${d ? 'text-gray-500' : 'text-gray-500'}`}>
          Version information and timestamps.
        </p>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>Version</h3>
        <InputField label="Version" error={errors.version?.message} {...register('version')} placeholder="1.0.0" hint="Semantic version (e.g., 1.0.0)" />
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5 mt-4`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>Timestamps</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={`block text-xs font-medium ${d ? 'text-gray-400' : 'text-gray-600'}`}>Created At</label>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${d ? 'bg-[#1a1a1a] border border-[#2c2c2c] text-gray-300' : 'bg-gray-50 border border-gray-200 text-gray-600'}`}>
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{formatDate(values.createdAt)}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={`block text-xs font-medium ${d ? 'text-gray-400' : 'text-gray-600'}`}>Updated At</label>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${d ? 'bg-[#1a1a1a] border border-[#2c2c2c] text-gray-300' : 'bg-gray-50 border border-gray-200 text-gray-600'}`}>
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{formatDate(values.updatedAt)}</span>
            </div>
          </div>
        </div>
        <p className={`text-xs ${d ? 'text-gray-600' : 'text-gray-400'}`}>
          Timestamps are automatically updated when you modify the configuration.
        </p>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 mt-4`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>Status</h3>
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${selected.active ? 'bg-brand-success' : 'bg-gray-500'}`} />
          <span className={`text-sm font-medium ${d ? 'text-gray-200' : 'text-gray-700'}`}>
            {selected.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
}
