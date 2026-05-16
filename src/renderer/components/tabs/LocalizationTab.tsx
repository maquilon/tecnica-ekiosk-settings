import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConfigStore } from '../../store/useConfigStore';
import { Localization, localizationSchema } from '../../types/config';
import { SelectField, ToggleField } from '../ui/FormField';
import { Plus, X } from 'lucide-react';

const LANGUAGES = [
  { value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' }, { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' }, { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' }, { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' }, { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' }, { value: 'ru', label: 'Russian' },
  { value: 'nl', label: 'Dutch' }, { value: 'sv', label: 'Swedish' },
  { value: 'pl', label: 'Polish' }, { value: 'tr', label: 'Turkish' },
];

export default function LocalizationTab() {
  const { getSelectedCompany, updateCompany, theme } = useConfigStore();
  const selected = getSelectedCompany();
  const d = theme === 'dark';
  const [newLang, setNewLang] = useState('');

  const { register, control, watch, formState: { errors }, reset, setValue, getValues } = useForm<Localization>({
    resolver: zodResolver(localizationSchema),
    defaultValues: selected?.localization,
    mode: 'onChange',
  });

  useEffect(() => {
    if (selected) reset(selected.localization);
  }, [selected?.company.id]);

  const values = watch();
  useEffect(() => {
    if (selected) {
      updateCompany(selected.company.id, 'localization', values);
    }
  }, [JSON.stringify(values)]);

  if (!selected) return null;

  const addLanguage = () => {
    if (newLang && !values.supportedLanguages.includes(newLang)) {
      setValue('supportedLanguages', [...values.supportedLanguages, newLang]);
      setNewLang('');
    }
  };

  const removeLanguage = (lang: string) => {
    const updated = values.supportedLanguages.filter((l) => l !== lang);
    if (updated.length > 0) {
      setValue('supportedLanguages', updated);
      if (values.defaultLanguage === lang) {
        setValue('defaultLanguage', updated[0]);
      }
    }
  };

  const getLangLabel = (code: string) => LANGUAGES.find((l) => l.value === code)?.label || code;

  return (
    <div className="p-6 max-w-3xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>Localization</h2>
        <p className={`text-sm mt-1 ${d ? 'text-gray-500' : 'text-gray-500'}`}>
          Language preferences and text direction settings.
        </p>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>Language</h3>
        <SelectField
          label="Default Language"
          error={errors.defaultLanguage?.message}
          options={values.supportedLanguages.map((l) => ({ value: l, label: getLangLabel(l) }))}
          {...register('defaultLanguage')}
        />

        <div className="space-y-2">
          <label className={`block text-xs font-medium ${d ? 'text-gray-400' : 'text-gray-600'}`}>
            Supported Languages
          </label>
          <div className="flex flex-wrap gap-2">
            {values.supportedLanguages.map((lang) => (
              <span
                key={lang}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                  d ? 'bg-white/10 text-gray-200' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {getLangLabel(lang)}
                {values.supportedLanguages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang)}
                    className={`ml-1 p-0.5 rounded-full transition-colors ${d ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <select
              value={newLang}
              onChange={(e) => setNewLang(e.target.value)}
              className={`input-base ${d ? 'input-dark' : 'input-light'} flex-1 text-xs`}
            >
              <option value="">Add a language...</option>
              {LANGUAGES.filter((l) => !values.supportedLanguages.includes(l.value)).map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={addLanguage}
              disabled={!newLang}
              className="btn btn-primary !px-3 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          {errors.supportedLanguages && (
            <p className="text-xs text-brand-error">{errors.supportedLanguages.message}</p>
          )}
        </div>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5 mt-4`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>Text Direction</h3>
        <Controller name="rtl" control={control} render={({ field }) => (
          <ToggleField label="Right-to-Left (RTL)" checked={field.value} onChange={field.onChange} hint="Enable RTL layout for languages like Arabic and Hebrew" />
        )} />
      </div>
    </div>
  );
}
