import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { CompanyConfig, TabId, defaultCompanyConfig } from '../types/config';

/** Ensures exactly one company is active; falls back to the first entry. */
function ensureSingleActive(companies: CompanyConfig[]): CompanyConfig[] {
  if (companies.length === 0) return companies;
  const hasActive = companies.some((c) => c.active);
  if (!hasActive) {
    return companies.map((c, i) => (i === 0 ? { ...c, active: true } : c));
  }
  return companies;
}

interface ConfigStore {
  companies: CompanyConfig[];
  selectedCompanyId: string | null;
  activeTab: TabId;
  theme: 'dark' | 'light';
  currentFilePath: string | null;
  isDirty: boolean;
  searchQuery: string;
  sortBy: 'name' | 'date';
  filterActive: 'all' | 'active' | 'inactive';
  showPreview: boolean;

  setCompanies: (companies: CompanyConfig[]) => void;
  addCompany: () => void;
  updateCompany: (id: string, section: string, data: unknown) => void;
  updateFullCompany: (id: string, config: CompanyConfig) => void;
  deleteCompany: (id: string) => void;
  duplicateCompany: (id: string) => void;
  toggleActive: (id: string) => void;
  selectCompany: (id: string | null) => void;
  setActiveTab: (tab: TabId) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setCurrentFilePath: (path: string | null) => void;
  setIsDirty: (dirty: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'name' | 'date') => void;
  setFilterActive: (filter: 'all' | 'active' | 'inactive') => void;
  setShowPreview: (show: boolean) => void;
  getSelectedCompany: () => CompanyConfig | undefined;
  getFilteredCompanies: () => CompanyConfig[];
  loadFromJson: (json: string) => boolean;
  exportToJson: () => string;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  companies: [],
  selectedCompanyId: null,
  activeTab: 'company',
  theme: 'dark',
  currentFilePath: null,
  isDirty: false,
  searchQuery: '',
  sortBy: 'name',
  filterActive: 'all',
  showPreview: false,

  setCompanies: (companies) => set({ companies: ensureSingleActive(companies), isDirty: true }),

  addCompany: () => {
    const id = uuidv4().slice(0, 8);
    const now = new Date().toISOString();
    const newCompany: CompanyConfig = {
      ...structuredClone(defaultCompanyConfig),
      company: {
        ...defaultCompanyConfig.company,
        id,
        name: `New Company ${id}`,
        displayName: `New Company ${id}`,
      },
      metadata: {
        version: '1.0.0',
        createdAt: now,
        updatedAt: now,
      },
    };
    set((state) => {
      const isFirst = state.companies.length === 0;
      const updated = [...state.companies, { ...newCompany, active: isFirst }];
      return {
        companies: updated,
        selectedCompanyId: id,
        activeTab: 'company',
        isDirty: true,
      };
    });
  },

  updateCompany: (id, section, data) => {
    const now = new Date().toISOString();
    set((state) => ({
      companies: state.companies.map((c) =>
        c.company.id === id
          ? {
              ...c,
              [section]: data,
              metadata: { ...c.metadata, updatedAt: now },
            }
          : c,
      ),
      isDirty: true,
    }));
  },

  updateFullCompany: (id, config) => {
    set((state) => ({
      companies: state.companies.map((c) =>
        c.company.id === id ? config : c,
      ),
      isDirty: true,
    }));
  },

  deleteCompany: (id) => {
    set((state) => {
      const filtered = ensureSingleActive(
        state.companies.filter((c) => c.company.id !== id),
      );
      return {
        companies: filtered,
        selectedCompanyId:
          state.selectedCompanyId === id
            ? filtered[0]?.company.id ?? null
            : state.selectedCompanyId,
        isDirty: true,
      };
    });
  },

  duplicateCompany: (id) => {
    const state = get();
    const original = state.companies.find((c) => c.company.id === id);
    if (!original) return;
    const newId = uuidv4().slice(0, 8);
    const now = new Date().toISOString();
    const duplicate: CompanyConfig = {
      ...structuredClone(original),
      company: {
        ...original.company,
        id: newId,
        name: `${original.company.name} (Copy)`,
        displayName: `${original.company.displayName} (Copy)`,
      },
      metadata: {
        version: original.metadata.version,
        createdAt: now,
        updatedAt: now,
      },
    };
    set((state) => ({
      companies: [...state.companies, { ...duplicate, active: false }],
      selectedCompanyId: newId,
      isDirty: true,
    }));
  },

  toggleActive: (id) => {
    set((state) => {
      const target = state.companies.find((c) => c.company.id === id);
      if (!target) return state;
      const activating = !target.active;
      const updated = activating
        ? state.companies.map((c) => ({ ...c, active: c.company.id === id }))
        : state.companies.map((c) =>
            c.company.id === id ? { ...c, active: false } : c,
          );
      return { companies: ensureSingleActive(updated), isDirty: true };
    });
  },

  selectCompany: (id) => set({ selectedCompanyId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setTheme: (theme) => set({ theme }),
  setCurrentFilePath: (path) => set({ currentFilePath: path }),
  setIsDirty: (dirty) => set({ isDirty: dirty }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setFilterActive: (filter) => set({ filterActive: filter }),
  setShowPreview: (show) => set({ showPreview: show }),

  getSelectedCompany: () => {
    const state = get();
    return state.companies.find((c) => c.company.id === state.selectedCompanyId);
  },

  getFilteredCompanies: () => {
    const { companies, searchQuery, sortBy, filterActive } = get();
    let filtered = [...companies];

    if (filterActive === 'active') filtered = filtered.filter((c) => c.active);
    else if (filterActive === 'inactive') filtered = filtered.filter((c) => !c.active);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.company.name.toLowerCase().includes(q) ||
          c.company.domain.toLowerCase().includes(q) ||
          c.company.id.toLowerCase().includes(q),
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.company.name.localeCompare(b.company.name);
      return new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime();
    });

    return filtered;
  },

  loadFromJson: (json) => {
    try {
      const parsed = JSON.parse(json);
      const data = Array.isArray(parsed) ? parsed : [parsed];
      set({
        companies: ensureSingleActive(data),
        selectedCompanyId: data[0]?.company?.id ?? null,
        isDirty: false,
      });
      return true;
    } catch {
      return false;
    }
  },

  exportToJson: () => {
    const { companies } = get();
    return JSON.stringify(companies, null, 2);
  },
}));
