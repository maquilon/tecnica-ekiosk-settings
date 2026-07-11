import { create } from 'zustand';
import {
  Company,
  KioskConfig,
  Metadata,
  ServiceType,
  TabId,
  defaultKioskConfig,
  kioskConfigSchema,
  legacyCompanyConfigSchema,
  migrateLegacyArray,
} from '../types/config';

interface ConfigStore {
  config: KioskConfig | null;
  activeTab: TabId;
  theme: 'dark' | 'light';
  currentFilePath: string | null;
  isDirty: boolean;

  setConfig: (config: KioskConfig | null) => void;
  setActiveTab: (tab: TabId) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setCurrentFilePath: (path: string | null) => void;
  setIsDirty: (dirty: boolean) => void;
  getConfig: () => KioskConfig | null;
  updateSection: <K extends keyof KioskConfig>(section: K, data: KioskConfig[K]) => void;
  updateCompany: (data: Partial<Company>) => void;
  updateMetadata: (data: Partial<Metadata>) => void;
  addServiceType: (serviceType: ServiceType) => void;
  removeServiceType: (key: string) => void;
  updateServiceType: (key: string, data: Partial<ServiceType>) => void;
  loadFromJson: (json: string) => boolean;
  exportToJson: () => string;
}

function buildConfigWithTouch<K extends keyof KioskConfig>(
  config: KioskConfig,
  section: K,
  data: KioskConfig[K],
): KioskConfig {
  const now = new Date().toISOString();
  const nextConfig = {
    ...config,
    [section]: data,
    metadata: { ...config.metadata, updatedAt: now },
  } as KioskConfig;

  if (section === 'metadata') {
    nextConfig.metadata = { ...(data as Metadata), updatedAt: now };
  }

  return nextConfig;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  config: null,
  activeTab: 'company',
  theme: 'dark',
  currentFilePath: null,
  isDirty: false,

  setConfig: (config) => set({ config, isDirty: true }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setTheme: (theme) => set({ theme }),
  setCurrentFilePath: (path) => set({ currentFilePath: path }),
  setIsDirty: (dirty) => set({ isDirty: dirty }),

  getConfig: () => get().config,

  updateSection: (section, data) => {
    set((state) => {
      if (!state.config) return state;
      return {
        config: buildConfigWithTouch(state.config, section, data),
        isDirty: true,
      };
    });
  },

  updateCompany: (data) => {
    set((state) => {
      if (!state.config) return state;
      return {
        config: buildConfigWithTouch(state.config, 'company', {
          ...state.config.company,
          ...data,
        }),
        isDirty: true,
      };
    });
  },

  updateMetadata: (data) => {
    set((state) => {
      if (!state.config) return state;
      return {
        config: buildConfigWithTouch(state.config, 'metadata', {
          ...state.config.metadata,
          ...data,
        }),
        isDirty: true,
      };
    });
  },

  addServiceType: (serviceType) => {
    set((state) => {
      const config = state.config;
      if (!config) return state;
      if (config.company.serviceType.some((s) => s.key === serviceType.key)) return state;
      return {
        config: buildConfigWithTouch(config, 'company', {
          ...config.company,
          serviceType: [...config.company.serviceType, serviceType],
        }),
        isDirty: true,
      };
    });
  },

  removeServiceType: (key) => {
    set((state) => {
      const config = state.config;
      if (!config) return state;
      return {
        config: buildConfigWithTouch(config, 'company', {
          ...config.company,
          serviceType: config.company.serviceType.filter((s) => s.key !== key),
        }),
        isDirty: true,
      };
    });
  },

  updateServiceType: (key, data) => {
    set((state) => {
      const config = state.config;
      if (!config) return state;
      const updated = config.company.serviceType.map((s) => {
        if (s.key !== key) return s;
        return { ...s, ...data };
      });
      const keys = updated.map((s) => s.key);
      if (new Set(keys).size !== keys.length) return state;
      return {
        config: buildConfigWithTouch(config, 'company', {
          ...config.company,
          serviceType: updated,
        }),
        isDirty: true,
      };
    });
  },

  loadFromJson: (json) => {
    try {
      const parsed = JSON.parse(json);
      let config: KioskConfig;
      let migrated = false;

      if (Array.isArray(parsed)) {
        const legacy = legacyCompanyConfigSchema.array().safeParse(parsed);
        if (legacy.success) {
          config = migrateLegacyArray(legacy.data);
          migrated = true;
        } else {
          config = { ...defaultKioskConfig };
        }
      } else {
        const result = kioskConfigSchema.safeParse(parsed);
        if (result.success) {
          config = result.data;
        } else {
          config = { ...defaultKioskConfig };
        }
      }

      set({
        config,
        isDirty: migrated,
        activeTab: 'company',
      });
      return true;
    } catch {
      set({
        config: { ...defaultKioskConfig },
        isDirty: true,
        activeTab: 'company',
      });
      return false;
    }
  },

  exportToJson: () => {
    const { config } = get();
    if (!config) return JSON.stringify({ ...defaultKioskConfig }, null, 2);
    return JSON.stringify(config, null, 2);
  },
}));
