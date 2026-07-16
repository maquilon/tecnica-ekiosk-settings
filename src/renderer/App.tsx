import { useEffect, useState } from 'react';
import { useConfigStore } from './store/useConfigStore';
import { defaultKioskConfig } from './types/config';
import Layout from './components/Layout';
import ConfigFileDialog from './components/ui/ConfigFileDialog';

export default function App() {
  const { theme, setTheme, setCurrentFilePath, loadFromJson } = useConfigStore();
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const loadConfig = async () => {
    try {
      if (!window.electronAPI) return;
      const settings = await window.electronAPI.getSettings();
      if (settings?.theme) setTheme(settings.theme);

      // Auto-load the config file from the same folder as the .exe
      const configPath = await window.electronAPI.getConfigPath();
      if (configPath) setCurrentFilePath(configPath);

      const content = await window.electronAPI.loadConfig();
      if (content) {
        loadFromJson(content);
      } else {
        setShowConfigDialog(true);
      }
    } catch {}
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleFileSelect = async () => {
    try {
      if (!window.electronAPI) return;
      const selectedPath = await window.electronAPI.selectConfigPath();
      if (selectedPath) {
        setCurrentFilePath(selectedPath);
        setShowConfigDialog(false);
        // Retry loading config after selection
        const content = await window.electronAPI.loadConfig();
        if (content) {
          loadFromJson(content);
        } else {
          loadFromJson(JSON.stringify(defaultKioskConfig));
        }
      }
    } catch {}
  };

  const handleDialogCancel = () => {
    setShowConfigDialog(false);
    loadFromJson(JSON.stringify(defaultKioskConfig));
  };

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.setSettings({ theme });
    }
  }, [theme]);

  return (
    <>
      <Layout />
      <ConfigFileDialog
        open={showConfigDialog}
        onFileSelect={handleFileSelect}
        onCancel={handleDialogCancel}
      />
    </>
  );
}
