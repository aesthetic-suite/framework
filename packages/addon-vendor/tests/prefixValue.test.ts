import { prefixValue } from '../src/prefixValue';

describe('prefixValue()', () => {
	it('doesnt prefix for unsupported value', () => {
		expect(prefixValue('min-width', {})).toEqual(['min-width']);
		expect(prefixValue('min-width', { 'min-width': 0 })).toEqual(['min-width']);
	});

	it('prefixes for values that have a mapping', () => {
		expect(
			prefixValue('min-width', {
				'min-width': 5,
			}),
		).toEqual(['-ms-min-width', '-webkit-min-width', 'min-width']);
	});
});
