import { z } from 'zod';

export const companySchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  domain: z.string().min(1, 'Domain is required'),
  supportEmail: z.string().email('Must be a valid email'),
  timezone: z.string().min(1, 'Timezone is required'),
  dateFormat: z.string().min(1, 'Date format is required'),
  currency: z.string().min(1, 'Currency is required'),
  serviceType: z.enum(['Deli', 'Food', 'Coffee'], { required_error: 'Service type is required' }),
});

export const brandingSchema = z.object({
  logoUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  faviconUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  surfaceColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  errorColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  warningColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  successColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  textPrimaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  textSecondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  labelTextColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  borderColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  shadowColor: z.string().min(1, 'Shadow color is required'),
});

export const buttonsSchema = z.object({
  primaryBackground: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  primaryTextColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  secondaryBackground: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  secondaryTextColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
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

export const metadataSchema = z.object({
  version: z.string().min(1, 'Version is required'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const companyConfigSchema = z.object({
  company: companySchema,
  branding: brandingSchema,
  buttons: buttonsSchema,
  typography: typographySchema,
  layout: layoutSchema,
  localization: localizationSchema,
  metadata: metadataSchema,
  active: z.boolean(),
});

export type Company = z.infer<typeof companySchema>;
export type Branding = z.infer<typeof brandingSchema>;
export type Buttons = z.infer<typeof buttonsSchema>;
export type Typography = z.infer<typeof typographySchema>;
export type Layout = z.infer<typeof layoutSchema>;
export type Localization = z.infer<typeof localizationSchema>;
export type Metadata = z.infer<typeof metadataSchema>;
export type CompanyConfig = z.infer<typeof companyConfigSchema>;

export type TabId =
  | 'company'
  | 'branding'
  | 'buttons'
  | 'typography'
  | 'layout'
  | 'localization'
  | 'metadata';

export const defaultCompanyConfig: CompanyConfig = {
  company: {
    id: '',
    name: '',
    displayName: '',
    domain: '',
    supportEmail: '',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    serviceType: 'Deli',
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
  localization: {
    defaultLanguage: 'en',
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
