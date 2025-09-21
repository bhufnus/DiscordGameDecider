# Project Structure

This Discord bot follows a modular, scalable architecture that separates concerns and makes the codebase maintainable.

## Directory Structure

```
DiscordGameDecider/
├── src/                          # Source code directory
│   ├── commands/                 # Command handlers
│   │   ├── index.js             # Command exports and routing
│   │   ├── add.js               # Add game command
│   │   ├── games.js             # List games command
│   │   ├── start.js             # Start tournament command
│   │   ├── status.js            # Tournament status command
│   │   ├── reset.js             # Reset tournament command
│   │   ├── help.js              # Help command
│   │   └── debug.js             # Debug command
│   ├── events/                   # Discord event handlers
│   │   ├── ready.js             # Bot ready event
│   │   └── messageCreate.js     # Message handling event
│   ├── models/                   # Data models and classes
│   │   └── Tournament.js        # Tournament logic class
│   └── utils/                    # Utility functions
│       └── tournamentManager.js # Tournament management utilities
├── config.js                     # Configuration settings
├── index.js                      # Main application entry point
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## Architecture Overview

### Entry Point (`index.js`)

- Initializes the Discord client
- Loads event handlers dynamically
- Sets up global error handlers
- Manages the tournament instance
- Handles bot login

### Commands (`src/commands/`)

Each command is a separate module that:

- Handles user input validation
- Processes the command logic
- Sends appropriate responses
- Maintains separation of concerns

**Available Commands:**

- `!add <game>` - Add a game to the tournament
- `!games` / `!list` - List all entered games
- `!start` - Start the tournament
- `!status` - Check tournament status
- `!reset` - Reset the tournament
- `!help` - Show help information
- `!debug` - Show debug information

### Events (`src/events/`)

Event handlers manage Discord interactions:

- `ready.js` - Bot startup and initialization
- `messageCreate.js` - Message processing and command routing

### Models (`src/models/`)

Data structures and business logic:

- `Tournament.js` - Core tournament logic, bracket management, and game progression

### Utils (`src/utils/`)

Utility functions and shared logic:

- `tournamentManager.js` - Tournament round management, poll creation, and vote handling

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Scalability**: Easy to add new commands or features
3. **Maintainability**: Clear separation makes debugging easier
4. **Testability**: Individual modules can be tested in isolation
5. **Readability**: Code organization follows industry standards
6. **Error Handling**: Comprehensive error handling at all levels

## Adding New Features

### Adding a New Command

1. Create a new file in `src/commands/`
2. Export a handler function
3. Add the command to `src/commands/index.js`
4. Update the command routing in `src/events/messageCreate.js`

### Adding New Events

1. Create a new file in `src/events/`
2. Follow the event handler pattern
3. The main `index.js` will automatically load it

### Adding New Utilities

1. Create files in `src/utils/`
2. Export functions as needed
3. Import where required

## Configuration

All configuration is centralized in `config.js` for easy management and environment-specific settings.
