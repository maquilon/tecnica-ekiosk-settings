## 1. Type & Schema Updates

- [x] 1.1 Add `ServiceType` and `SplashPage` schemas in `src/renderer/types/config.ts`
- [x] 1.2 Update `companySchema` so `serviceType` is an array of `{ key, colorBase }` objects and `slogan` is required
- [x] 1.3 Introduce `KioskConfig` schema that includes `company`, `splashPage`, `branding`, `buttons`, `typography`, `layout`, `session`, `localization`, `metadata`, and `active`
- [x] 1.4 Keep a `legacyCompanyConfigSchema` for migration and export `KioskConfig` TypeScript types
- [x] 1.5 Update `defaultCompanyConfig` to `defaultKioskConfig` with real company values and a `splashPage` block
- [x] 1.6 Update `TabId` to include `splashPage` and remove any JSON-editor-only types

## 2. Store & State Refactor

- [x] 2.1 Replace `companies` array with a single `config: KioskConfig | null` in `useConfigStore.ts`
- [x] 2.2 Remove multi-company actions: `addCompany`, `deleteCompany`, `duplicateCompany`, `toggleActive`, `selectCompany`, `searchQuery`, `sortBy`, `filterActive`
- [x] 2.3 Add `setConfig`, `updateSection`, and `updateCompany` actions
- [x] 2.4 Add service-type CRUD actions: `addServiceType`, `removeServiceType`, `updateServiceType`, `setServiceTypeColor`
- [x] 2.5 Update `loadFromJson` to detect legacy arrays, migrate to `KioskConfig`, and set `currentFilePath`
- [x] 2.6 Update `exportToJson` to serialize the single `KioskConfig` object
- [x] 2.7 Update `getSelectedCompany` to `getConfig` and remove any `selectedCompanyId` usage

## 3. UI Components

- [x] 3.1 Remove `Sidebar.tsx` from the layout (or replace it with a static info panel)
- [x] 3.2 Update `Layout.tsx` to remove company-list dependencies, search, sort, and active-state UI
- [x] 3.3 Update `CompanyTab.tsx` to display the new `slogan` field and a service-type CRUD section
- [x] 3.4 Add a `SplashPageTab.tsx` with a `darkLogo` toggle
- [x] 3.5 Add `SplashPage` to the `TABS` list in `Layout.tsx`
- [x] 3.6 Update `JsonEditorTab.tsx` to validate against `KioskConfig` and the new schema
- [x] 3.7 Update `ThemePreview.tsx` to read from `KioskConfig` instead of the selected company
- [x] 3.8 Update `App.tsx` to use `setConfig` and handle the new single-config format

## 4. Legacy Migration & I/O

- [x] 4.1 Implement `migrateLegacyArray` helper in `src/renderer/types/config.ts` or a new `src/renderer/utils/migrate.ts`
- [x] 4.2 Map legacy `serviceType` string values to default `key`/`colorBase` pairs
- [x] 4.3 Backfill missing new fields (`slogan`, `splashPage`) during migration
- [x] 4.4 Call migration from `loadFromJson` and persist the migrated object to disk
- [x] 4.5 Add error handling for invalid legacy files, falling back to `defaultKioskConfig`

## 5. Default Config & Documentation

- [x] 5.1 Rewrite `tecnicaSystemsKioskSettings.json` to the new single-object format with real company values and sample service types
- [x] 5.2 Update `README.md` to describe the new single-config JSON format and `splashPage` block
- [x] 5.3 Update `package.json` `extraFiles` path if needed (no change expected)
- [x] 5.4 Update `src/main.ts` comments and `CONFIG_FILE_NAME` if the filename changes

## 6. Verification

- [x] 6.1 Run TypeScript checks (`npm run build` or `tsc -p tsconfig.json`)
- [x] 6.2 Verify the new `tecnicaSystemsKioskSettings.json` passes the updated schema
- [ ] 6.3 Test loading an old array file and confirm migration output
- [ ] 6.4 Test adding and removing service type entries in the UI
- [ ] 6.5 Toggle `splashPage.darkLogo` and confirm persistence in the exported JSON
- [x] 6.6 Run `npm run dev` and verify the UI renders with the single-config layout

## 7. Localized Service Type Labels

- [x] 7.1 Update `serviceTypeSchema` to include `title` and `subTitle` records
- [x] 7.2 Update `defaultKioskConfig` service types with `title` / `subTitle` and `defaultLanguage: "es"`
- [x] 7.3 Update `legacyServiceTypeToArray` to backfill `title` / `subTitle` per supported language
- [x] 7.4 Update `CompanyTab.tsx` to edit `title` and `subTitle` for each supported language
- [x] 7.5 Verify `tecnicaSystemsKioskSettings.json` and schema pass validation
