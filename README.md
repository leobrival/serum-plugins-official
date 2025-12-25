# Serum Plugins Official

Official Serum plugins for Claude Code including validation, linting and development tools.

## Installation

### From GitHub (recommended)

```bash
# Add the marketplace
/plugin marketplace add leobrival/serum-plugin

# Install the plugin
/plugin install serum-plugin@serum-plugins-official
```

### From local path (development)

```bash
# Clone the repository
git clone https://github.com/leobrival/serum-plugin.git

# Run Claude Code with the plugin loaded
claude --plugin-dir ./serum-plugin/plugins/serum-plugin
```

### Verify installation

```bash
/plugin list
```

## Available Plugins

### serum-plugin

Serum plugin for Claude Code with validation, linting and type checking.

**Features:**

- Command validation before execution
- Lint check after file modifications
- Type check for TypeScript files

## File Structure

```
serum-plugin/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   └── serum-plugin/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/
│       │   └── crawler.md
│       ├── agents/
│       │   └── serum-agent.md
│       ├── hooks/
│       │   └── hooks.json
│       └── scripts/
│           ├── validate-commands.js
│           ├── lint-check.js
│           └── type-check.js
└── README.md
```

## Components

### Commands

| Command | Description |
|---------|-------------|
| `/crawler` | Web crawler command |

### Agents

| Agent | Description |
|-------|-------------|
| `serum-agent` | Specialized agent for serum plugin operations |

### Hooks

| Event | Description |
|-------|-------------|
| `PreToolUse` | Validates commands before execution |
| `PostToolUse` | Lint and type check after file modifications |

## Development

### Adding New Plugins

Create a new directory under `plugins/` with the following structure:

```
plugins/my-new-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
├── agents/
└── README.md
```

Then add the plugin entry to `.claude-plugin/marketplace.json`.

## License

MIT
