import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConfigStore } from '../../store/useConfigStore';
import { Session, sessionSchema } from '../../types/config';
import { NumberField } from '../ui/FormField';

export default function SessionTab() {
  const { getSelectedCompany, updateCompany, theme } = useConfigStore();
  const selected = getSelectedCompany();
  const d = theme === 'dark';

  const { control, watch, formState: { errors }, reset } = useForm<Session>({
    resolver: zodResolver(sessionSchema),
    defaultValues: selected?.session,
    mode: 'onChange',
  });

  useEffect(() => {
    if (selected) reset(selected.session);
  }, [selected?.company.id]);

  const values = watch();
  useEffect(() => {
    if (selected) {
      updateCompany(selected.company.id, 'session', values);
    }
  }, [JSON.stringify(values)]);

  if (!selected) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>Session Settings</h2>
        <p className={`text-sm mt-1 ${d ? 'text-gray-500' : 'text-gray-500'}`}>
          Configure idle timeout and warning thresholds.
        </p>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>Idle Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <Controller name="idleTimeoutSeconds" control={control} render={({ field }) => (
            <NumberField label="Idle Timeout (seconds)" value={field.value} onChange={field.onChange} min={0} max={3600} error={errors.idleTimeoutSeconds?.message} />
          )} />
          <Controller name="idleWarningSeconds" control={control} render={({ field }) => (
            <NumberField label="Idle Warning (seconds)" value={field.value} onChange={field.onChange} min={0} max={3600} error={errors.idleWarningSeconds?.message} />
          )} />
        </div>
      </div>
    </div>
  );
}
