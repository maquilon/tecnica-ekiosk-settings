## Context

The application currently uses a hardcoded Windows path (`C:\Tecnica_Systems\Kiosk_Settings`) for the config file, which doesn't match the actual deployment location. The config file needs to be read from `c:\kiosk001\Office\Htm\Tecnica-eKiosk` in production, and different kiosk deployments may require different locations. The current implementation has no mechanism for users to specify a custom config path.

The application uses Electron with a main process (`src/main.ts`) that handles IPC communication with the renderer process. App settings are currently stored per-user in `app.getPath('userData')` for window bounds and theme. The config file itself is read via IPC handlers `config:load` and `config:save`.

## Goals / Non-Goals

**Goals:**
- Allow the config file path to be configurable per-user
- Provide a default path that matches the production deployment location
- Prompt users to select a config file if the default/stored path doesn't exist
- Store the config path in per-user settings (no admin privileges required)
- Maintain backward compatibility for macOS/Linux (executable directory default)

**Non-Goals:**
- System-wide config path storage (intentionally per-user)
- Migration from the old hardcoded path (assumes fresh deployment)
- Settings UI for path changes (deferred to Phase 2)
- Network/shared config file support

## Decisions

### Storage Location: Per-user userData
**Decision:** Store `configFilePath` in the existing `AppSettings` which uses `app.getPath('userData')`.

**Rationale:**
- Allows any user to change the path without admin privileges
- Consistent with existing settings (window bounds, theme)
- Simpler than Windows Registry or ProgramData
- Cross-platform compatible

**Alternatives considered:**
- Windows Registry: Platform-specific, requires admin for writes
- ProgramData folder: Requires admin privileges, overkill for this use case
- Environment variable: Not persistent across reboots unless set at system level

### Default Path Strategy
**Decision:** Use platform-specific defaults:
- Windows: `c:\kiosk001\Office\Htm\Tecnica-eKiosk\tecnicaSystemsKioskSettings.json`
- macOS/Linux: `path.dirname(process.execPath)/tecnicaSystemsKioskSettings.json` (existing behavior)
- Development: `process.cwd()/tecnicaSystemsKioskSettings.json` (existing behavior)

**Rationale:**
- Matches actual production deployment on Windows
- Preserves existing behavior for other platforms
- No breaking changes for non-Windows platforms

### File Picker on Missing Config
**Decision:** Always show file picker dialog when config file is not found at the stored/default path.

**Rationale:**
- Clear user feedback about missing config
- Prevents silent failures
- Allows immediate recovery on first launch
- User explicitly confirmed they want this behavior

**Alternatives considered:**
- Silent fallback to executable directory: Could mask configuration errors
- Create default config file: Risk of creating empty config in wrong location
- Show error and exit: Poor user experience

### IPC Handler Addition
**Decision:** Add new `config:selectPath` handler that opens file picker and saves the selected path.

**Rationale:**
- Separates file selection from config loading
- Reusable for future settings UI (Phase 2)
- Follows existing IPC pattern in the codebase

### Path Resolution Order
**Decision:** Check paths in this order:
1. Stored user path (if exists in settings)
2. Platform-specific default path
3. If neither file exists, show file picker

**Rationale:**
- User preference takes priority
- Provides sensible default for new installations
- Always falls back to user selection if automated resolution fails

## Risks / Trade-offs

### Risk: Config file in read-only location
**Risk:** If user selects a config file in a read-only location (e.g., Program Files), they won't be able to save changes.

**Mitigation:** Document this limitation in Phase 2 when adding settings UI. For now, assume users will select writable locations based on their deployment.

### Risk: Path becomes invalid after selection
**Risk:** User may move/delete the config file after selecting the path, causing the file picker to appear again on next launch.

**Mitigation:** This is acceptable behavior - the file picker allows recovery. Could add "reset to default" option in Phase 2.

### Trade-off: Per-user vs system-wide
**Trade-off:** Per-user storage means each user on a machine must configure the path separately.

**Rationale:** Acceptable for kiosk deployments where typically only one user account is used. System-wide storage would add complexity (admin privileges, Windows service) without clear benefit for this use case.

### Trade-off: No migration from old path
**Trade-off:** Existing installations with config at `C:\Tecnica_Systems\Kiosk_Settings` will need manual migration.

**Rationale:** Assumption is this is for new deployments. If migration is needed, can add a one-time migration check in Phase 2.

## Migration Plan

### Deployment Steps
1. Build and package the application with updated code
2. Deploy to kiosk machines
3. On first launch, application will prompt for config file location via file picker
4. User selects the config file at `c:\kiosk001\Office\Htm\Tecnica-eKiosk\tecnicaSystemsKioskSettings.json`
5. Path is saved per-user and used on subsequent launches

### Rollback Strategy
If issues arise, rollback to previous version which uses the hardcoded path. The old version will continue to look for config at `C:\Tecnica_Systems\Kiosk_Settings`.

## Open Questions

None - design is straightforward based on user requirements.
