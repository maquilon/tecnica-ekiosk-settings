## Requirements

### Requirement: Service type is an array of objects
The `KioskConfig.company.serviceType` field SHALL be an array of objects where each object has `key: string` and `colorBase: string`.

#### Scenario: Valid service type array
- **WHEN** the configuration contains `serviceType` with entries `[{ "key": "deli", "colorBase": "#3341cb" }]`
- **THEN** the schema validates the input and the application stores the entries

### Requirement: Service type key is unique
The `key` values within the `serviceType` array SHALL be unique.

#### Scenario: Duplicate key rejected
- **WHEN** a user adds a service type with a key that already exists
- **THEN** the application shows a validation error and does not add the duplicate

### Requirement: Add a service type
The application SHALL allow the user to add a new service type by providing a `key` and `colorBase`.

#### Scenario: Add a service type
- **WHEN** the user clicks "Add service type" and fills in the form
- **THEN** the new `{ key, colorBase }` object is appended to `serviceType`

### Requirement: Remove a service type
The application SHALL allow the user to remove an existing service type.

#### Scenario: Remove a service type
- **WHEN** the user clicks the remove button on a service type entry
- **THEN** the entry is removed from `serviceType`

### Requirement: Edit a service type
The application SHALL allow the user to update the `key` or `colorBase` of an existing service type.

#### Scenario: Update service type color
- **WHEN** the user changes the color input of a service type
- **THEN** the corresponding `colorBase` value is updated in the config

### Requirement: Service type color is a valid hex color
The `colorBase` value SHALL be a valid six-digit hex color prefixed with `#`.

#### Scenario: Invalid color rejected
- **WHEN** a user enters a color that does not match `#RRGGBB`
- **THEN** the application displays a validation error and prevents the change

### Requirement: Service type labels are localized
Each service type SHALL contain `title` and `subTitle` objects keyed by supported language code.

#### Scenario: Service type with localized labels
- **WHEN** the configuration contains a service type with `{ "title": { "en": "...", "es": "..." }, "subTitle": { "en": "...", "es": "..." } }`
- **THEN** the schema validates the input and the UI allows editing each language-specific title and subtitle

### Requirement: Default title and subtitle are provided when adding a service type
When a new service type is added, the application SHALL initialize `title` and `subTitle` records for each supported language.

#### Scenario: Add service type with translations
- **WHEN** the user adds a service type
- **THEN** the new entry contains empty `title` and `subTitle` records for every supported language

### Requirement: Legacy migration backfills title and subtitle
When migrating a legacy service type string, the application SHALL create `title` and `subTitle` records using the supported languages from the legacy config.

#### Scenario: Legacy migration with labels
- **WHEN** a legacy service type value is migrated
- **THEN** the resulting service type contains `title` entries for each supported language and empty `subTitle` entries for each supported language
