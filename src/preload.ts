import { contextBridge, ipcRenderer } from 'electron';

const electronAPI = {
  saveFile: (filePath: string, data: string) =>
    ipcRenderer.invoke('file:save', filePath, data),
  readFile: (filePath: string) => ipcRenderer.invoke('file:read', filePath),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSettings: (settings: Record<string, unknown>) =>
    ipcRenderer.invoke('settings:set', settings),
  getConfigPath: () => ipcRenderer.invoke('config:getPath'),
  loadConfig: () => ipcRenderer.invoke('config:load'),
  saveConfig: (data: string) => ipcRenderer.invoke('config:save', data),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;
