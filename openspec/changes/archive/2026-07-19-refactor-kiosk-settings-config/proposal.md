## Why

The `tecnicaSystemsKioskSettings.json` format is being refactored from a multi-company array into a single-company object, and the `serviceType` field is changing from a single string to an array of service-type objects. The Tecnica eKiosk Settings application must be updated to read, validate, edit, and persist the new format, while keeping the UI aligned with the new configuration model.

## What Changes

- **BREAKING** — Change the config file root from an array of company profiles to a single configuration object.
- **BREAKING** — Remove the multi-company sidebar, company list, and active-state toggling across multiple entries.
- **BREAKING** — Convert `serviceType` from a single enum string (`Deli`, `Food`, `Coffee`) into an array of `{ key: string, colorBase: string }` objects.
- Add a new `splashPage` top-level section with `darkLogo: boolean`.
- Update `company` fields to use real values for `name`, `displayName`, `slogan`, `domain`, and `supportEmail`.
- Update Zod schemas, TypeScript types, and the Zustand store to support the single-config model and the new `serviceType` array.
- Add a UI for adding, removing, and editing `serviceType` entries in the `Company` tab.
- Add backward-compatible loading that detects an old array file and migrates it to the new single-object shape.

## Capabilities

### New Capabilities

- `single-company-config`: The JSON file is a single object, not an array, and the app no longer manages multiple company profiles.
- `service-type-management`: `serviceType` is an array of objects with `key` and `colorBase`; users can add, remove, and edit entries.
- `splash-page-config`: A new `splashPage` block with a `darkLogo` boolean is supported in the schema and UI.
- `legacy-config-migration`: The app can load a legacy multi-company array, pick the active (or first) entry, and convert it to the new single-object format.

### Modified Capabilities

- None. Existing capabilities are not being extended; the data model is being replaced.

## Impact

- `src/renderer/types/config.ts` — schemas and types
- `src/renderer/store/useConfigStore.ts` — state, persistence, and CRUD actions
- `src/renderer/components/Sidebar.tsx` — remove multi-company list
- `src/renderer/components/tabs/CompanyTab.tsx` — service type CRUD
- `src/renderer/components/tabs/Layout.tsx` — update header/empty states
- `tecnicaSystemsKioskSettings.json` — new default shape
- `README.md` — updated documentation
