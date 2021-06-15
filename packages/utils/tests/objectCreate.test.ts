import { objectCreate } from '../src/objectCreate';

describe('objectCreate()', () => {
	it('returns an object from a list of keys', () => {
		expect(objectCreate(['foo', 'bar', 'baz'], (key) => key.toUpperCase())).toEqual({
			foo: 'FOO',
			bar: 'BAR',
			baz: 'BAZ',
		});
	});
});
