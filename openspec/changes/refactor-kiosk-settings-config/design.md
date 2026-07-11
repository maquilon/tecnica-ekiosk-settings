## Context

The application currently stores the configuration as an array of `CompanyConfig` objects. The `Sidebar` lets users switch, add, duplicate, and delete companies; the `active` flag marks the one company that should be used at runtime. The `serviceType` field is a string enum limited to `Deli`, `Food`, and `Coffee`.

The new product model treats the file as a single kiosk configuration per deployment. The `company` block now carries richer identity fields, `serviceType` becomes an array of service-type options, and a `splashPage` block is introduced. The UI must be simplified from multi-company to single-config and must support CRUD on the service type array.

## Goals / Non-Goals

**Goals:**
- Replace the array-based store with a single `KioskConfig` object.
- Update all schemas, types, and defaults to match the new shape.
- Convert `serviceType` into an array of `{ key, colorBase }` with add/remove/edit UI.
- Add `splashPage` support to the schema and editing UI.
- Remove the multi-company sidebar, list, and active-company toggles.
- Keep the existing eight-section tab layout and visual theme.
- Migrate legacy array files on load.

**Non-Goals:**
- Support both old and new formats side-by-side indefinitely (migration is one-time on load).
- Add server-side persistence or APIs.
- Introduce new external dependencies.

## Decisions

- **Single config object, not a single-item array**: `KioskConfig` is the top-level type; it contains `company`, `branding`, `buttons`, `typography`, `layout`, `session`, `localization`, `metadata`, `splashPage`, and `active`. This directly matches the new JSON contract.
- **Store simplification**: `useConfigStore` will hold a single `config: KioskConfig | null` instead of `companies: CompanyConfig[]`. Remove `selectedCompanyId`, `addCompany`, `deleteCompany`, `duplicateCompany`, `toggleActive`, `searchQuery`, `sortBy`, `filterActive`, and `getFilteredCompanies`. `updateCompany` is replaced by generic `updateSection(section, data)` and service-type-specific actions.
- **Service type CRUD**: `serviceType` lives in the `company` section. The store exposes `addServiceType()`, `removeServiceType(key)`, `updateServiceType(key, data)`, and `moveServiceType(from, to)`. This avoids mutating the whole config for one array change.
- **UI placement**: Service type management stays in `CompanyTab.tsx` as a new subsection with key/color inputs. A `SplashPage` tab is added as a dedicated tab for `splashPage.darkLogo` and any future splash settings. Tabs are not overloaded with service type editing.
- **Migration strategy**: `loadFromJson()` tries to parse `legacyCompanyConfigSchema.array()` first. If it matches, it takes the active (or first) entry, wraps it into `KioskConfig`, and backfills sensible defaults for missing new fields (`name`, `slogan`, `displayName`, `splashPage`).
- **Validation**: All schemas remain in `src/renderer/types/config.ts`. Use `z.intersection` or `z.object` to keep the legacy schema for migration only.
- **Export**: `exportToJson()` serializes the single `KioskConfig` object. The file extension and name remain `tecnicaSystemsKioskSettings.json`.

## Risks / Trade-offs

- **Risk** — Existing users with multiple companies in the JSON file will lose the inactive companies during migration.  
  → **Mitigation**: Document that only the active (or first) company is preserved; ask users to export separate files before upgrading.
- **Risk** — `serviceType` changes from a string to an array; downstream eKiosk consumers may depend on the old string.  
  → **Mitigation**: This is a coordinated contract change. The settings app will not emit the old string; any runtime compatibility must be handled on the eKiosk side.
- **Risk** — Removing the sidebar reduces the screen real estate for the Tecnica logo.  
  → **Mitigation**: Keep the logo in the header or the company tab. This is a UI polish step.
- **Risk** — Legacy migration could fail on malformed files.  
  → **Mitigation**: Catch errors and fall back to the default `defaultKioskConfig`. Surface a toast explaining the migration failure.

## Migration Plan

1. Load the JSON from the existing config path.
2. Detect whether the parsed value is an array.
3. If it is an array, validate it as a legacy `CompanyConfig[]`.
4. Select the active entry, or the first entry if none is active.
5. Build a `KioskConfig` by preserving `company`, `branding`, `buttons`, `typography`, `layout`, `session`, `localization`, `metadata`, and `active`, and adding `splashPage: { darkLogo: false }` and updated `company` fields.
6. Convert `serviceType` string into a single-entry array `[{ key: legacy, colorBase: '#3341cb' }]` using a lookup table for the default color.
7. Save the migrated object back to the config file so the legacy format is no longer loaded.
8. Rollback: restore the previous JSON file from backup or version control.

## Open Questions

- Do the downstream eKiosk clients use `serviceType` as a string today, or can they be updated in the same release? (Assumed: yes, this is a coordinated contract change.)
- Should `company.slogan` be required or optional in the Zod schema? (Assumed: required for now, with an empty default for migration.)
- Should a service type `key` be unique within the array? (Assumed: yes, enforced by schema and UI.)
