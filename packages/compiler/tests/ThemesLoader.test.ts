import { Path } from '@boost/common';
import { ThemesLoader } from '../src';

describe('ThemesLoader', () => {
	it('errors if theme extends unknown theme', () => {
		expect(() =>
			new ThemesLoader([]).load(
				new Path(__dirname, './__fixtures__/themes/missing-theme-reference.yaml'),
			),
		).toThrow('Parent theme "unknown" does not exist.');
	});
});
