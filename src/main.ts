import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

const SETTINGS_PATH = path.join(app.getPath('userData'), 'app-settings.json');

// The config JSON file lives next to the .exe in production, or the project root in dev.
const CONFIG_FILE_NAME = 'tecnicaSystemsKioskSettings.json';

// Get the default config path based on platform and execution context
function getDefaultConfigPath(): string {
  if (isDev) {
    return path.join(process.cwd(), CONFIG_FILE_NAME);
  }
  
  if (process.platform === 'win32') {
    return path.join('c:\\kiosk001\\Office\\Htm\\Tecnica-eKiosk', CONFIG_FILE_NAME);
  }
  
  return path.join(path.dirname(process.execPath), CONFIG_FILE_NAME);
}

// Get the config path, checking stored user path first, then default
function getConfigPath(): string {
  const settings = loadSettings();
  if (settings.configFilePath) {
    return settings.configFilePath;
  }
  return getDefaultConfigPath();
}

interface AppSettings {
  lastFilePath?: string;
  windowBounds?: { width: number; height: number; x?: number; y?: number };
  theme?: 'dark' | 'light';
  configFilePath?: string;
}

function loadSettings(): AppSettings {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
    }
  } catch {}
  return {};
}

function saveSettings(settings: AppSettings) {
  try {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');
  } catch {}
}

function createWindow() {
  const settings = loadSettings();
  const bounds = settings.windowBounds || { width: 1400, height: 900 };

  mainWindow = new BrowserWindow({
    ...bounds,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#000000',
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('close', () => {
    if (mainWindow) {
      const currentBounds = mainWindow.getBounds();
      const currentSettings = loadSettings();
      saveSettings({ ...currentSettings, windowBounds: currentBounds });
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// --- IPC Handlers ---

ipcMain.handle('file:save', async (_event, filePath: string, data: string) => {
  fs.writeFileSync(filePath, data, 'utf-8');
  return true;
});

ipcMain.handle('file:read', async (_event, filePath: string) => {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
});

ipcMain.handle('settings:get', async () => {
  return loadSettings();
});

ipcMain.handle('settings:set', async (_event, settings: Partial<AppSettings>) => {
  const current = loadSettings();
  saveSettings({ ...current, ...settings });
  return true;
});

// Returns the resolved path to the config file
ipcMain.handle('config:getPath', async () => {
  return getConfigPath();
});

// Auto-load the config file at the known path
ipcMain.handle('config:load', async () => {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) return null;
  return fs.readFileSync(configPath, 'utf-8');
});

// Save directly to the config file
ipcMain.handle('config:save', async (_event, data: string) => {
  const configPath = getConfigPath();
  fs.writeFileSync(configPath, data, 'utf-8');
  return true;
});

// Open file picker to select config file path
ipcMain.handle('config:selectPath', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Select Config File',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  
  if (canceled || !filePaths.length) return null;
  
  const selectedPath = filePaths[0];
  const settings = loadSettings();
  saveSettings({ ...settings, configFilePath: selectedPath });
  
  return selectedPath;
});
