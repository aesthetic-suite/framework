export function joinQueries(prev: string | undefined, next: string): string {
	if (prev && next) {
		if (prev.includes(next)) {
			return prev;
		}

		return `${prev} and ${next}`;
	}

	if (next) {
		return next;
	}

	if (prev) {
		return prev;
	}

	return '';
}
