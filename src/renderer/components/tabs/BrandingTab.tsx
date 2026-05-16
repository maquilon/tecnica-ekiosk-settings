import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConfigStore } from '../../store/useConfigStore';
import { Branding, brandingSchema } from '../../types/config';
import { InputField } from '../ui/FormField';
import ColorPicker from '../ui/ColorPicker';

export default function BrandingTab() {
  const { getSelectedCompany, updateCompany, theme } = useConfigStore();
  const selected = getSelectedCompany();
  const d = theme === 'dark';

  const { register, control, watch, formState: { errors }, reset } = useForm<Branding>({
    resolver: zodResolver(brandingSchema),
    defaultValues: selected?.branding,
    mode: 'onChange',
  });

  useEffect(() => {
    if (selected) reset(selected.branding);
  }, [selected?.company.id]);

  const values = watch();
  useEffect(() => {
    if (selected) {
      updateCompany(selected.company.id, 'branding', values);
    }
  }, [JSON.stringify(values)]);

  if (!selected) return null;

  const colorFields: { name: keyof Branding; label: string }[] = [
    { name: 'backgroundColor', label: 'Background' },
    { name: 'surfaceColor', label: 'Surface' },
    { name: 'primaryColor', label: 'Primary' },
    { name: 'secondaryColor', label: 'Secondary' },
    { name: 'accentColor', label: 'Accent' },
    { name: 'errorColor', label: 'Error' },
    { name: 'warningColor', label: 'Warning' },
    { name: 'successColor', label: 'Success' },
    { name: 'textPrimaryColor', label: 'Text Primary' },
    { name: 'textSecondaryColor', label: 'Text Secondary' },
    { name: 'labelTextColor', label: 'Label Text' },
    { name: 'borderColor', label: 'Border' },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>
          Branding & Colors
        </h2>
        <p className={`text-sm mt-1 ${d ? 'text-gray-500' : 'text-gray-500'}`}>
          Logo assets and color palette configuration.
        </p>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>
          Assets
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Logo URL" error={errors.logoUrl?.message} {...register('logoUrl')} placeholder="https://..." />
          <InputField label="Favicon URL" error={errors.faviconUrl?.message} {...register('faviconUrl')} placeholder="https://..." />
        </div>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5 mt-4`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>
          Color Palette
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {colorFields.map((field) => (
            <Controller
              key={field.name}
              name={field.name}
              control={control}
              render={({ field: f }) => (
                <ColorPicker
                  label={field.label}
                  value={f.value as string}
                  onChange={f.onChange}
                  error={errors[field.name]?.message}
                />
              )}
            />
          ))}
        </div>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5 mt-4`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>
          Shadow
        </h3>
        <InputField
          label="Shadow Color"
          error={errors.shadowColor?.message}
          {...register('shadowColor')}
          hint="CSS shadow color value, e.g. rgba(0,0,0,0.25)"
        />
      </div>
    </div>
  );
}
