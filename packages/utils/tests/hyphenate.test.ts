import hyphenate from '../src/hyphenate';

describe('hyphenate()', () => {
	it('converts camel cased strings', () => {
		expect(hyphenate('fooBarBaz')).toBe('foo-bar-baz');
	});

	it('doesnt convert already hyphenated strings', () => {
		expect(hyphenate('foo-bar-baz')).toBe('foo-bar-baz');
	});

	it('supports vendor prefixed properties', () => {
		expect(hyphenate('webkitTransition')).toBe('-webkit-transition');
		expect(hyphenate('WebkitTransition')).toBe('-webkit-transition');
		expect(hyphenate('mozBoxSizing')).toBe('-moz-box-sizing');
		expect(hyphenate('MozBoxSizing')).toBe('-moz-box-sizing');
		expect(hyphenate('msFontSmoothing')).toBe('-ms-font-smoothing');
		expect(hyphenate('MsFontSmoothing')).toBe('-ms-font-smoothing');
	});
});
