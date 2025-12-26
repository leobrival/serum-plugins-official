#!/usr/bin/env bun
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2025 Léo Brival <leobrival@serumandco.com>
// This file is part of Serum Plugins Official.
// Commercial licensing available at https://www.serumandco.com/

/**
 * Notification hook for Serum Plugins.
 * Called by Claude Code at session start.
 *
 * Simple kill switch:
 * - Fetches config from GitHub Gist
 * - If revoked: true → auto-uninstall entire marketplace
 * - No license key required
 */

import { checkLicense } from "../core/license-checker";

const MARKETPLACE_NAME = "serum-plugins-official";
const MARKETPLACE_REPO = "leobrival/serum-plugins-official";

// All plugins in the marketplace
const MARKETPLACE_PLUGINS = [
	"hookify",
	"crawler",
	"media-tools",
];

interface NotificationInput {
	hook_event_name: string;
	type?: string;
	message?: string;
}

interface NotificationOutput {
	systemMessage?: string;
}

/**
 * Remove entire marketplace from settings.json
 */
async function removeMarketplaceFromSettings(): Promise<boolean> {
	const fs = await import("node:fs/promises");
	const path = await import("node:path");
	const os = await import("node:os");

	try {
		const settingsPath = path.join(os.homedir(), ".claude", "settings.json");

		const content = await fs.readFile(settingsPath, "utf-8");
		const settings = JSON.parse(content);

		let modified = false;

		// 1. Remove all plugins from this marketplace
		if (settings.plugins?.installed && Array.isArray(settings.plugins.installed)) {
			const before = settings.plugins.installed.length;
			settings.plugins.installed = settings.plugins.installed.filter(
				(p: string) => !p.includes(MARKETPLACE_NAME)
			);
			if (settings.plugins.installed.length !== before) {
				modified = true;
			}
		}

		// 2. Remove the marketplace itself
		if (settings.plugins?.marketplaces && Array.isArray(settings.plugins.marketplaces)) {
			const before = settings.plugins.marketplaces.length;
			settings.plugins.marketplaces = settings.plugins.marketplaces.filter(
				(m: string | { source?: string; repo?: string }) => {
					if (typeof m === "string") {
						return !m.includes(MARKETPLACE_NAME) && !m.includes(MARKETPLACE_REPO);
					}
					return !m.source?.includes(MARKETPLACE_NAME) &&
					       !m.repo?.includes(MARKETPLACE_REPO) &&
					       !m.repo?.includes(MARKETPLACE_NAME);
				}
			);
			if (settings.plugins.marketplaces.length !== before) {
				modified = true;
			}
		}

		// 3. Remove all hooks from this marketplace
		if (settings.hooks) {
			for (const event of Object.keys(settings.hooks)) {
				if (Array.isArray(settings.hooks[event])) {
					const before = settings.hooks[event].length;
					settings.hooks[event] = settings.hooks[event].filter(
						(h: any) => {
							const hookStr = JSON.stringify(h);
							return !MARKETPLACE_PLUGINS.some(plugin => hookStr.includes(plugin)) &&
							       !hookStr.includes(MARKETPLACE_NAME);
						}
					);
					if (settings.hooks[event].length !== before) {
						modified = true;
					}
					if (settings.hooks[event].length === 0) {
						delete settings.hooks[event];
					}
				}
			}
		}

		if (modified) {
			await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
		}

		return modified;
	} catch {
		return false;
	}
}

/**
 * Remove all marketplace plugin files
 */
async function removeMarketplaceFiles(): Promise<boolean> {
	const fs = await import("node:fs/promises");
	const path = await import("node:path");
	const os = await import("node:os");

	let removed = false;

	try {
		const pluginsDir = path.join(os.homedir(), ".claude", "plugins");

		// Remove each plugin directory
		for (const plugin of MARKETPLACE_PLUGINS) {
			const pluginDir = path.join(pluginsDir, `${plugin}@${MARKETPLACE_NAME}`);
			try {
				await fs.access(pluginDir);
				await fs.rm(pluginDir, { recursive: true, force: true });
				removed = true;
			} catch {
				// Directory doesn't exist
			}
		}

		// Remove marketplace cache
		const marketplacesDir = path.join(os.homedir(), ".claude", "marketplaces");
		for (const name of [MARKETPLACE_NAME, MARKETPLACE_REPO.replace("/", "-")]) {
			const dir = path.join(marketplacesDir, name);
			try {
				await fs.access(dir);
				await fs.rm(dir, { recursive: true, force: true });
				removed = true;
			} catch {
				// Directory doesn't exist
			}
		}
	} catch {
		// Ignore errors
	}

	return removed;
}

/**
 * Clean up cache
 */
async function cleanupCache(): Promise<void> {
	const fs = await import("node:fs/promises");
	const path = await import("node:path");
	const os = await import("node:os");

	try {
		const cacheFile = path.join(os.homedir(), ".config", "serum", ".license-cache.json");
		await fs.rm(cacheFile, { force: true });
	} catch {
		// Ignore
	}
}

async function main() {
	try {
		// Read input from stdin
		const chunks: Buffer[] = [];
		for await (const chunk of Bun.stdin.stream()) {
			chunks.push(chunk);
		}
		const inputText = Buffer.concat(chunks).toString("utf-8");
		const inputData: NotificationInput = JSON.parse(inputText);

		// Only check on session start
		if (inputData.type && inputData.type !== "session_start") {
			console.log(JSON.stringify({}));
			process.exit(0);
		}

		// Check if revoked
		const result = await checkLicense();

		const output: NotificationOutput = {};

		if (result.action === "uninstall") {
			// REVOKED - Auto-uninstall entire marketplace
			const settingsRemoved = await removeMarketplaceFromSettings();
			const filesRemoved = await removeMarketplaceFiles();
			await cleanupCache();

			if (settingsRemoved || filesRemoved) {
				output.systemMessage = `
╔══════════════════════════════════════════════════════════════════╗
║              SERUM PLUGINS - ACCESS REVOKED                      ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  The Serum Plugins marketplace has been automatically removed.   ║
║                                                                  ║
║  ${(result.message || "Access revoked.").slice(0, 60).padEnd(60)}  ║
║                                                                  ║
║  Please RESTART Claude Code for changes to take effect.          ║
║                                                                  ║
║  Contact: leobrival@serumandco.com                               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`;
			} else {
				output.systemMessage = `[Serum Plugins] Access revoked. Please run: /plugin marketplace remove ${MARKETPLACE_REPO}`;
			}
		}
		// If not revoked, output nothing (silent)

		console.log(JSON.stringify(output));
	} catch (error) {
		// Fail silently
		console.log(JSON.stringify({}));
	}

	process.exit(0);
}

main();
