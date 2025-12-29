const USER_AGENT =
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function fetchPage(url: string): Promise<string> {
	const response = await fetch(url, {
		headers: {
			"User-Agent": USER_AGENT,
			Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
			"Accept-Language": "en-US,en;q=0.5",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status}`);
	}

	return response.text();
}

export async function checkUrlStatus(url: string): Promise<number> {
	try {
		const response = await fetch(url, {
			method: "HEAD",
			headers: {
				"User-Agent": USER_AGENT,
			},
		});
		return response.status;
	} catch {
		return 0;
	}
}
