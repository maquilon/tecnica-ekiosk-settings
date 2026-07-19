import { z } from 'zod';

export const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color');

export const serviceTypeSchema = z.object({
  key: z.string().min(1, 'Key is required').regex(/^[a-z0-9-]+$/i, 'Key must be alphanumeric or hyphenated'),
  title: z.record(z.string()).default({}),
  subTitle: z.record(z.string()).default({}),
  colorBase: hexColorSchema,
  active: z.boolean().default(true),
});

export const splashPageSchema = z.object({
  darkLogo: z.boolean(),
});

export const companySchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  slogan: z.string().min(1, 'Slogan is required'),
  domain: z.string().min(1, 'Domain is required'),
  supportEmail: z.string().email('Must be a valid email'),
  timezone: z.string().min(1, 'Timezone is required'),
  dateFormat: z.string().min(1, 'Date format is required'),
  currency: z.string().min(1, 'Currency is required'),
  serviceType: z
    .array(serviceTypeSchema)
    .min(1, 'At least one service type is required')
    .refine((items) => new Set(items.map((i) => i.key)).size === items.length, {
      message: 'Service type keys must be unique',
    }),
});

export const brandingSchema = z.object({
  logoUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  faviconUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  backgroundColor: hexColorSchema,
  surfaceColor: hexColorSchema,
  primaryColor: hexColorSchema,
  secondaryColor: hexColorSchema,
  accentColor: hexColorSchema,
  errorColor: hexColorSchema,
  warningColor: hexColorSchema,
  successColor: hexColorSchema,
  textPrimaryColor: hexColorSchema,
  textSecondaryColor: hexColorSchema,
  labelTextColor: hexColorSchema,
  borderColor: hexColorSchema,
  shadowColor: z.string().min(1, 'Shadow color is required'),
});

export const buttonsSchema = z.object({
  primaryBackground: hexColorSchema,
  primaryTextColor: hexColorSchema,
  secondaryBackground: hexColorSchema,
  secondaryTextColor: hexColorSchema,
  borderRadius: z.number().min(0).max(50),
  fontWeight: z.number().min(100).max(900),
});

export const typographySchema = z.object({
  fontFamily: z.string().min(1, 'Font family is required'),
  headingFontFamily: z.string().min(1, 'Heading font family is required'),
  fontSizeBase: z.number().min(10).max(32),
  fontScale: z.number().min(0.5).max(2.0),
});

export const layoutSchema = z.object({
  themeMode: z.enum(['dark', 'light']),
  sidebarStyle: z.enum(['expanded', 'collapsed', 'hidden']),
  headerFixed: z.boolean(),
  cardBorderRadius: z.number().min(0).max(32),
  containerWidth: z.enum(['fluid', 'fixed', 'narrow']),
});

export const localizationSchema = z.object({
  defaultLanguage: z.string().min(2).max(5),
  supportedLanguages: z.array(z.string().min(2).max(5)).min(1),
  rtl: z.boolean(),
});

export const sessionSchema = z.object({
  idleTimeoutSeconds: z.number().min(0),
  idleWarningSeconds: z.number().min(0),
});

export const metadataSchema = z.object({
  version: z.string().min(1, 'Version is required'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const kioskConfigSchema = z.object({
  company: companySchema,
  splashPage: splashPageSchema,
  branding: brandingSchema,
  buttons: buttonsSchema,
  typography: typographySchema,
  layout: layoutSchema,
  session: sessionSchema,
  localization: localizationSchema,
  metadata: metadataSchema,
  active: z.boolean(),
});

// Legacy schemas used to migrate old multi-company array files.
export const legacyCompanySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  displayName: z.string().min(1),
  domain: z.string(),
  supportEmail: z.string(),
  timezone: z.string(),
  dateFormat: z.string(),
  currency: z.string(),
  serviceType: z.enum(['Deli', 'Food', 'Coffee']),
});

export const legacyCompanyConfigSchema = z.object({
  company: legacyCompanySchema,
  branding: brandingSchema,
  buttons: buttonsSchema,
  typography: typographySchema,
  layout: layoutSchema,
  session: sessionSchema,
  localization: localizationSchema,
  metadata: metadataSchema,
  active: z.boolean(),
});

export type ServiceType = z.infer<typeof serviceTypeSchema>;
export type SplashPage = z.infer<typeof splashPageSchema>;
export type Company = z.infer<typeof companySchema>;
export type Branding = z.infer<typeof brandingSchema>;
export type Buttons = z.infer<typeof buttonsSchema>;
export type Typography = z.infer<typeof typographySchema>;
export type Layout = z.infer<typeof layoutSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type Localization = z.infer<typeof localizationSchema>;
export type Metadata = z.infer<typeof metadataSchema>;
export type KioskConfig = z.infer<typeof kioskConfigSchema>;
export type LegacyCompanyConfig = z.infer<typeof legacyCompanyConfigSchema>;

export type TabId =
  | 'company'
  | 'splashPage'
  | 'branding'
  | 'buttons'
  | 'typography'
  | 'layout'
  | 'session'
  | 'localization'
  | 'metadata';

export const defaultKioskConfig: KioskConfig = {
  company: {
    id: '7e691896',
    name: 'Tecnica Systems LLC',
    displayName: 'Tecnica Systems',
    slogan: 'Smart eKiosk',
    domain: 'https://tecnicasystems.com',
    supportEmail: 'support@tecnicasystems.com',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    serviceType: [
      {
        key: 'deli',
        title: { en: 'Deli', es: 'Deli' },
        subTitle: {
          es: 'Sándwiches, carnes frías y quesos',
          en: 'Sandwiches, cold cuts & cheeses',
        },
        colorBase: '#3341cb',
        active: true,
      },
      {
        key: 'coffee',
        title: { es: 'Cafetería', en: 'Hot Food' },
        subTitle: {
          es: 'Hamburguesas, bebidas y postres',
          en: 'Burgers, beverages & desserts',
        },
        colorBase: '#eda123',
        active: false,
      },
      {
        key: 'restaurant',
        title: { en: 'Cafe & Bakery', es: 'Restaurante' },
        subTitle: {
          en: 'Hot drinks, donuts & baked goods',
          es: 'Bebidas calientes, donuts y panadería',
        },
        colorBase: '#1ea24d',
        active: true,
      },
    ],
  },
  splashPage: {
    darkLogo: false,
  },
  branding: {
    logoUrl: '',
    faviconUrl: '',
    backgroundColor: '#000000',
    surfaceColor: '#111111',
    primaryColor: '#4285F4',
    secondaryColor: '#34A853',
    accentColor: '#FBBC05',
    errorColor: '#EA4335',
    warningColor: '#F9AB00',
    successColor: '#34A853',
    textPrimaryColor: '#FFFFFF',
    textSecondaryColor: '#B0B0B0',
    labelTextColor: '#E0E0E0',
    borderColor: '#2C2C2C',
    shadowColor: 'rgba(0,0,0,0.25)',
  },
  buttons: {
    primaryBackground: '#4285F4',
    primaryTextColor: '#FFFFFF',
    secondaryBackground: '#FFFFFF',
    secondaryTextColor: '#4285F4',
    borderRadius: 8,
    fontWeight: 600,
  },
  typography: {
    fontFamily: 'Inter',
    headingFontFamily: 'Inter',
    fontSizeBase: 16,
    fontScale: 1.0,
  },
  layout: {
    themeMode: 'dark',
    sidebarStyle: 'expanded',
    headerFixed: true,
    cardBorderRadius: 12,
    containerWidth: 'fluid',
  },
  session: {
    idleTimeoutSeconds: 300,
    idleWarningSeconds: 60,
  },
  localization: {
    defaultLanguage: 'es',
    supportedLanguages: ['en', 'es'],
    rtl: false,
  },
  metadata: {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  active: true,
};

const defaultLegacyServiceTypeColors: Record<string, string> = {
  Deli: '#3341cb',
  Food: '#1ea24d',
  Coffee: '#eda123',
};

function defaultDomain(domain: string): string {
  return domain?.trim() || 'https://tecnicasystems.com';
}

function defaultSupportEmail(email: string): string {
  const trimmed = email?.trim();
  if (trimmed && trimmed.includes('@')) return trimmed;
  return 'support@tecnicasystems.com';
}

function legacyServiceTypeToArray(
  legacyServiceType: string,
  supportedLanguages: string[],
): ServiceType[] {
  const key = legacyServiceType.toLowerCase();
  const title = Object.fromEntries(
    supportedLanguages.map((lang) => [lang, legacyServiceType]),
  );
  const subTitle = Object.fromEntries(
    supportedLanguages.map((lang) => [lang, '']),
  );
  return [
    {
      key,
      title,
      subTitle,
      colorBase:
        defaultLegacyServiceTypeColors[legacyServiceType] || '#3341cb',
      active: true,
    },
  ];
}

export function migrateLegacyArray(
  legacy: LegacyCompanyConfig[],
): KioskConfig {
  const active = legacy.find((c) => c.active) || legacy[0];
  if (!active) {
    return { ...defaultKioskConfig };
  }

  const now = new Date().toISOString();
  const companyName = active.company.name?.trim() || 'Tecnica Systems LLC';

  return {
    company: {
      id: active.company.id?.trim() || '7e691896',
      name: companyName,
      displayName: active.company.displayName?.trim() || companyName,
      slogan: active.company.displayName?.trim() || 'Smart eKiosk JSON',
      domain: defaultDomain(active.company.domain),
      supportEmail: defaultSupportEmail(active.company.supportEmail),
      timezone: active.company.timezone || 'America/New_York',
      dateFormat: active.company.dateFormat || 'MM/DD/YYYY',
      currency: active.company.currency || 'USD',
      serviceType: legacyServiceTypeToArray(
        active.company.serviceType || 'Deli',
        active.localization.supportedLanguages,
      ),
    },
    splashPage: { darkLogo: false },
    branding: active.branding,
    buttons: active.buttons,
    typography: active.typography,
    layout: active.layout,
    session: active.session,
    localization: active.localization,
    metadata: {
      ...active.metadata,
      version: '1.0.0',
      updatedAt: now,
    },
    active: true,
  };
}
