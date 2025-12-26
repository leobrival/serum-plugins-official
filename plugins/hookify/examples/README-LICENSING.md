# Serum Plugins License System

## Overview

Serum Plugins uses a GitHub Gist-based license validation system. This allows remote control of plugin installations without requiring a dedicated server.

**Key feature:** When a license is revoked, the **entire marketplace** is automatically uninstalled (all plugins: hookify, crawler, media-tools).

## How It Works

```
┌─────────────────────┐     ┌─────────────────────────────┐
│  Claude Code Start  │────▶│  Notification Hook          │
└─────────────────────┘     │  (hooks/notification.ts)    │
                            └──────────────┬──────────────┘
                                           │
                                           ▼
                            ┌─────────────────────────────┐
                            │  Read License Key           │
                            │  - $SERUM_LICENSE_KEY       │
                            │  - ~/.config/serum/license  │
                            └──────────────┬──────────────┘
                                           │
                                           ▼
                            ┌─────────────────────────────┐
                            │  Fetch Gist Config          │
                            │  (gist.github.com/leobrival)│
                            └──────────────┬──────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
            ┌───────────┐          ┌───────────┐          ┌───────────┐
            │  ACTIVE   │          │  REVOKED  │          │  EXPIRED  │
            │  Allow    │          │  AUTO     │          │  Warning  │
            │           │          │  UNINSTALL│          │           │
            │           │          │  ALL      │          │           │
            └───────────┘          └───────────┘          └───────────┘
```

## Setup for Administrators

### 1. Create GitHub Gist

Create a **public** Gist named `serum-licenses.json` at:
https://gist.github.com/leobrival

Use the format from `examples/serum-licenses.json`.

### 2. Get Raw URL

After creating the Gist, get the raw URL:
```
https://gist.githubusercontent.com/leobrival/{GIST_ID}/raw/serum-licenses.json
```

### 3. Update license-checker.ts

Update `GIST_CONFIG_URL` in `core/license-checker.ts` with your Gist URL.

## Setup for Customers

### Option 1: Environment Variable

```bash
export SERUM_LICENSE_KEY="sk_live_your_license_key"
```

Add to shell profile (`~/.zshrc` or `~/.bashrc`).

### Option 2: Config File

Create `~/.config/serum/license.json`:

```json
{
  "license_key": "sk_live_your_license_key"
}
```

## License Statuses

| Status | Action | Description |
|--------|--------|-------------|
| `active` | Allow | Normal operation |
| `suspended` | Warn | Payment issue, still works |
| `expired` | Warn | License expired, renew prompt |
| `revoked` | **Auto-uninstall** | Plugin removes itself |

## Revoking a License

To revoke a license and force uninstall the **entire marketplace**:

1. Edit your Gist
2. Change the license status to `"revoked"`
3. Optionally add a message explaining why

```json
{
  "sk_live_bad_customer": {
    "status": "revoked",
    "customer": "Bad Customer",
    "message": "License terminated for ToS violation."
  }
}
```

Next time the customer starts Claude Code:
- All plugins will be automatically uninstalled (hookify, crawler, media-tools)
- The marketplace itself will be removed
- All associated hooks will be cleaned up
- User will see a message asking to restart Claude Code

## Caching

- License config is cached for 1 hour
- Cache location: `~/.config/serum/.license-cache.json`
- If Gist is unreachable, cached config is used as fallback

## Security Considerations

1. **Gist must be public** - Private gists require authentication
2. **License keys should be random** - Use UUIDs or secure random strings
3. **Consider HTTPS** - Gist uses HTTPS by default
4. **Fail-open design** - If server unreachable, plugin continues working

## Enterprise Features (Future)

- [ ] Private license server
- [ ] Seat tracking (machine IDs)
- [ ] Usage analytics
- [ ] Remote configuration push
- [ ] Feature flags per customer
