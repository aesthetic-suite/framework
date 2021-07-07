import directionConverter from '@aesthetic/addon-direction';
import vendorPrefixer from '@aesthetic/addon-vendor';
import { createClientEngine } from '@aesthetic/style';
import { getRenderedStyles, purgeStyles } from '@aesthetic/style/test';
import { ClassName } from '@aesthetic/types';
import { toArray } from '@aesthetic/utils';
import { Aesthetic, AestheticOptions, OverrideSheet, Sheet, SheetRenderResult } from '../src';
import {
	createTestEngine,
	darkTheme,
	getAestheticState,
	lightTheme,
	setupAesthetic,
	teardownAesthetic,
} from '../src/test';

function createVariant(type: string[] | string, result: string) {
	return { types: toArray(type), result };
}

function createAesthetic() {
	const aesthetic = new Aesthetic();

	// Dont use test engine since we need to test the DOM
	aesthetic.configureEngine(createClientEngine());

	return aesthetic;
}

function createComponentSheet(aesthetic: Aesthetic, options?: Partial<AestheticOptions>) {
	if (options) {
		aesthetic.configure(options);
	}

	return aesthetic.createStyleSheet(() => ({
		foo: {
			display: 'block',
		},
		bar: {
			color: 'black',

			'@variants': {
				'type:red': {
					color: 'red',
				},

				// Compounds
				'border:thick + size:small': {
					border: '3px solid blue',
				},
			},
		},
		baz: {
			position: 'absolute',
		},
	}));
}

function createThemeSheet(aesthetic: Aesthetic) {
	return aesthetic.createThemeSheet(() => ({
		'@root': {
			display: 'block',
			width: '100%',
		},
	}));
}

describe('Aesthetic', () => {
	let aesthetic: Aesthetic;

	beforeEach(() => {
		purgeStyles();
		aesthetic = createAesthetic();
		setupAesthetic(aesthetic);
	});

	afterEach(() => {
		purgeStyles();
		teardownAesthetic(aesthetic);
		document.documentElement.setAttribute('dir', 'ltr');
	});

	it('can subscribe and unsubscribe events', () => {
		const spy = jest.fn();

		aesthetic.subscribe('change:theme', spy);

		expect(getAestheticState(aesthetic).listeners.get('change:theme')?.has(spy)).toBe(true);

		aesthetic.unsubscribe('change:theme', spy);

		expect(getAestheticState(aesthetic).listeners.get('change:theme')?.has(spy)).toBe(false);
	});

	it('can subscribe and unsubscribe events using the return value', () => {
		const spy = jest.fn();

		const unsub = aesthetic.subscribe('change:theme', spy);

		expect(getAestheticState(aesthetic).listeners.get('change:theme')?.has(spy)).toBe(true);

		unsub();

		expect(getAestheticState(aesthetic).listeners.get('change:theme')?.has(spy)).toBe(false);
	});

	describe('changeDirection()', () => {
		beforeEach(() => {
			// @ts-expect-error Allow access
			aesthetic.activeDirection = undefined;
		});

		it('sets active direction', () => {
			expect(getAestheticState(aesthetic).activeDirection).toBeUndefined();

			aesthetic.changeDirection('rtl');

			expect(getAestheticState(aesthetic).activeDirection).toBe('rtl');
		});

		it('sets direction on engine', () => {
			expect(aesthetic.getEngine().direction).toBe('ltr');

			aesthetic.changeDirection('rtl');

			expect(aesthetic.getEngine().direction).toBe('rtl');
		});

		it('doesnt run if changing to same name', () => {
			const spy = jest.fn();

			aesthetic.subscribe('change:direction', spy);

			aesthetic.changeDirection('rtl');
			aesthetic.changeDirection('rtl');

			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('sets document attribute', () => {
			document.documentElement.dir = 'ltr';

			expect(document.documentElement.dir).toBe('ltr');

			aesthetic.changeDirection('rtl');

			expect(document.documentElement.dir).toBe('rtl');
		});

		it('emits `change:direction` event', () => {
			const spy = jest.fn();

			aesthetic.subscribe('change:direction', spy);

			aesthetic.changeDirection('rtl');

			expect(spy).toHaveBeenCalledWith('rtl');
		});

		it('doesnt emit `change:direction` event if `propagate` is false', () => {
			const spy = jest.fn();

			aesthetic.subscribe('change:direction', spy);

			aesthetic.changeDirection('rtl', false);

			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('changeTheme()', () => {
		it('sets active theme', () => {
			expect(getAestheticState(aesthetic).activeTheme).toBeUndefined();

			aesthetic.changeTheme('night');

			expect(getAestheticState(aesthetic).activeTheme).toBe('night');
		});

		it('doesnt run if changing to same name', () => {
			const spy = jest.spyOn(aesthetic, 'renderThemeSheet');

			aesthetic.changeTheme('night');
			aesthetic.changeTheme('night');

			expect(spy).toHaveBeenCalledTimes(1);

			spy.mockRestore();
		});

		it('applies root css variables if `rootVariables` is true', () => {
			const spy = jest.spyOn(aesthetic.getEngine(), 'setRootVariables');

			// @ts-expect-error Allow access
			aesthetic.options.rootVariables = true;
			aesthetic.changeTheme('night');

			expect(spy).toHaveBeenCalledWith(darkTheme.toVariables());

			spy.mockRestore();
		});

		it('doesnt apply root css variables if `rootVariables` is false', () => {
			const spy = jest.spyOn(aesthetic.getEngine(), 'setRootVariables');

			aesthetic.changeTheme('night');

			expect(spy).not.toHaveBeenCalled();

			spy.mockRestore();
		});

		it('renders theme sheet and sets body class name', () => {
			aesthetic.registerTheme('night', darkTheme, createThemeSheet(aesthetic));

			aesthetic.changeTheme('night');

			expect(document.body.className).toBe('c1qxhd3i cemumis');
		});

		it('emits `change:theme` event', () => {
			const spy = jest.fn();

			aesthetic.subscribe('change:theme', spy);
			aesthetic.changeTheme('night');

			expect(spy).toHaveBeenCalledWith('night', ['c1qxhd3i']);
		});

		it('doesnt emit `change:theme` event if `propagate` is false', () => {
			const spy = jest.fn();

			aesthetic.subscribe('change:theme', spy);
			aesthetic.changeTheme('night', false);

			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('configure()', () => {
		it('sets options', () => {
			expect(getAestheticState(aesthetic).options).toEqual({});

			aesthetic.configure({
				defaultUnit: 'em',
				directionConverter,
				vendorPrefixer,
			});

			expect(getAestheticState(aesthetic).options).toEqual({
				defaultUnit: 'em',
				directionConverter,
				vendorPrefixer,
			});
		});

		it('can customize through constructor', () => {
			aesthetic = new Aesthetic({
				defaultUnit: 'em',
				directionConverter,
				vendorPrefixer,
			});

			expect(getAestheticState(aesthetic).options).toEqual({
				defaultUnit: 'em',
				directionConverter,
				vendorPrefixer,
			});
		});
	});

	describe('createStyleSheet()', () => {
		it('returns a `OverrideSheet` instance', () => {
			expect(aesthetic.createStyleSheet(() => ({}))).toBeInstanceOf(OverrideSheet);
		});

		it('can utilize mixins', () => {
			const sheet = aesthetic.createStyleSheet((css) => ({
				element: css.mixin('reset-typography', {
					display: 'flex',
					color: css.var('palette-brand-text'),
				}),
			}));

			aesthetic.renderStyleSheet(sheet);

			expect(getRenderedStyles('standard')).toMatchSnapshot();
		});
	});

	describe('createScopedStyleSheet()', () => {
		it('returns a `OverrideSheet` instance using an object', () => {
			const sheet = aesthetic.createScopedStyleSheet({
				display: 'block',
				color: 'red',
				':hover': {
					color: 'darkred',
				},
			});

			expect(sheet).toBeInstanceOf(OverrideSheet);
			expect(aesthetic.renderStyleSheet(sheet)).toEqual({ element: { result: 'a b c' } });
		});

		it('returns a `OverrideSheet` instance using a function', () => {
			const sheet = aesthetic.createScopedStyleSheet((css) => ({
				display: 'block',
				color: css.var('palette-brand-fg-base'),
				':hover': {
					color: css.var('palette-brand-fg-hovered'),
				},
			}));

			expect(sheet).toBeInstanceOf(OverrideSheet);
			expect(aesthetic.renderStyleSheet(sheet)).toEqual({ element: { result: 'a b c' } });
		});

		it('can customize the selector', () => {
			const sheet = aesthetic.createScopedStyleSheet(
				{
					display: 'block',
					color: 'red',
					':hover': {
						color: 'darkred',
					},
				},
				'test',
			);

			expect(sheet).toBeInstanceOf(OverrideSheet);
			expect(aesthetic.renderStyleSheet(sheet)).toEqual({ test: { result: 'a b c' } });
		});
	});

	describe('createThemeSheet()', () => {
		it('returns a `Sheet` instance', () => {
			expect(aesthetic.createThemeSheet(() => ({}))).toBeInstanceOf(Sheet);
		});

		it('can utilize mixins', () => {
			const sheet = aesthetic.createThemeSheet((css) => ({
				'@root': css.mixin('root', {
					backgroundColor: css.var('palette-neutral-bg-base'),
				}),
			}));

			sheet.render(aesthetic.getEngine(), lightTheme, {});

			expect(getRenderedStyles('global')).toMatchSnapshot();
		});
	});

	describe('generateResults()', () => {
		const classes: SheetRenderResult<ClassName> = {
			a: { result: 'a', variants: [createVariant('size:df', 'a_size_df')] },
			b: { result: 'b' },
			c: {
				result: 'c',
				variants: [createVariant('size:md', 'c_size_md'), createVariant('type:red', 'c_type_red')],
			},
			d: { variants: [createVariant('size:df', 'd_size_df')] },
			e: { result: 'e' },
			f: {
				result: 'f',
				variants: [createVariant('size:df', 'f_size_df'), createVariant('size:md', 'f_size_md')],
			},
			g: { result: 'g', variants: [createVariant('type:red', 'g_type_red')] },
			h: { result: 'h', variants: [createVariant(['type:red', 'size:df'], 'h_type_red__size_df')] },
		};

		it('returns class names', () => {
			expect(aesthetic.generateResults(['a', 'e'], new Set(), classes)).toEqual(['a', 'e']);
		});

		it('returns nothing for an invalid selector', () => {
			expect(aesthetic.generateResults(['z'], new Set(), classes)).toEqual([]);
		});

		it('returns nothing for a valid selector but no class name', () => {
			expect(aesthetic.generateResults(['d'], new Set(), classes)).toEqual([]);
		});

		it('can append custom class names using an array', () => {
			expect(
				aesthetic.generateResults(
					['a', ['qux'], 'e', ['foo', false && 'bar', true && 'baz']],
					new Set(),
					classes,
				),
			).toEqual(['a', 'qux', 'e', 'foo', 'baz']);
		});

		describe('variants', () => {
			it('returns class names and matching variants', () => {
				expect(aesthetic.generateResults(['a'], new Set(['size:df']), classes)).toEqual([
					'a',
					'a_size_df',
				]);
				expect(aesthetic.generateResults(['a', 'f'], new Set(['size:df']), classes)).toEqual([
					'a',
					'a_size_df',
					'f',
					'f_size_df',
				]);
			});

			it('returns variants even if theres no base class name', () => {
				expect(aesthetic.generateResults(['d'], new Set(['size:df']), classes)).toEqual([
					'd_size_df',
				]);
			});

			it('only returns compound variant result if all names match', () => {
				expect(aesthetic.generateResults(['h'], new Set(), classes)).toEqual(['h']);
				expect(aesthetic.generateResults(['h'], new Set(['type:red']), classes)).toEqual(['h']);
				expect(aesthetic.generateResults(['h'], new Set(['size:df']), classes)).toEqual(['h']);
				expect(aesthetic.generateResults(['h'], new Set(['type:red', 'size:df']), classes)).toEqual(
					['h', 'h_type_red__size_df'],
				);

				// Different enums
				expect(aesthetic.generateResults(['h'], new Set(['type:red', 'size:md']), classes)).toEqual(
					['h'],
				);
				expect(
					aesthetic.generateResults(['h'], new Set(['type:blue', 'size:md']), classes),
				).toEqual(['h']);
			});

			it('can append custom class names', () => {
				expect(
					aesthetic.generateResults(['a', ['foo', false && 'bar']], new Set(['size:df']), classes),
				).toEqual(['a', 'a_size_df', 'foo']);
			});
		});
	});

	describe('getActiveDirection()', () => {
		beforeEach(() => {
			// @ts-expect-error Allow access
			aesthetic.activeDirection = undefined;
		});

		it('returns the direction defined on the html `dir` attribute', () => {
			const changeSpy = jest.fn();

			document.documentElement.setAttribute('dir', 'rtl');
			document.body.removeAttribute('dir');

			// Reset to detect attribute
			aesthetic = createAesthetic();
			aesthetic.subscribe('change:direction', changeSpy);

			expect(aesthetic.getActiveDirection()).toBe('rtl');
			expect(changeSpy).toHaveBeenCalledWith('rtl');
		});

		it('returns the direction defined on the body `dir` attribute', () => {
			document.documentElement.removeAttribute('dir');
			document.body.setAttribute('dir', 'rtl');

			// Reset to detect attribute
			aesthetic = createAesthetic();

			expect(aesthetic.getActiveDirection()).toBe('rtl');
		});

		it('returns ltr if no dir found', () => {
			document.documentElement.removeAttribute('dir');
			document.body.removeAttribute('dir');

			// Reset to detect attribute
			aesthetic = createAesthetic();

			expect(aesthetic.getActiveDirection()).toBe('ltr');
		});

		it('caches result for subsequent lookups', () => {
			expect(aesthetic.getActiveDirection()).toBe('ltr');

			document.documentElement.setAttribute('dir', 'rtl');

			expect(aesthetic.getActiveDirection()).toBe('ltr');
		});
	});

	describe('getActiveTheme()', () => {
		it('errors if no themes registered', () => {
			aesthetic = createAesthetic();

			expect(() => {
				aesthetic.getActiveTheme();
			}).toThrow('No themes have been registered.');
		});

		it('returns the active theme defined by property', () => {
			const changeSpy = jest.fn();

			aesthetic.subscribe('change:theme', changeSpy);
			setupAesthetic(aesthetic);
			aesthetic.changeTheme('night');

			expect(aesthetic.getActiveTheme()).toBe(darkTheme);
			expect(changeSpy).toHaveBeenCalledWith('night', ['c1qxhd3i']);
		});

		it('returns the preferred theme if no active defined', () => {
			const getSpy = jest.spyOn(getAestheticState(aesthetic).themeRegistry, 'getPreferredTheme');
			const changeSpy = jest.fn();

			aesthetic.subscribe('change:theme', changeSpy);
			setupAesthetic(aesthetic);

			expect(aesthetic.getActiveTheme()).toBe(lightTheme);
			expect(getSpy).toHaveBeenCalled();
			expect(changeSpy).toHaveBeenCalledWith('day', ['cslosem']);
		});
	});

	describe('getTheme()', () => {
		it('errors if not registered', () => {
			expect(() => {
				aesthetic.getTheme('unknown');
			}).toThrow('Theme "unknown" does not exist. Has it been registered?');
		});

		it('returns the theme defined by name', () => {
			aesthetic.registerTheme('day', lightTheme);

			expect(aesthetic.getTheme('day')).toBe(lightTheme);
		});
	});

	describe('registerDefaultTheme()', () => {
		it('registers a default theme', () => {
			const spy = jest.spyOn(getAestheticState(aesthetic).themeRegistry, 'register');

			aesthetic.registerDefaultTheme('day', lightTheme);

			expect(spy).toHaveBeenCalledWith('day', lightTheme, true);
		});
	});

	describe('registerTheme()', () => {
		it('registers a theme', () => {
			const spy = jest.spyOn(getAestheticState(aesthetic).themeRegistry, 'register');

			aesthetic.registerTheme('day', lightTheme);

			expect(spy).toHaveBeenCalledWith('day', lightTheme, false);
		});

		it('registers an optional sheet', () => {
			const sheet = aesthetic.createThemeSheet(() => ({}));

			aesthetic.registerTheme('day', lightTheme, sheet);

			expect(getAestheticState(aesthetic).globalSheetRegistry.get('day')).toBe(sheet);
		});

		it('errors if sheet is not a `Sheet` instance', () => {
			expect(() => {
				aesthetic.registerTheme(
					'day',
					lightTheme,
					// @ts-expect-error Invalid type
					123,
				);
			}).toThrow('Rendering theme styles require a `Sheet` instance.');
		});
	});

	describe('getEngine()', () => {
		it('errors if not defined', () => {
			expect(() => {
				// @ts-expect-error Allow access
				aesthetic.styleEngine = undefined;
				aesthetic.getEngine();
			}).toThrow('No style engine defined. Have you configured one with `configureEngine()`?');
		});

		it('returns a client engine by default', () => {
			expect(aesthetic.getEngine()).toBeDefined();
		});

		it('can define a custom engine by using a global variable', () => {
			const customEngine = createClientEngine();

			global.AESTHETIC_CUSTOM_ENGINE = customEngine;

			expect(aesthetic.getEngine()).toBe(customEngine);

			// @ts-expect-error Allow delete
			delete global.AESTHETIC_CUSTOM_ENGINE;
		});
	});

	describe('renderStyles()', () => {
		it('renders the styles and returns an output result', () => {
			const result = aesthetic.renderStyles({
				color: 'black',

				'@variants': {
					'type:red': {
						color: 'red',
					},

					// Compounds
					'border:thick + size:small': {
						border: '3px solid blue',
					},
				},
			});

			expect(result).toEqual({
				result: 'a',
				variants: [
					createVariant('type:red', 'b'),
					createVariant(['border:thick', 'size:small'], 'c'),
				],
			});
		});
	});

	describe('renderStyleSheet()', () => {
		it('errors if sheet is not a `Sheet` instance', () => {
			expect(() => {
				aesthetic.renderStyleSheet(
					// @ts-expect-error Invalid type
					123,
				);
			}).toThrow('Rendering component styles require a `Sheet` instance.');
		});

		it('returns an empty object if no sheet selectors', () => {
			expect(aesthetic.renderStyleSheet(aesthetic.createStyleSheet(() => ({})))).toEqual({});
		});

		it('renders a sheet and returns an object class name', () => {
			const sheet = createComponentSheet(aesthetic);
			const spy = jest.spyOn(sheet, 'render');

			expect(aesthetic.renderStyleSheet(sheet)).toEqual({
				foo: { result: 'a' },
				bar: {
					result: 'b',
					variants: [
						createVariant('type:red', 'c'),
						createVariant(['border:thick', 'size:small'], 'd'),
					],
					variantTypes: new Set(['border', 'type', 'size']),
				},
				baz: { result: 'e' },
			});
			expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), lightTheme, {
				deterministic: false,
				direction: expect.any(String),
				vendor: false,
			});
		});

		it('renders with deterministic classes', () => {
			const sheet = createComponentSheet(aesthetic, {
				deterministicClasses: true,
			});
			const spy = jest.spyOn(sheet, 'render');

			expect(aesthetic.renderStyleSheet(sheet)).toEqual({
				foo: { result: 'c1s7hmty' },
				bar: {
					result: 'cddrzz3',
					variants: [
						createVariant('type:red', 'csjf8sr'),
						createVariant(['border:thick', 'size:small'], 'c1bdyxox'),
					],
					variantTypes: new Set(['border', 'type', 'size']),
				},
				baz: { result: 'chj83d7' },
			});
			expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), lightTheme, {
				deterministic: true,
				direction: expect.any(String),
				vendor: false,
			});
		});

		it('renders with a test engine and fixed classes', () => {
			aesthetic.configureEngine(createTestEngine());

			const sheet = createComponentSheet(aesthetic);

			expect(aesthetic.renderStyleSheet(sheet)).toEqual({
				foo: { result: 'foo' },
				bar: {
					result: 'bar',
					variants: [
						createVariant('type:red', 'variant:type:red'),
						createVariant(
							['border:thick', 'size:small'],
							'variant:border:thick variant:size:small',
						),
					],
					variantTypes: new Set(['border', 'type', 'size']),
				},
				baz: { result: 'baz' },
			});
		});

		it('can customize params with options', () => {
			const sheet = createComponentSheet(aesthetic, {
				defaultUnit: 'em',
				vendorPrefixer,
			});
			const spy = jest.spyOn(sheet, 'render');

			aesthetic.renderStyleSheet(sheet, { direction: 'rtl' });

			expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), lightTheme, {
				deterministic: false,
				direction: 'rtl',
				vendor: true,
			});
		});

		it('can customize theme with options', () => {
			const sheet = createComponentSheet(aesthetic);
			const spy = jest.spyOn(sheet, 'render');

			aesthetic.renderStyleSheet(sheet, { theme: 'night' });

			expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), darkTheme, {
				deterministic: false,
				direction: expect.any(String),
				theme: 'night',
				vendor: false,
			});
		});
	});

	describe('renderFontFace()', () => {
		it('passes to engine', () => {
			const spy = jest.spyOn(aesthetic.getEngine(), 'renderFontFace');
			const fontFace = {
				fontFamily: 'Roboto',
				src: "url('fonts/Roboto.woff2') format('woff2')",
			};

			aesthetic.renderFontFace(fontFace);

			expect(spy).toHaveBeenCalledWith(fontFace, undefined);

			spy.mockRestore();
		});

		it('supports source paths', () => {
			const spy = jest.spyOn(aesthetic.getEngine(), 'renderFontFace');

			aesthetic.renderFontFace(
				{
					srcPaths: ['fonts/Roboto.woff2'],
				},
				'Roboto',
			);

			expect(spy).toHaveBeenCalledWith(
				{
					fontFamily: 'Roboto',
					srcPaths: ['fonts/Roboto.woff2'],
				},
				undefined,
			);

			spy.mockRestore();
		});
	});

	describe('renderImport()', () => {
		it('passes to engine', () => {
			const spy = jest.spyOn(aesthetic.getEngine(), 'renderImport');
			const path = 'test.css';

			aesthetic.renderImport(path);

			expect(spy).toHaveBeenCalledWith(path, undefined);

			spy.mockRestore();
		});
	});

	describe('renderKeyframes()', () => {
		it('passes to engine', () => {
			const spy = jest.spyOn(aesthetic.getEngine(), 'renderKeyframes');
			const keyframes = {
				from: { opacity: 0 },
				to: { opacity: 1 },
			};

			aesthetic.renderKeyframes(keyframes);

			expect(spy).toHaveBeenCalledWith(keyframes, undefined, undefined);

			spy.mockRestore();
		});

		it('can pass a name and params', () => {
			const spy = jest.spyOn(aesthetic.getEngine(), 'renderKeyframes');
			const keyframes = {
				from: { opacity: 0 },
				to: { opacity: 1 },
			};

			aesthetic.renderKeyframes(keyframes, 'fade', { direction: 'rtl' });

			expect(spy).toHaveBeenCalledWith(keyframes, 'fade', { direction: 'rtl' });

			spy.mockRestore();
		});
	});

	describe('renderThemeSheet()', () => {
		it('renders a sheet and returns class names', () => {
			const sheet = createThemeSheet(aesthetic);
			const spy = jest.spyOn(sheet, 'render');

			aesthetic.registerDefaultTheme('day', lightTheme, sheet);

			expect(aesthetic.renderThemeSheet(lightTheme)).toEqual(['cslosem', 'cemumis']);
			expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), lightTheme, {
				deterministic: false,
				direction: expect.any(String),
				vendor: false,
			});
		});

		it('renders with deterministic classes even if disabled', () => {
			const sheet = createThemeSheet(aesthetic);
			const spy = jest.spyOn(sheet, 'render');

			aesthetic.configure({
				deterministicClasses: false,
			});

			aesthetic.registerDefaultTheme('day', lightTheme, sheet);

			expect(aesthetic.renderThemeSheet(lightTheme)).toEqual(['cslosem', 'cemumis']);
			expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), lightTheme, {
				deterministic: false,
				direction: expect.any(String),
				vendor: false,
			});
		});

		it('renders theme CSS variables as a rule group', () => {
			const sheet = createThemeSheet(aesthetic);
			const spy = jest.spyOn(aesthetic.getEngine(), 'renderRuleGrouped');

			aesthetic.registerDefaultTheme('day', lightTheme, sheet);
			aesthetic.renderThemeSheet(lightTheme);

			expect(spy).toHaveBeenCalledWith(
				{
					'@variables': lightTheme.toVariables(),
				},
				expect.objectContaining({ type: 'global' }),
			);
		});

		it('can customize params with options', () => {
			const sheet = createThemeSheet(aesthetic);
			const spy = jest.spyOn(sheet, 'render');

			aesthetic.configure({
				defaultUnit: 'em',
				vendorPrefixer,
			});
			aesthetic.registerDefaultTheme('day', lightTheme, sheet);
			aesthetic.renderThemeSheet(lightTheme, { direction: 'rtl' });

			expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), lightTheme, {
				deterministic: false,
				direction: 'rtl',
				vendor: true,
			});
		});
	});
});
