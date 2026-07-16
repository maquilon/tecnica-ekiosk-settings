## 1. Main Process Updates

- [x] 1.1 Add `dialog` import from electron in main.ts
- [x] 1.2 Update `AppSettings` interface to include `configFilePath?: string` field
- [x] 1.3 Remove hardcoded `CONFIG_DIR_WIN` constant
- [x] 1.4 Update `CONFIG_FILE_PATH` resolution logic to use platform-specific defaults (Windows: `c:\kiosk001\Office\Htm\Tecnica-eKiosk`, others: executable directory)
- [x] 1.5 Create `getConfigPath()` function that checks stored path first, then default path
- [x] 1.6 Update `config:load` IPC handler to validate file existence before loading
- [x] 1.7 Add `config:selectPath` IPC handler that opens file picker and saves selected path
- [x] 1.8 Add file picker dialog with JSON filter for config selection
- [x] 1.9 Update `config:save` IPC handler to use the resolved config path

## 2. Renderer Process Updates

- [x] 2.1 Add TypeScript type for `config:selectPath` IPC call in preload.ts
- [x] 2.2 Add file picker dialog UI component for when config is not found
- [x] 2.3 Implement config loading logic that checks for null response and shows file picker
- [x] 2.4 Add retry logic after user selects config file via file picker

## 3. Testing

- [ ] 3.1 Test default path resolution on Windows production build
- [ ] 3.2 Test default path resolution on macOS/Linux production build
- [ ] 3.3 Test default path resolution in development mode
- [ ] 3.4 Test stored config path priority (stored path used over default)
- [ ] 3.5 Test file picker dialog when config file not found
- [ ] 3.6 Test config path storage and retrieval across app restarts
- [ ] 3.7 Test cancel behavior in file picker dialog
- [ ] 3.8 Test config loading after selecting valid file via picker
