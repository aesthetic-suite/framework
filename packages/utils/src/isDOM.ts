let cache: boolean | null = null;

export function isDOM(): boolean {
	if (typeof process !== 'undefined' && process.env.AESTHETIC_SSR) {
		return false;
	}

	if (cache === null) {
		cache = typeof window !== 'undefined' && typeof document !== 'undefined';
	}

	return cache;
}
