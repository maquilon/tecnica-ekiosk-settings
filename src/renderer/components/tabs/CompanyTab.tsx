import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConfigStore } from '../../store/useConfigStore';
import { Company, companySchema } from '../../types/config';
import { InputField, SelectField } from '../ui/FormField';

const TIMEZONES = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Anchorage', 'Pacific/Honolulu', 'Europe/London', 'Europe/Paris',
  'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata',
  'Australia/Sydney', 'America/Sao_Paulo', 'Africa/Cairo',
];

const DATE_FORMATS = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD-MMM-YYYY'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'BRL', 'INR', 'CNY', 'MXN'];
const SERVICE_TYPES = ['Deli', 'Food', 'Coffee'];

export default function CompanyTab() {
  const { getSelectedCompany, updateCompany, theme } = useConfigStore();
  const selected = getSelectedCompany();
  const d = theme === 'dark';

  const { register, watch, formState: { errors }, reset } = useForm<Company>({
    resolver: zodResolver(companySchema),
    defaultValues: selected?.company,
    mode: 'onChange',
  });

  useEffect(() => {
    if (selected) reset(selected.company);
  }, [selected?.company.id]);

  const values = watch();
  useEffect(() => {
    if (selected && values.id) {
      updateCompany(selected.company.id, 'company', values);
    }
  }, [JSON.stringify(values)]);

  if (!selected) return null;

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
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Domain" error={errors.domain?.message} {...register('domain')} placeholder="example.com" />
          <InputField label="Support Email" error={errors.supportEmail?.message} {...register('supportEmail')} type="email" placeholder="support@example.com" />
        </div>
        <SelectField
          label="Service Type"
          error={errors.serviceType?.message}
          options={SERVICE_TYPES.map((s) => ({ value: s, label: s }))}
          {...register('serviceType')}
        />
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
