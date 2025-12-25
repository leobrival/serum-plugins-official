# Serum Plugins Official

Official Serum plugins for Claude Code - modular tools for crawling and security.

## Installation

### Add the marketplace

```bash
/plugin marketplace add leobrival/serum-plugins-official
```

### Install plugins

```bash
# Install the crawler plugin
/plugin install crawler@serum-plugins-official

# Install hookify (24 security rules, Bun runtime)
/plugin install hookify@serum-plugins-official
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

### hookify

Enhanced hookify with **24 pre-configured security rules** - uses Bun runtime, no Python required.

**Features:**

- 20 Bash security rules (block/warn dangerous commands)
- 4 File editing rules (secrets detection, debug code, TODOs)
- Simple markdown format for custom rules
- Commands: `/hookify`, `/hookify:list`, `/hookify:configure`
- **Bun runtime** - Fast TypeScript execution, no dependencies

**Quick example:**

```bash
/hookify Block npm publish commands
```

## File Structure

```
serum-plugins-official/
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
│   └── hookify/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── core/              # TypeScript rule engine
│       │   ├── types.ts
│       │   ├── config-loader.ts
│       │   └── rule-engine.ts
│       ├── hooks/             # Bun hooks
│       │   ├── hooks.json
│       │   ├── pretooluse.ts
│       │   ├── posttooluse.ts
│       │   ├── stop.ts
│       │   └── userpromptsubmit.ts
│       ├── commands/
│       ├── rules/             # 24 pre-configured security rules
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
