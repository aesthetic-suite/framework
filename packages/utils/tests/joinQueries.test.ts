import { joinQueries } from '../src/joinQueries';

describe('joinQueries()', () => {
	it('returns next if prev is undefined', () => {
		expect(joinQueries(undefined, '(max-width: 100px)')).toBe('(max-width: 100px)');
	});

	it('returns next if prev is empty', () => {
		expect(joinQueries('', '(max-width: 100px)')).toBe('(max-width: 100px)');
	});

	it('returns prev if next is empty', () => {
		expect(joinQueries('(max-width: 100px)', '')).toBe('(max-width: 100px)');
	});

	it('returns empty string if prev and next are empty', () => {
		expect(joinQueries('', '')).toBe('');
	});

	it('joins next and prev if defined', () => {
		expect(joinQueries('(min-width: 0px)', '(max-width: 100px)')).toBe(
			'(min-width: 0px) and (max-width: 100px)',
		);
	});

	it('doesnt join next if value already exists in prev', () => {
		expect(joinQueries('(min-width: 0px) and (max-width: 100px)', '(max-width: 100px)')).toBe(
			'(min-width: 0px) and (max-width: 100px)',
		);
	});
});
