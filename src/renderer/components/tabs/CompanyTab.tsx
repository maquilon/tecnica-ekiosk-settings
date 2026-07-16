import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConfigStore } from '../../store/useConfigStore';
import { Company, companySchema, ServiceType } from '../../types/config';
import { InputField, SelectField } from '../ui/FormField';
import ColorPicker from '../ui/ColorPicker';
import { Plus, Trash2 } from 'lucide-react';

const TIMEZONES = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Anchorage', 'Pacific/Honolulu', 'Europe/London', 'Europe/Paris',
  'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata',
  'Australia/Sydney', 'America/Sao_Paulo', 'Africa/Cairo',
];

const DATE_FORMATS = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD-MMM-YYYY'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'BRL', 'INR', 'CNY', 'MXN'];

export default function CompanyTab() {
  const {
    config, updateCompany, addServiceType, removeServiceType, updateServiceType, theme,
  } = useConfigStore();
  const d = theme === 'dark';

  const [newKey, setNewKey] = useState('');
  const [newColor, setNewColor] = useState('#3341cb');

  const { register, watch, formState: { errors }, reset } = useForm<Company>({
    resolver: zodResolver(companySchema),
    defaultValues: config?.company,
    mode: 'onChange',
  });

  useEffect(() => {
    if (config) reset(config.company);
  }, [config?.company.id]);

  const values = watch();
  useEffect(() => {
    if (config && values.id) {
      updateCompany({ ...values, serviceType: config.company.serviceType });
    }
  }, [JSON.stringify(values)]);

  if (!config) return null;

  const handleAdd = () => {
    if (!newKey.trim()) return;
    const langs = config.localization.supportedLanguages;
    const translations = Object.fromEntries(langs.map((lang) => [lang, '']));
    addServiceType({
      key: newKey.trim().toLowerCase(),
      title: { ...translations },
      subTitle: { ...translations },
      colorBase: newColor,
      active: true,
    });
    setNewKey('');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>
          Company Information
        </h2>
        <p className={`text-sm mt-1 ${d ? 'text-gray-500' : 'text-gray-500'}`}>
          Basic company details and regional settings.
        </p>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>
          Identity
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Company ID" error={errors.id?.message} {...register('id')} />
          <InputField label="Name" error={errors.name?.message} {...register('name')} />
        </div>
        <InputField label="Display Name" error={errors.displayName?.message} {...register('displayName')} />
        <InputField label="Slogan" error={errors.slogan?.message} {...register('slogan')} placeholder="Smart eKiosk" />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Domain" error={errors.domain?.message} {...register('domain')} placeholder="example.com" />
          <InputField label="Support Email" error={errors.supportEmail?.message} {...register('supportEmail')} type="email" placeholder="support@example.com" />
        </div>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5 mt-4`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>
          Service Types
        </h3>
        <div className="space-y-3">
          {config.company.serviceType.map((st) => (
            <div key={st.key} className={`p-3 rounded-lg border border-dashed ${d ? 'border-gray-700/30 bg-white/5' : 'border-gray-200 bg-gray-50/50'} space-y-3`}>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={st.key}
                  onChange={(e) => updateServiceType(st.key, { key: e.target.value })}
                  className={`input-base ${d ? 'input-dark' : 'input-light'} flex-1 text-xs`}
                />
                <div className="w-36">
                  <ColorPicker
                    label=""
                    value={st.colorBase}
                    onChange={(color) => updateServiceType(st.key, { colorBase: color })}
                  />
                </div>
                <label className={`flex items-center gap-1.5 text-xs cursor-pointer ${d ? 'text-gray-400' : 'text-gray-600'}`}>
                  <input
                    type="checkbox"
                    checked={st.active}
                    onChange={(e) => updateServiceType(st.key, { active: e.target.checked })}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  Active
                </label>
                <button
                  onClick={() => removeServiceType(st.key)}
                  disabled={config.company.serviceType.length <= 1}
                  className="p-1.5 rounded text-brand-error hover:bg-brand-error/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Remove service type"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {config.localization.supportedLanguages.map((lang) => (
                  <div key={lang} className="space-y-1">
                    <label className={`block text-[10px] uppercase tracking-wide ${d ? 'text-gray-500' : 'text-gray-500'}`}>
                      {lang} title
                    </label>
                    <input
                      type="text"
                      value={st.title[lang] || ''}
                      onChange={(e) => updateServiceType(st.key, { title: { ...st.title, [lang]: e.target.value } })}
                      className={`input-base ${d ? 'input-dark' : 'input-light'} w-full text-xs`}
                    />
                    <label className={`block text-[10px] uppercase tracking-wide ${d ? 'text-gray-500' : 'text-gray-500'}`}>
                      {lang} subtitle
                    </label>
                    <input
                      type="text"
                      value={st.subTitle[lang] || ''}
                      onChange={(e) => updateServiceType(st.key, { subTitle: { ...st.subTitle, [lang]: e.target.value } })}
                      className={`input-base ${d ? 'input-dark' : 'input-light'} w-full text-xs`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 pt-2 border-t border-dashed border-gray-700/30">
            <input
              type="text"
              placeholder="New service type key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className={`input-base ${d ? 'input-dark' : 'input-light'} flex-1 text-xs`}
            />
            <div className="w-36">
              <ColorPicker
                label=""
                value={newColor}
                onChange={setNewColor}
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!newKey.trim()}
              className="btn btn-primary !px-3 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          {errors.serviceType?.message && (
            <p className="text-xs text-brand-error">{errors.serviceType.message}</p>
          )}
        </div>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5 mt-4`}>
        <h3 className={`section-title ${d ? 'section-title-dark' : 'section-title-light'}`}>
          Regional Settings
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <SelectField
            label="Timezone"
            error={errors.timezone?.message}
            options={TIMEZONES.map((tz) => ({ value: tz, label: tz }))}
            {...register('timezone')}
          />
          <SelectField
            label="Date Format"
            error={errors.dateFormat?.message}
            options={DATE_FORMATS.map((f) => ({ value: f, label: f }))}
            {...register('dateFormat')}
          />
          <SelectField
            label="Currency"
            error={errors.currency?.message}
            options={CURRENCIES.map((c) => ({ value: c, label: c }))}
            {...register('currency')}
          />
        </div>
      </div>
    </div>
  );
}
