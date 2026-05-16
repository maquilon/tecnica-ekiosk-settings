import { useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useConfigStore } from '../store/useConfigStore';
import Sidebar from './Sidebar';
import CompanyTab from './tabs/CompanyTab';
import BrandingTab from './tabs/BrandingTab';
import ButtonsTab from './tabs/ButtonsTab';
import TypographyTab from './tabs/TypographyTab';
import LayoutTab from './tabs/LayoutTab';
import LocalizationTab from './tabs/LocalizationTab';
import MetadataTab from './tabs/MetadataTab';
import JsonEditorTab from './tabs/JsonEditorTab';
import ThemePreview from './ThemePreview';
import {
  Building2, Palette, SquareMousePointer, Type, LayoutDashboard, Globe, Info,
  Code2, Eye, Sun, Moon, Save, FolderOpen, Download, RotateCcw, Upload,
} from 'lucide-react';
import { TabId } from '../types/config';

const TABS: { id: TabId; label: string; icon: typeof Building2 }[] = [
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'buttons', label: 'Buttons', icon: SquareMousePointer },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'layout', label: 'Layout', icon: LayoutDashboard },
  { id: 'localization', label: 'Localization', icon: Globe },
  { id: 'metadata', label: 'Metadata', icon: Info },
  { id: 'json', label: 'JSON Editor', icon: Code2 },
  { id: 'preview', label: 'Preview', icon: Eye },
];

export default function Layout() {
  const {
    activeTab, setActiveTab, theme, setTheme, selectedCompanyId,
    getSelectedCompany, isDirty, setIsDirty, currentFilePath,
    setCurrentFilePath, exportToJson, loadFromJson, setCompanies,
    companies, resetCompany,
  } = useConfigStore();

  const autosaveTimer = useRef<ReturnType<typeof setTimeout>>();
  const d = theme === 'dark';
  const selected = getSelectedCompany();

  const handleSave = useCallback(async () => {
    try {
      const json = exportToJson();
      if (window.electronAPI) {
        await window.electronAPI.saveConfig(json);
        setIsDirty(false);
        toast.success('Configuration saved');
      } else {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tecnicaSytemsKioskSettings.json';
        a.click();
        URL.revokeObjectURL(url);
        setIsDirty(false);
        toast.success('Configuration exported');
      }
    } catch {
      toast.error('Failed to save');
    }
  }, [exportToJson, setIsDirty]);

  const handleOpen = useCallback(async () => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.openFileDialog();
        if (result) {
          const ok = loadFromJson(result.content);
          if (ok) {
            setCurrentFilePath(result.filePath);
            toast.success('Configuration loaded');
          } else {
            toast.error('Invalid JSON format');
          }
        }
      }
    } catch {
      toast.error('Failed to open file');
    }
  }, [loadFromJson, setCurrentFilePath]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const ok = loadFromJson(reader.result as string);
        if (ok) toast.success('Imported successfully');
        else toast.error('Invalid JSON format');
      };
      reader.readAsText(file);
    };
    input.click();
  }, [loadFromJson]);

  const handleExport = useCallback(() => {
    const json = exportToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'company-config.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  }, [exportToJson]);

  useEffect(() => {
    if (isDirty && currentFilePath && window.electronAPI) {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(async () => {
        try {
          const json = exportToJson();
          await window.electronAPI.saveFile(currentFilePath, json);
          setIsDirty(false);
        } catch {}
      }, 5000);
    }
    return () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); };
  }, [isDirty, currentFilePath, companies]);

  const renderTabContent = () => {
    if (!selected) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Building2 className={`w-16 h-16 mx-auto mb-4 ${d ? 'text-gray-700' : 'text-gray-300'}`} />
            <h2 className={`text-xl font-semibold mb-2 ${d ? 'text-gray-400' : 'text-gray-600'}`}>
              No Company Selected
            </h2>
            <p className={`text-sm ${d ? 'text-gray-600' : 'text-gray-400'}`}>
              Select a company from the sidebar or create a new one to get started.
            </p>
          </div>
        </div>
      );
    }
    switch (activeTab) {
      case 'company': return <CompanyTab />;
      case 'branding': return <BrandingTab />;
      case 'buttons': return <ButtonsTab />;
      case 'typography': return <TypographyTab />;
      case 'layout': return <LayoutTab />;
      case 'localization': return <LocalizationTab />;
      case 'metadata': return <MetadataTab />;
      case 'json': return <JsonEditorTab />;
      case 'preview': return <ThemePreview />;
      default: return null;
    }
  };

  return (
    <div className={`h-screen flex flex-col ${d ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header
        className={`drag-region flex items-center justify-between px-4 h-12 border-b flex-shrink-0 ${
          d ? 'bg-[#0a0a0a] border-[#1c1c1c]' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3 pl-16">
          <h1 className={`text-sm font-bold tracking-tight ${d ? 'text-white' : 'text-gray-900'}`}>
            eKiosk Settings
          </h1>
          {currentFilePath && (
            <span className={`text-xs truncate max-w-[200px] ${d ? 'text-gray-600' : 'text-gray-400'}`}>
              {currentFilePath.split('/').pop()}
            </span>
          )}
          {isDirty && (
            <span className="w-2 h-2 rounded-full bg-brand-warning" title="Unsaved changes" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleOpen} className={`p-2 rounded-lg transition-colors ${d ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`} title="Open File">
            <FolderOpen className="w-4 h-4" />
          </button>
          <button onClick={handleImport} className={`p-2 rounded-lg transition-colors ${d ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`} title="Import JSON">
            <Upload className="w-4 h-4" />
          </button>
          <button onClick={handleExport} className={`p-2 rounded-lg transition-colors ${d ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`} title="Export JSON">
            <Download className="w-4 h-4" />
          </button>
          <div className={`w-px h-5 mx-1 ${d ? 'bg-[#2c2c2c]' : 'bg-gray-200'}`} />
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-lg transition-colors ${d ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
            title="Toggle Theme"
          >
            {d ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Bar */}
          {selected && (
            <div className={`flex items-center gap-1 px-4 py-2 border-b overflow-x-auto flex-shrink-0 ${
              d ? 'bg-[#0a0a0a] border-[#1c1c1c]' : 'bg-gray-50 border-gray-200'
            }`}>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-btn flex items-center gap-1.5 whitespace-nowrap ${
                      active
                        ? d ? 'tab-btn-active-dark' : 'tab-btn-active-light'
                        : d ? 'tab-btn-inactive-dark' : 'tab-btn-inactive-light'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="animate-fade-in">
              {renderTabContent()}
            </div>
          </div>

          {/* Sticky Action Bar */}
          {selected && (
            <div className={`flex items-center justify-between px-6 py-3 border-t flex-shrink-0 ${
              d ? 'bg-[#0a0a0a] border-[#1c1c1c]' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => selectedCompanyId && resetCompany(selectedCompanyId)}
                  className={`btn text-xs ${d ? 'btn-secondary btn-secondary-dark' : 'btn-secondary btn-secondary-light'}`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
              <div className="flex items-center gap-2">
                {isDirty && (
                  <span className={`text-xs ${d ? 'text-gray-500' : 'text-gray-400'}`}>
                    Unsaved changes
                  </span>
                )}
                <button onClick={handleSave} className="btn btn-primary text-xs">
                  <Save className="w-3.5 h-3.5" />
                  Save Configuration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
