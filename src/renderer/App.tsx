import { useEffect } from 'react';
import { useConfigStore } from './store/useConfigStore';
import Layout from './components/Layout';

export default function App() {
  const { theme, setTheme, setCompanies, setCurrentFilePath, loadFromJson } =
    useConfigStore();

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

  useEffect(() => {
    (async () => {
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
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.setSettings({ theme });
    }
  }, [theme]);

  return <Layout />;
}
