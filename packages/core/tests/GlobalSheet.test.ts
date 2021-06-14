import { createTestStyleEngine } from '@aesthetic/style/test';
import { ClassName, Engine } from '@aesthetic/types';
import { GlobalSheet, StyleSheet } from '../src';
import { lightTheme } from '../src/test';

describe('GlobalSheet', () => {
	let engine: Engine<string>;
	let sheet: GlobalSheet<unknown, object, ClassName>;

	beforeEach(() => {
		engine = createTestStyleEngine({});

		// Dont use `createThemeStyles` since we need to pass a custom renderer
		sheet = new StyleSheet('global', () => ({
			'@font-face': {
				Roboto: {
					fontStyle: 'normal',
					fontWeight: 'normal',
					local: ['Robo'],
					srcPaths: ['fonts/Roboto.woff2', 'fonts/Roboto.ttf'],
				},
			},
			'@root': {
				height: '100%',
				margin: 0,
				fontSize: 16,
				lineHeight: 1.5,
				backgroundColor: 'white',
			},
			'@import': ['url("reset.css")', { path: 'normalize.css', url: true }],
			'@keyframes': {
				fade: {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},
			},
			'@variables': {
				'--standard-syntax': 'true',
				customSyntax: 123,
			},
		}));
	});

	it('errors if a non-function factory is passed', () => {
		expect(
			() =>
				new StyleSheet(
					'global',
					// @ts-expect-error Invalid type
					123,
				),
		).toThrow('A style sheet factory function is required, found "number".');
	});

	it('only renders once when cached', () => {
		const spy = jest.spyOn(sheet, 'compose');

		sheet.render(engine, lightTheme, {});
		sheet.render(engine, lightTheme, {});
		sheet.render(engine, lightTheme, {});

		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('re-renders when params change', () => {
		const spy = jest.spyOn(sheet, 'compose');

		sheet.render(engine, lightTheme, {});
		sheet.render(engine, lightTheme, { direction: 'rtl' });
		sheet.render(engine, lightTheme, {});
		sheet.render(engine, lightTheme, { direction: 'rtl' });

		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('renders @font-face', () => {
		const spy = jest.spyOn(engine, 'renderFontFace');

		sheet.render(engine, lightTheme, {});

		expect(spy).toHaveBeenCalledWith(
			{
				fontFamily: 'Roboto',
				fontStyle: 'normal',
				fontWeight: 'normal',
				local: ['Robo'],
				srcPaths: ['fonts/Roboto.woff2', 'fonts/Roboto.ttf'],
			},
			{
				direction: 'ltr',
				unit: 'px',
				vendor: false,
			},
		);
	});

	it('renders @root', () => {
		const spy = jest.spyOn(engine, 'renderRuleGrouped');
		const result = sheet.render(engine, lightTheme, {});

		expect(result).toEqual({ root: { result: 'c1fv9z16' } });
		expect(spy).toHaveBeenCalledWith(
			{
				height: '100%',
				margin: 0,
				fontSize: 16,
				lineHeight: 1.5,
				backgroundColor: 'white',
			},
			{
				className: 'c1fv9z16',
				deterministic: true,
				direction: 'ltr',
				rankings: undefined,
				type: 'global',
				unit: 'px',
				vendor: false,
			},
		);
	});

	it('renders @import', () => {
		const spy = jest.spyOn(engine, 'renderImport');

		sheet.render(engine, lightTheme, {});

		expect(spy).toHaveBeenCalledWith('url("reset.css")', expect.any(Object));
		expect(spy).toHaveBeenCalledWith({ path: 'normalize.css', url: true }, expect.any(Object));
	});

	it('renders @keyframes', () => {
		const spy = jest.spyOn(engine, 'renderKeyframes');

		sheet.render(engine, lightTheme, {});

		expect(spy).toHaveBeenCalledWith(
			{
				from: { opacity: 0 },
				to: { opacity: 1 },
			},
			'fade',
			{
				direction: 'ltr',
				unit: 'px',
				vendor: false,
			},
		);
	});

	it('renders @variables', () => {
		const spy = jest.spyOn(engine, 'setRootVariables');

		sheet.render(engine, lightTheme, {});

		expect(spy).toHaveBeenCalledWith({ '--standard-syntax': 'true', customSyntax: 123 });
	});

	describe('overrides', () => {
		it('errors when adding color scheme overrides', () => {
			expect(() => {
				// @ts-expect-error Allow access
				sheet.addColorSchemeOverride('unknown', () => ({}));
			}).toThrow('Color scheme overrides are only supported by local style sheets.');
		});

		it('errors when adding contrast level overrides', () => {
			expect(() => {
				// @ts-expect-error Allow access
				sheet.addContrastOverride('unknown', () => ({}));
			}).toThrow('Contrast level overrides are only supported by local style sheets.');
		});

		it('errors when adding theme overrides', () => {
			expect(() => {
				// @ts-expect-error Allow access
				sheet.addThemeOverride('unknown', () => ({}));
			}).toThrow('Theme overrides are only supported by local style sheets.');
		});
	});
});
