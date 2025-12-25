# Hookify Enhanced

Enhanced version of hookify with **24 pre-configured security rules** based on battle-tested validation patterns from production systems.

## Key Differences from Original Hookify

| Feature | Original Hookify | This Version |
|---------|-----------------|--------------|
| Pre-configured rules | 4 examples | **24 ready-to-use rules** |
| Bash security | Basic examples | Complete coverage (rm, sudo, disk, network) |
| File security | Basic examples | Secrets detection, debug code, TODOs |
| Installation | Manual rule creation | Works out-of-the-box |

## Quick Start

```bash
# Add marketplace
/plugin marketplace add leobrival/serum-plugins-official

# Install hookify
/plugin install hookify@serum-plugins-official
```

**That's it!** All 24 security rules are active immediately.

## Pre-configured Rules (24 total)

### Bash Commands - Block (16 rules)

| Rule | Pattern | Description |
|------|---------|-------------|
| rm -rf | `rm\s+-rf` | Recursive force delete |
| rm wildcard | `rm\s+.*\/\*$` | Delete all files in directory |
| rm -f wildcard | `rm\s+-f.*\/\*$` | Force delete wildcard |
| dd | `dd\s+if=` | Direct disk access |
| mkfs | `mkfs\.` | Filesystem creation |
| fdisk | `fdisk` | Disk partitioning |
| format | `format\s+` | Format command |
| sudo | `sudo\s+` | Privilege escalation |
| su | `su\s+` | User switching |
| chmod 777 | `chmod\s+777` | Unsafe permissions |
| chmod system | `chmod\s+\+x\s+\/usr` | System permission change |
| chown root | `chown\s+root` | Ownership to root |
| eval/exec | `(eval\s*\(|exec\s*\()` | Code execution |
| curl pipe | `curl.*\|\s*(sh\|bash)` | Remote code execution |
| wget pipe | `wget.*\|\s*(sh\|bash)` | Remote code execution |
| /etc/shadow | `\/etc\/shadow` | Shadow file access |
| system binary | `\/usr\/bin\/.*\s+>` | System binary modification |

### Bash Commands - Warn (3 rules)

| Rule | Pattern | Description |
|------|---------|-------------|
| /etc/passwd | `\/etc\/passwd` | Password file access |
| /System/ | `\/System\/` | macOS system directory |
| path traversal | `\.\.\/` | Parent directory access |

### File Editing (4 rules)

| Rule | Action | Description |
|------|--------|-------------|
| console.log | warn | Debug logging detected |
| hardcoded secrets | **block** | API keys, passwords in code |
| TODO/FIXME | warn | Pending work markers |
| debugger | warn | Debug statements |

## Usage

### List active rules

```bash
/hookify:list
```

### Create custom rule from conversation

```bash
/hookify
```

Analyzes your conversation and suggests rules based on behaviors you've corrected.

### Create rule from description

```bash
/hookify Block npm publish commands
```

### Configure rules interactively

```bash
/hookify:configure
```

## Customization

All rules are in `plugins/hookify/rules/` directory as markdown files.

### Disable a rule

Edit the rule file and set `enabled: false`:

```yaml
---
name: block-rm-rf
enabled: false  # Disabled
...
---
```

### Change action (block to warn)

```yaml
---
name: warn-sudo
enabled: true
event: bash
pattern: sudo\s+
action: warn  # Changed from block
---
```

### Add custom rule

Create `.claude/hookify.my-rule.local.md`:

```markdown
---
name: my-custom-rule
enabled: true
event: bash
pattern: my-dangerous-command
action: block
---

**My custom warning message**

Explanation and alternatives here.
```

## Rule Format Reference

### Simple Rule

```markdown
---
name: rule-name
enabled: true
event: bash|file|stop|prompt|all
pattern: regex-pattern
action: block|warn
---

Message shown when rule triggers.
```

### Advanced Rule (Multiple Conditions)

```markdown
---
name: rule-name
enabled: true
event: file
tool_matcher: Edit|Write
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.tsx?$
  - field: content
    operator: contains
    pattern: API_KEY
action: block
---

Message shown when ALL conditions match.
```

### Operators

- `regex_match`: Pattern must match
- `contains`: String contains pattern
- `equals`: Exact match
- `not_contains`: String must NOT contain pattern
- `starts_with`: String starts with pattern
- `ends_with`: String ends with pattern

### Fields

**Bash events:** `command`

**File events:** `file_path`, `new_text`, `old_text`, `content`

**Prompt events:** `user_prompt`

**Stop events:** `transcript`, `reason`

## Technical Details

### Runtime

Uses **Bun** instead of Python:
- Faster startup time (~10ms vs ~100ms)
- No Python installation required
- TypeScript support out of the box

### File Structure

```
hookify/
├── core/
│   ├── types.ts            # TypeScript interfaces
│   ├── config-loader.ts    # Rule file parser
│   └── rule-engine.ts      # Rule evaluator
├── hooks/
│   ├── hooks.json          # Hook configuration (uses bun)
│   ├── pretooluse.ts
│   ├── posttooluse.ts
│   ├── stop.ts
│   └── userpromptsubmit.ts
├── rules/                  # 24 pre-configured rules
└── commands/               # /hookify commands
```

## Requirements

- Bun (bundled with Claude Code)

## License

MIT - Based on hookify by Anthropic, enhanced with Bun runtime and comprehensive security rules.
