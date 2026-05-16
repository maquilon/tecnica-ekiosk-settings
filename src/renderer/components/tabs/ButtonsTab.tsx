import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConfigStore } from '../../store/useConfigStore';
import { Buttons, buttonsSchema } from '../../types/config';
import { NumberField } from '../ui/FormField';
import ColorPicker from '../ui/ColorPicker';

export default function ButtonsTab() {
  const { getSelectedCompany, updateCompany, theme } = useConfigStore();
  const selected = getSelectedCompany();
  const d = theme === 'dark';

  const { control, watch, formState: { errors }, reset } = useForm<Buttons>({
    resolver: zodResolver(buttonsSchema),
    defaultValues: selected?.buttons,
    mode: 'onChange',
  });

  useEffect(() => {
    if (selected) reset(selected.buttons);
  }, [selected?.company.id]);

  const values = watch();
  useEffect(() => {
    if (selected) {
      updateCompany(selected.company.id, 'buttons', values);
    }
  }, [JSON.stringify(values)]);

  if (!selected) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>
          Button Styles
        </h2>
        <p className={`text-sm mt-1 ${d ? 'text-gray-500' : 'text-gray-500'}`}>
          Configure primary and secondary button appearances.
        </p>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>
          Primary Button
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Controller name="primaryBackground" control={control} render={({ field }) => (
            <ColorPicker label="Background" value={field.value} onChange={field.onChange} error={errors.primaryBackground?.message} />
          )} />
          <Controller name="primaryTextColor" control={control} render={({ field }) => (
            <ColorPicker label="Text Color" value={field.value} onChange={field.onChange} error={errors.primaryTextColor?.message} />
          )} />
        </div>

        <div className={`mt-4 p-4 rounded-lg ${d ? 'bg-black/50' : 'bg-gray-50'}`}>
          <p className={`text-xs mb-2 ${d ? 'text-gray-500' : 'text-gray-400'}`}>Preview</p>
          <button
            className="px-6 py-2.5 font-medium rounded-lg transition-transform hover:scale-105"
            style={{
              backgroundColor: values.primaryBackground,
              color: values.primaryTextColor,
              borderRadius: `${values.borderRadius}px`,
              fontWeight: values.fontWeight,
            }}
          >
            Primary Button
          </button>
        </div>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5 mt-4`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>
          Secondary Button
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Controller name="secondaryBackground" control={control} render={({ field }) => (
            <ColorPicker label="Background" value={field.value} onChange={field.onChange} error={errors.secondaryBackground?.message} />
          )} />
          <Controller name="secondaryTextColor" control={control} render={({ field }) => (
            <ColorPicker label="Text Color" value={field.value} onChange={field.onChange} error={errors.secondaryTextColor?.message} />
          )} />
        </div>

        <div className={`mt-4 p-4 rounded-lg ${d ? 'bg-black/50' : 'bg-gray-50'}`}>
          <p className={`text-xs mb-2 ${d ? 'text-gray-500' : 'text-gray-400'}`}>Preview</p>
          <button
            className="px-6 py-2.5 font-medium rounded-lg border transition-transform hover:scale-105"
            style={{
              backgroundColor: values.secondaryBackground,
              color: values.secondaryTextColor,
              borderRadius: `${values.borderRadius}px`,
              fontWeight: values.fontWeight,
              borderColor: values.secondaryTextColor,
            }}
          >
            Secondary Button
          </button>
        </div>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5 mt-4`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>
          Shared Properties
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Controller name="borderRadius" control={control} render={({ field }) => (
            <NumberField label="Border Radius (px)" value={field.value} onChange={field.onChange} min={0} max={50} error={errors.borderRadius?.message} />
          )} />
          <Controller name="fontWeight" control={control} render={({ field }) => (
            <NumberField label="Font Weight" value={field.value} onChange={field.onChange} min={100} max={900} step={100} error={errors.fontWeight?.message} />
          )} />
        </div>
      </div>
    </div>
  );
}
