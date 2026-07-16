## Why

The current implementation uses a hardcoded path (`C:\Tecnica_Systems\Kiosk_Settings`) for the config file on Windows, which doesn't match the actual deployment location (`c:\kiosk001\Office\Htm\Tecnica-eKiosk`). This causes the application to fail to find the config file on first launch. Additionally, different kiosk deployments may require different config file locations, so a fixed path is not flexible enough for production use.

## What Changes

- **BREAKING**: Remove hardcoded `C:\Tecnica_Systems\Kiosk_Settings` path on Windows
- Add `configFilePath` field to `AppSettings` interface to store user-selected config path per-user
- Change default Windows config path to `c:\kiosk001\Office\Htm\Tecnica-eKiosk\tecnicaSystemsKioskSettings.json`
- Implement startup logic that checks if config file exists at stored/default path
- Add file picker dialog to prompt user to select config file when not found
- Add new IPC handler `config:selectPath` for file selection and path storage
- Store config path in per-user `userData` location (not system-wide) to allow any user to change it without admin privileges

## Capabilities

### New Capabilities
- `config-path-management`: Manages the path to the tecnicaSystemsKioskSettings.json file, including default path resolution, file existence validation, user file selection, and per-user path storage

### Modified Capabilities
- None (no existing spec-level requirement changes)

## Impact

- **Code affected**: `src/main.ts` (config path resolution, new IPC handlers), renderer components (file picker UI)
- **API changes**: New IPC handler `config:selectPath`, modified `config:load` to handle missing files
- **Dependencies**: None (uses existing Electron `dialog` API)
- **User experience**: First launch will show file picker dialog if config not found at default location; subsequent launches use stored path
