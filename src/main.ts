import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

const SETTINGS_PATH = path.join(app.getPath('userData'), 'app-settings.json');

// The config JSON file lives next to the .exe in production, or the project root in dev.
const CONFIG_FILE_NAME = 'tecnicaSytemsKioskSettings.json';
const CONFIG_FILE_PATH = isDev
  ? path.join(process.cwd(), CONFIG_FILE_NAME)
  : path.join(path.dirname(process.execPath), CONFIG_FILE_NAME);

interface AppSettings {
  lastFilePath?: string;
  windowBounds?: { width: number; height: number; x?: number; y?: number };
  theme?: 'dark' | 'light';
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
    titleBarStyle: 'hiddenInset',
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

ipcMain.handle('dialog:saveFile', async (_event, data: string, filePath?: string) => {
  if (!filePath) {
    const result = await dialog.showSaveDialog(mainWindow!, {
      title: 'Save Configuration',
      defaultPath: 'company-config.json',
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
    });
    if (result.canceled || !result.filePath) return null;
    filePath = result.filePath;
  }
  fs.writeFileSync(filePath, data, 'utf-8');
  const settings = loadSettings();
  saveSettings({ ...settings, lastFilePath: filePath });
  return filePath;
});

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    title: 'Open Configuration',
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
    properties: ['openFile'],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  const fp = result.filePaths[0];
  const content = fs.readFileSync(fp, 'utf-8');
  const settings = loadSettings();
  saveSettings({ ...settings, lastFilePath: fp });
  return { filePath: fp, content };
});

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
  return CONFIG_FILE_PATH;
});

// Auto-load the config file at the known path
ipcMain.handle('config:load', async () => {
  if (!fs.existsSync(CONFIG_FILE_PATH)) return null;
  return fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
});

// Save directly to the config file
ipcMain.handle('config:save', async (_event, data: string) => {
  fs.writeFileSync(CONFIG_FILE_PATH, data, 'utf-8');
  return true;
});
