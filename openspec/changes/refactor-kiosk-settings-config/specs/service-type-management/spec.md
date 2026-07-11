## ADDED Requirements

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
