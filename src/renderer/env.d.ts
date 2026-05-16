/// <reference types="vite/client" />

interface ElectronAPI {
  saveFileDialog: (data: string, filePath?: string) => Promise<string | null>;
  openFileDialog: () => Promise<{ filePath: string; content: string } | null>;
  saveFile: (filePath: string, data: string) => Promise<boolean>;
  readFile: (filePath: string) => Promise<string | null>;
  getSettings: () => Promise<{
    lastFilePath?: string;
    windowBounds?: { width: number; height: number; x?: number; y?: number };
    theme?: 'dark' | 'light';
  }>;
  setSettings: (settings: Record<string, unknown>) => Promise<boolean>;
  getConfigPath: () => Promise<string>;
  loadConfig: () => Promise<string | null>;
  saveConfig: (data: string) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
