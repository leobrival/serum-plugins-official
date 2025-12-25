# Serum Plugins Official

Official Serum plugins for Claude Code - modular tools for crawling, security, and development workflows.

## Installation

### Add the marketplace

```bash
/plugin marketplace add leobrival/serum-plugin
```

### Install plugins

```bash
# Install the crawler plugin
/plugin install crawler@serum-plugins-official

# Install security hooks
/plugin install security-hooks@serum-plugins-official
```

### Verify installation

```bash
/plugin list
```

## Available Plugins

### crawler

High-performance web crawler for discovering and mapping website structure.

**Features:**

- Sitemap discovery and parsing
- Checkpoint/resume support
- Rate limiting
- HTML report generation

**Usage:**

```bash
/crawler https://example.com
```

### security-hooks

Security validation hooks with command validation, linting and type checking.

**Features:**

- PreToolUse: Blocks dangerous commands (rm -rf, sudo, etc.)
- PostToolUse: Automatic Biome linting on JS/TS files
- PostToolUse: TypeScript type checking

## File Structure

```
serum-plugin/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   ├── crawler/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   └── crawler.md
│   │   ├── scripts/
│   │   └── README.md
│   └── security-hooks/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── hooks/
│       │   └── hooks.json
│       ├── scripts/
│       │   ├── validate-commands.js
│       │   ├── lint-check.js
│       │   └── type-check.js
│       └── README.md
└── README.md
```

## Development

### Adding New Plugins

Create a new directory under `plugins/` with the following structure:

```
plugins/my-new-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
├── agents/
├── hooks/
└── README.md
```

Then add the plugin entry to `.claude-plugin/marketplace.json`.

## License

MIT
