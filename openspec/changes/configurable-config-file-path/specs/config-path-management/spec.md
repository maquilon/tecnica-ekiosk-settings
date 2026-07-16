## ADDED Requirements

### Requirement: Default config path resolution
The system SHALL resolve the default config file path based on the platform and execution context.

#### Scenario: Windows production default path
- **WHEN** the application is running in production mode on Windows
- **THEN** the default config path SHALL be `c:\kiosk001\Office\Htm\Tecnica-eKiosk\tecnicaSystemsKioskSettings.json`

#### Scenario: macOS/Linux production default path
- **WHEN** the application is running in production mode on macOS or Linux
- **THEN** the default config path SHALL be the executable directory with `tecnicaSystemsKioskSettings.json`

#### Scenario: Development default path
- **WHEN** the application is running in development mode
- **THEN** the default config path SHALL be the current working directory with `tecnicaSystemsKioskSettings.json`

### Requirement: Stored config path priority
The system SHALL use a user-stored config path if one exists, before falling back to the default path.

#### Scenario: User has stored config path
- **WHEN** a user has previously stored a config file path in their settings
- **THEN** the system SHALL use the stored path instead of the default path

#### Scenario: No stored config path
- **WHEN** no config file path has been stored in user settings
- **THEN** the system SHALL use the platform-specific default path

### Requirement: Config file existence validation
The system SHALL validate that the config file exists at the resolved path before attempting to load it.

#### Scenario: Config file exists
- **WHEN** the config file exists at the resolved path
- **THEN** the system SHALL proceed to load the config file

#### Scenario: Config file does not exist
- **WHEN** the config file does not exist at the resolved path
- **THEN** the system SHALL prompt the user to select a config file via file picker dialog

### Requirement: Config path storage
The system SHALL store the user-selected config file path in per-user application settings.

#### Scenario: Saving selected config path
- **WHEN** a user selects a config file via the file picker
- **THEN** the system SHALL save the selected file path to the user's application settings

#### Scenario: Per-user storage
- **WHEN** storing the config file path
- **THEN** the system SHALL use the per-user userData directory to allow any user to change the path without admin privileges

### Requirement: Config file selection dialog
The system SHALL provide a file picker dialog to allow users to select the config file when it cannot be found automatically.

#### Scenario: Show file picker on missing config
- **WHEN** the config file is not found at the stored or default path
- **THEN** the system SHALL display a file picker dialog allowing the user to select the config file

#### Scenario: File picker filters
- **WHEN** displaying the file picker dialog
- **THEN** the system SHALL filter for JSON files to help users locate the config file

#### Scenario: Cancel file selection
- **WHEN** the user cancels the file picker dialog
- **THEN** the system SHALL not save a new config path and shall remain in the missing config state

### Requirement: Config path selection IPC handler
The system SHALL provide an IPC handler to allow the renderer process to trigger config file selection.

#### Scenario: Invoke config path selection
- **WHEN** the renderer process sends a `config:selectPath` IPC message
- **THEN** the main process SHALL open the file picker dialog

#### Scenario: Return selected path
- **WHEN** the user selects a file via the file picker
- **THEN** the IPC handler SHALL return the selected file path to the renderer process

#### Scenario: Save path on selection
- **WHEN** the user selects a file via the file picker
- **THEN** the IPC handler SHALL save the selected path to the user's application settings
