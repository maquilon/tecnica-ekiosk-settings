# tecnica-ekiosk-settings

**Company Configuration Manager for Tecnica Systems**

A desktop application built with Electron + React for managing multi-company kiosk configuration files. It provides a visual UI to create, edit, and maintain the JSON-based settings that drive the Tecnica Systems eKiosk platform.

---

## Purpose

The eKiosk Settings app replaces manual JSON editing with a form-driven interface. Each configuration file (`tecnicaSytemsKioskSettings.json`) stores an array of company profiles that control the look, feel, and behavior of deployed kiosks — including branding colors, typography, button styles, layout options, session timeouts, and localization.

---

## Key Features

- **Multi-company management** — Add, duplicate, delete, and toggle the active state of company profiles from a searchable sidebar. Only one company can be active at a time.
- **Section-based editing** — Eight dedicated tabs cover every aspect of a company's configuration:
  - **Company** — ID, name, display name, domain, support email, service type, timezone, date format, currency.
  - **Branding** — Logo/favicon URLs plus a full color palette (14 color tokens) with inline color pickers.
  - **Buttons** — Primary/secondary button colors, border radius, font weight.
  - **Typography** — Font families, base font size, font scale.
  - **Layout** — Theme mode (dark/light), sidebar style, header behavior, card border radius, container width.
  - **Session** — Idle timeout and idle warning thresholds (seconds).
  - **Localization** — Default language, supported languages, RTL toggle.
  - **Metadata** — Version, created-at, and updated-at timestamps (auto-maintained).
- **Form validation** — All fields are validated in real-time with Zod schemas via `react-hook-form`.
- **Autosave** — Changes are automatically persisted to disk 5 seconds after the last edit (Electron only).
- **Import / Export** — Open or save any JSON file via native OS dialogs, or import/export through the browser file API.
- **Dark / Light theme** — Toggle the editor's own UI theme; preference is persisted across sessions.
- **Window state persistence** — Window size and position are remembered between launches.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | Electron 28 |
| Frontend framework | React 18 |
| Build tool | Vite 5 |
| State management | Zustand |
| Form handling | React Hook Form + Zod |
| Styling | TailwindCSS 3 |
| Icons | Lucide React |
| Notifications | react-hot-toast |
| Language | TypeScript 5 |

---

## Project Structure

```
src/
├── main.ts                    # Electron main process (window, IPC handlers, file I/O)
├── preload.ts                 # Context-bridge API exposed to the renderer
└── renderer/
    ├── App.tsx                # Root component — theme init, auto-load config
    ├── index.tsx              # React entry point
    ├── index.css              # Global & Tailwind styles
    ├── types/
    │   └── config.ts          # Zod schemas, TypeScript types, default values
    ├── store/
    │   └── useConfigStore.ts  # Zustand store — all app state & actions
    ├── components/
    │   ├── Layout.tsx         # Main layout — header, tab bar, action bar
    │   ├── Sidebar.tsx        # Company list — search, sort, filter, CRUD
    │   ├── ThemePreview.tsx   # Live theme preview component
    │   ├── tabs/              # One tab component per config section
    │   │   ├── CompanyTab.tsx
    │   │   ├── BrandingTab.tsx
    │   │   ├── ButtonsTab.tsx
    │   │   ├── TypographyTab.tsx
    │   │   ├── LayoutTab.tsx
    │   │   ├── SessionTab.tsx
    │   │   ├── LocalizationTab.tsx
    │   │   ├── MetadataTab.tsx
    │   │   └── JsonEditorTab.tsx
    │   └── ui/                # Reusable UI primitives
    │       ├── ColorPicker.tsx
    │       ├── ConfirmDialog.tsx
    │       └── FormField.tsx
    └── assets/                # Static assets (logos, images)

tecnicaSytemsKioskSettings.json   # Default config file (loaded automatically)
```

---

## Configuration File Format

The configuration file is a JSON array where each element is a company profile:

```jsonc
[
  {
    "company": { "id": "...", "name": "...", ... },
    "branding": { "primaryColor": "#4285F4", ... },
    "buttons": { ... },
    "typography": { ... },
    "layout": { ... },
    "session": { "idleTimeoutSeconds": 300, "idleWarningSeconds": 60 },
    "localization": { "defaultLanguage": "en", "supportedLanguages": ["en", "es"], "rtl": false },
    "metadata": { "version": "1.0.0", "createdAt": "...", "updatedAt": "..." },
    "active": true
  }
]
```

Only **one** company can be marked `active: true` at a time. The app enforces this constraint automatically.

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** (bundled with Node)

### Install dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

This starts Vite on `http://localhost:5173` and launches the Electron window once the dev server is ready.

### Build for production

```bash
npm run build
```

### Package as distributable

```bash
npm run dist
```

Uses `electron-builder` to create platform-specific installers.

---

## IPC API (Main ↔ Renderer)

The preload script exposes the following methods to the renderer via `window.electronAPI`:

| Method | Description |
|---|---|
| `loadConfig()` | Read the co-located config JSON file |
| `saveConfig(data)` | Write data back to the config file |
| `getConfigPath()` | Get the resolved path of the config file |
| `openFileDialog()` | Open a native file picker and read the selected JSON |
| `saveFileDialog(data, path?)` | Save data via a native save dialog |
| `saveFile(path, data)` | Write data to an arbitrary file path |
| `readFile(path)` | Read an arbitrary file |
| `getSettings()` | Retrieve persisted app settings (theme, window bounds) |
| `setSettings(settings)` | Update persisted app settings |

---

## Workflow

1. **Launch** — The app loads `tecnicaSytemsKioskSettings.json` from the executable's directory (production) or project root (development).
2. **Select** — Pick a company from the sidebar or create a new one.
3. **Edit** — Navigate between the eight configuration tabs and modify fields. Validation feedback appears in real-time.
4. **Save** — Click *Save Configuration* or let autosave handle it. Changes write directly to the config file on disk.
5. **Deploy** — The resulting JSON file is consumed by the eKiosk platform at runtime.
