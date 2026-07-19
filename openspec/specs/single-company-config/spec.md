## Requirements

### Requirement: Configuration is a single object
The settings application SHALL treat the loaded JSON as a single `KioskConfig` object instead of an array of company profiles.

#### Scenario: Loading a valid single-config JSON
- **WHEN** the application reads a JSON object matching the `KioskConfig` schema
- **THEN** it stores the object and renders the configuration tabs

### Requirement: Single active configuration
The `KioskConfig` object SHALL contain an `active` boolean at the top level.

#### Scenario: Config is active
- **WHEN** `KioskConfig.active` is `true`
- **THEN** the application marks the configuration as active

### Requirement: Company identity fields are real values
The `KioskConfig.company` fields `name`, `displayName`, `slogan`, `domain`, and `supportEmail` SHALL contain meaningful default values and be validated as required strings.

#### Scenario: Editing company identity
- **WHEN** a user fills the company identity fields
- **THEN** the application validates the inputs and persists the updated `company` block

### Requirement: Remove multi-company UI
The application SHALL no longer display a company list, add/duplicate/delete buttons, or active-state toggles for multiple companies.

#### Scenario: Sidebar after refactor
- **WHEN** the application loads the configuration editor
- **THEN** the sidebar shows only the single-company navigation or is removed
