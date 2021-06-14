let cache: boolean | null = null;

export function isDOM(): boolean {
	if (process.env.AESTHETIC_SSR) {
		return false;
	}

	if (cache === null) {
		cache = typeof window !== 'undefined' && typeof document !== 'undefined';
	}

	return cache;
}
