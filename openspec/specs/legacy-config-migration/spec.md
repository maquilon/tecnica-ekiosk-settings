## Requirements

### Requirement: Detect legacy array format
When the application loads a JSON array, it SHALL detect the legacy `CompanyConfig[]` format and trigger migration.

#### Scenario: Opening an array file
- **WHEN** the application reads `tecnicaSystemsKioskSettings.json` and parses it as an array
- **THEN** it identifies the legacy format and migrates it to a `KioskConfig` object

### Requirement: Migrate active or first company
The migration SHALL select the legacy entry with `active: true` or the first entry if no active entry exists.

#### Scenario: Migrate active entry
- **WHEN** the legacy array contains an active entry
- **THEN** the application builds a new `KioskConfig` from that entry

#### Scenario: Migrate first entry when none active
- **WHEN** the legacy array contains no active entry
- **THEN** the application builds a new `KioskConfig` from the first entry

### Requirement: Convert legacy service type string
The migration SHALL convert the legacy `company.serviceType` string into a single-entry `serviceType` array with a default color.

#### Scenario: Convert "Deli" service type
- **WHEN** the legacy `serviceType` value is "Deli"
- **THEN** the migrated `KioskConfig.company.serviceType` becomes `[{ "key": "deli", "colorBase": "#3341cb" }]`

### Requirement: Add missing splash page block
The migration SHALL add a `splashPage` block with `darkLogo: false` and fill missing `company` fields with sensible defaults.

#### Scenario: Missing new fields
- **WHEN** a legacy entry lacks `slogan` or `splashPage`
- **THEN** the migration fills `slogan` with the `name` value and sets `splashPage: { "darkLogo": false }`

### Requirement: Persist migrated config
After a successful migration, the application SHALL save the new `KioskConfig` object back to the config file.

#### Scenario: Auto-save after migration
- **WHEN** migration completes and the user has not made changes yet
- **THEN** the migrated config is written to disk, replacing the legacy array
