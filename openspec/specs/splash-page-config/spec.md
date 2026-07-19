## Requirements

### Requirement: Splash page block is supported
The `KioskConfig` object SHALL contain a top-level `splashPage` object with a `darkLogo: boolean` field.

#### Scenario: Valid splash page block
- **WHEN** the configuration contains `splashPage: { "darkLogo": false }`
- **THEN** the schema validates the input and the application stores the value

### Requirement: Edit dark logo toggle
The application SHALL provide a UI toggle for the `splashPage.darkLogo` field.

#### Scenario: Toggle dark logo
- **WHEN** the user toggles the "Dark logo" switch in the Splash Page tab
- **THEN** the `splashPage.darkLogo` value in the config is updated

### Requirement: Splash page defaults to dark logo off
When a new configuration is created, the `splashPage.darkLogo` value SHALL default to `false`.

#### Scenario: New configuration default
- **WHEN** the user creates a new configuration
- **THEN** `splashPage.darkLogo` is initialized to `false`
