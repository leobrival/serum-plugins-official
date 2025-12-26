#!/usr/bin/env bun
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2025 Léo Brival <leobrival@serumandco.com>
// This file is part of Serum Plugins Official.
// Commercial licensing available at https://www.serumandco.com/

/**
 * Simple license checker using GitHub Gist as kill switch.
 *
 * How it works:
 * 1. Fetches config from GitHub Gist
 * 2. If revoked: true → uninstall entire marketplace
 * 3. No license key required on client side
 */

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// Configuration
const GIST_CONFIG_URL = "https://gist.githubusercontent.com/leobrival/100cacc5f8e2e098723d27ee82458d1f/raw/serum-licenses.json";
const CACHE_FILE_PATH = join(homedir(), ".config", "serum", ".license-cache.json");
const CACHE_TTL_MS = 3600000; // 1 hour cache

export interface GistConfig {
	revoked: boolean;
	message?: string;
}

export interface LicenseCheckResult {
	valid: boolean;
	action: "allow" | "uninstall";
	message?: string;
}

/**
 * Check if cache is still valid.
 */
function getCachedConfig(): GistConfig | null {
	if (!existsSync(CACHE_FILE_PATH)) {
		return null;
	}

	try {
		const cache = JSON.parse(readFileSync(CACHE_FILE_PATH, "utf-8"));
		const age = Date.now() - cache.timestamp;

		if (age < CACHE_TTL_MS) {
			return cache.config;
		}
	} catch {
		// Ignore cache errors
	}

	return null;
}

/**
 * Save config to cache.
 */
function saveToCache(config: GistConfig): void {
	const fs = require("node:fs");
	const dir = join(homedir(), ".config", "serum");

	if (!existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify({
		timestamp: Date.now(),
		config,
	}));
}

/**
 * Fetch config from GitHub Gist.
 */
export async function fetchGistConfig(): Promise<GistConfig | null> {
	// Try cache first
	const cached = getCachedConfig();
	if (cached) {
		return cached;
	}

	try {
		const response = await fetch(GIST_CONFIG_URL, {
			headers: {
				"Accept": "application/json",
				"Cache-Control": "no-cache",
			},
		});

		if (!response.ok) {
			return null;
		}

		const config: GistConfig = await response.json();

		// Save to cache
		saveToCache(config);

		return config;
	} catch {
		// If fetch fails, try to use expired cache as fallback
		if (existsSync(CACHE_FILE_PATH)) {
			try {
				const cache = JSON.parse(readFileSync(CACHE_FILE_PATH, "utf-8"));
				return cache.config;
			} catch {
				return null;
			}
		}
		return null;
	}
}

/**
 * Check if marketplace should be uninstalled.
 */
export async function checkLicense(): Promise<LicenseCheckResult> {
	const config = await fetchGistConfig();

	// Can't reach server - allow (fail-open)
	if (!config) {
		return {
			valid: true,
			action: "allow",
		};
	}

	// Check revoked flag
	if (config.revoked === true) {
		return {
			valid: false,
			action: "uninstall",
			message: config.message || "Marketplace access has been revoked.",
		};
	}

	// All good
	return {
		valid: true,
		action: "allow",
	};
}
