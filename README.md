# Serum Plugin

A Claude Code plugin for serum operations.

## Installation

```bash
# Install the plugin
claude plugin install /Users/leobrival/Developer/plugins/serum-plugin
```

## Components

### Commands

| Command | Description |
|---------|-------------|
| `/serum` | Main serum command for plugin operations |

### Agents

| Agent | Description |
|-------|-------------|
| `serum-agent` | Specialized agent for serum plugin operations |

### Skills

| Skill | Description |
|-------|-------------|
| `serum-core` | Core serum skill, auto-invoked for serum-related tasks |

### Hooks

| Event | Description |
|-------|-------------|
| `PreToolUse` | Validates commands before execution |
| `PostToolUse` | Processes files after creation |

## Usage

### Basic Command

```bash
/serum <action>
```

### Available Actions

- `init` - Initialize serum configuration
- `run` - Execute serum workflow
- `status` - Check serum status

### Using the Agent

The serum-agent is automatically available for Task tool invocations:

```
Use the serum-agent to help with serum configuration
```

## Configuration

Create a `serum.config.json` in your project root:

```json
{
  "version": "1.0",
  "settings": {},
  "workflows": []
}
```

## File Structure

```
serum-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── serum.md
├── agents/
│   └── serum-agent.md
├── skills/
│   └── serum-core/
│       └── SKILL.md
├── hooks/
│   ├── hooks.json
│   ├── pre-tool-handler.js
│   └── post-tool-handler.js
└── README.md
```

## Development

### Modifying Commands

Edit `commands/serum.md` to add or modify command behavior.

### Extending the Agent

Edit `agents/serum-agent.md` to update agent capabilities.

### Adding Skills

Create new skill directories under `skills/` with a `SKILL.md` file.

### Customizing Hooks

Modify the handler scripts in `hooks/` to add custom validation or processing.

## License

MIT
