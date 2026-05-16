import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConfigStore } from '../../store/useConfigStore';
import { Layout as LayoutType, layoutSchema } from '../../types/config';
import { SelectField, ToggleField, NumberField } from '../ui/FormField';

export default function LayoutTab() {
  const { getSelectedCompany, updateCompany, theme } = useConfigStore();
  const selected = getSelectedCompany();
  const d = theme === 'dark';

  const { register, control, watch, formState: { errors }, reset } = useForm<LayoutType>({
    resolver: zodResolver(layoutSchema),
    defaultValues: selected?.layout,
    mode: 'onChange',
  });

  useEffect(() => {
    if (selected) reset(selected.layout);
  }, [selected?.company.id]);

  const values = watch();
  useEffect(() => {
    if (selected) {
      updateCompany(selected.company.id, 'layout', values);
    }
  }, [JSON.stringify(values)]);

  if (!selected) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>Layout Settings</h2>
        <p className={`text-sm mt-1 ${d ? 'text-gray-500' : 'text-gray-500'}`}>
          Theme mode, sidebar style, and container configuration.
        </p>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>Appearance</h3>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Theme Mode"
            error={errors.themeMode?.message}
            options={[
              { value: 'dark', label: 'Dark' },
              { value: 'light', label: 'Light' },
            ]}
            {...register('themeMode')}
          />
          <SelectField
            label="Sidebar Style"
            error={errors.sidebarStyle?.message}
            options={[
              { value: 'expanded', label: 'Expanded' },
              { value: 'collapsed', label: 'Collapsed' },
              { value: 'hidden', label: 'Hidden' },
            ]}
            {...register('sidebarStyle')}
          />
        </div>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5 mt-4`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>Structure</h3>
        <SelectField
          label="Container Width"
          error={errors.containerWidth?.message}
          options={[
            { value: 'fluid', label: 'Fluid (Full Width)' },
            { value: 'fixed', label: 'Fixed (1200px)' },
            { value: 'narrow', label: 'Narrow (960px)' },
          ]}
          {...register('containerWidth')}
        />
        <Controller name="cardBorderRadius" control={control} render={({ field }) => (
          <NumberField label="Card Border Radius (px)" value={field.value} onChange={field.onChange} min={0} max={32} error={errors.cardBorderRadius?.message} />
        )} />
        <Controller name="headerFixed" control={control} render={({ field }) => (
          <ToggleField label="Fixed Header" checked={field.value} onChange={field.onChange} hint="Keep the header pinned to the top of the viewport" />
        )} />
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 mt-4`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>Preview</h3>
        <div
          className={`rounded-lg border overflow-hidden ${d ? 'border-gray-700' : 'border-gray-300'}`}
          style={{ borderRadius: `${values.cardBorderRadius}px` }}
        >
          <div className={`flex h-40`}>
            {values.sidebarStyle !== 'hidden' && (
              <div
                className={`flex-shrink-0 border-r ${d ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'}`}
                style={{ width: values.sidebarStyle === 'expanded' ? 180 : 48 }}
              >
                <div className="p-2 space-y-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`h-3 rounded ${d ? 'bg-gray-800' : 'bg-gray-200'}`}
                      style={{ width: values.sidebarStyle === 'expanded' ? '80%' : '70%' }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="flex-1 flex flex-col">
              {values.headerFixed && (
                <div className={`h-6 border-b flex-shrink-0 ${d ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`} />
              )}
              <div className={`flex-1 p-3 ${d ? 'bg-gray-950' : 'bg-white'}`}>
                <div
                  className={`h-full rounded border ${d ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}
                  style={{
                    borderRadius: `${values.cardBorderRadius}px`,
                    maxWidth: values.containerWidth === 'narrow' ? '70%' : values.containerWidth === 'fixed' ? '85%' : '100%',
                    margin: values.containerWidth !== 'fluid' ? '0 auto' : undefined,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
