import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConfigStore } from '../../store/useConfigStore';
import { Typography, typographySchema } from '../../types/config';
import { InputField, NumberField } from '../ui/FormField';

const FONT_OPTIONS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins',
  'Source Sans Pro', 'Nunito', 'Raleway', 'Ubuntu', 'Merriweather',
  'Playfair Display', 'PT Sans', 'Work Sans', 'DM Sans',
];

export default function TypographyTab() {
  const { getSelectedCompany, updateCompany, theme } = useConfigStore();
  const selected = getSelectedCompany();
  const d = theme === 'dark';

  const { register, control, watch, formState: { errors }, reset } = useForm<Typography>({
    resolver: zodResolver(typographySchema),
    defaultValues: selected?.typography,
    mode: 'onChange',
  });

  useEffect(() => {
    if (selected) reset(selected.typography);
  }, [selected?.company.id]);

  const values = watch();
  useEffect(() => {
    if (selected) {
      updateCompany(selected.company.id, 'typography', values);
    }
  }, [JSON.stringify(values)]);

  if (!selected) return null;

  const scaledSizes = {
    xs: Math.round(values.fontSizeBase * values.fontScale * 0.75),
    sm: Math.round(values.fontSizeBase * values.fontScale * 0.875),
    base: Math.round(values.fontSizeBase * values.fontScale),
    lg: Math.round(values.fontSizeBase * values.fontScale * 1.125),
    xl: Math.round(values.fontSizeBase * values.fontScale * 1.25),
    '2xl': Math.round(values.fontSizeBase * values.fontScale * 1.5),
    '3xl': Math.round(values.fontSizeBase * values.fontScale * 1.875),
  };

  return (
    <div className="p-6 max-w-3xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>Typography</h2>
        <p className={`text-sm mt-1 ${d ? 'text-gray-500' : 'text-gray-500'}`}>
          Font families, sizes, and scale configuration.
        </p>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>Font Families</h3>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Body Font Family" error={errors.fontFamily?.message} {...register('fontFamily')} list="font-options" />
          <InputField label="Heading Font Family" error={errors.headingFontFamily?.message} {...register('headingFontFamily')} list="font-options" />
        </div>
        <datalist id="font-options">
          {FONT_OPTIONS.map((f) => <option key={f} value={f} />)}
        </datalist>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5 mt-4`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>Size & Scale</h3>
        <div className="grid grid-cols-2 gap-4">
          <Controller name="fontSizeBase" control={control} render={({ field }) => (
            <NumberField label="Base Font Size (px)" value={field.value} onChange={field.onChange} min={10} max={32} error={errors.fontSizeBase?.message} />
          )} />
          <Controller name="fontScale" control={control} render={({ field }) => (
            <NumberField label="Font Scale" value={field.value} onChange={field.onChange} min={0.5} max={2.0} step={0.05} error={errors.fontScale?.message} hint="Multiplier for all font sizes" />
          )} />
        </div>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 mt-4`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>Preview</h3>
        <div className="space-y-3" style={{ fontFamily: values.fontFamily }}>
          {Object.entries(scaledSizes).map(([key, size]) => (
            <div key={key} className="flex items-baseline gap-4">
              <span className={`text-xs w-10 text-right ${d ? 'text-gray-600' : 'text-gray-400'}`}>{key}</span>
              <span className={`${d ? 'text-gray-200' : 'text-gray-800'}`} style={{ fontSize: `${size}px` }}>
                The quick brown fox ({size}px)
              </span>
            </div>
          ))}
          <div className="pt-4 border-t border-dashed mt-4" style={{ borderColor: d ? '#2c2c2c' : '#e5e7eb' }}>
            <h4 style={{ fontFamily: values.headingFontFamily, fontSize: `${scaledSizes['2xl']}px`, fontWeight: 700 }} className={d ? 'text-white' : 'text-gray-900'}>
              Heading Preview
            </h4>
            <p style={{ fontSize: `${scaledSizes.base}px` }} className={`mt-2 ${d ? 'text-gray-400' : 'text-gray-600'}`}>
              Body text preview with the configured font family and base size. This demonstrates how your typography settings will appear in the application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
