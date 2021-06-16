import directionConverter from '@aesthetic/addon-direction';
import vendorPrefixer from '@aesthetic/addon-vendor';
import { createClientEngine } from '@aesthetic/style';
import { createTestStyleEngine, getRenderedStyles, purgeStyles } from '@aesthetic/style/test';
import { ClassName } from '@aesthetic/types';
import { toArray } from '@aesthetic/utils';
import { Aesthetic, OverrideSheet, Sheet, SheetRenderResult } from '../src';
import {
	darkTheme,
	getAestheticState,
	lightTheme,
	setupAesthetic,
	teardownAesthetic,
} from '../src/test';

function createVariant(type: string[] | string, result: string) {
	return { types: toArray(type), result };
}

describe('Aesthetic', () => {
	let aesthetic: Aesthetic;

	beforeEach(() => {
		aesthetic = new Aesthetic();
		aesthetic.configureEngine(createClientEngine());
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
			setupAesthetic(aesthetic);

			// @ts-expect-error Allow access
			aesthetic.activeDirection.reset();
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
		function createTempSheet() {
			return aesthetic.createThemeStyles(() => ({
				'@root': {
					display: 'block',
					color: 'black',
				},
			}));
		}

		beforeEach(() => {
			setupAesthetic(aesthetic);
		});

		it('sets active theme', () => {
			expect(getAestheticState(aesthetic).activeTheme).toBeUndefined();

			aesthetic.changeTheme('night');

			expect(getAestheticState(aesthetic).activeTheme).toBe('night');
		});

		it('doesnt run if changing to same name', () => {
			const spy = jest.spyOn(aesthetic, 'renderThemeStyles');

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
			teardownAesthetic(aesthetic);

			aesthetic.configureEngine(createTestStyleEngine());
			aesthetic.registerTheme('night', darkTheme, createTempSheet());

			aesthetic.changeTheme('night');

			expect(document.body.className).toBe('cmaohch');
		});

		it('emits `change:theme` event', () => {
			const spy = jest.fn();

			aesthetic.subscribe('change:theme', spy);
			aesthetic.changeTheme('night');

			expect(spy).toHaveBeenCalledWith('night', ['cmaohch']);
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

	describe('createComponentStyles()', () => {
		beforeEach(() => {
			setupAesthetic(aesthetic);
		});

		it('returns a `OverrideSheet` instance', () => {
			expect(aesthetic.createComponentStyles(() => ({}))).toBeInstanceOf(OverrideSheet);
		});

		it('renders styles immediately upon creation', () => {
			const spy = jest.spyOn(aesthetic.getEngine(), 'renderRule');

			aesthetic.createComponentStyles(() => ({
				element: {
					display: 'block',
					width: '100%',
				},
			}));

			expect(spy).toHaveBeenCalledTimes(1);

			spy.mockRestore();
		});

		it('can utilize mixins', () => {
			aesthetic.createComponentStyles((css) => ({
				element: css.mixin('reset-typography', {
					display: 'flex',
					color: css.var('palette-brand-text'),
				}),
			}));

			expect(getRenderedStyles('standard')).toMatchSnapshot();
		});
	});

	describe('createElementStyles()', () => {
		beforeEach(() => {
			setupAesthetic(aesthetic);
		});

		it('returns a `OverrideSheet` instance using an object', () => {
			const sheet = aesthetic.createElementStyles({
				display: 'block',
				color: 'red',
				':hover': {
					color: 'darkred',
				},
			});

			expect(sheet).toBeInstanceOf(OverrideSheet);
			expect(aesthetic.renderComponentStyles(sheet)).toEqual({ element: { result: 'a b c' } });
		});

		it('returns a `OverrideSheet` instance using a function', () => {
			const sheet = aesthetic.createElementStyles((css) => ({
				display: 'block',
				color: css.var('palette-brand-fg-base'),
				':hover': {
					color: css.var('palette-brand-fg-hovered'),
				},
			}));

			expect(sheet).toBeInstanceOf(OverrideSheet);
			expect(aesthetic.renderComponentStyles(sheet)).toEqual({ element: { result: 'a b c' } });
		});
	});

	describe('createThemeStyles()', () => {
		it('returns a `Sheet` instance', () => {
			expect(aesthetic.createThemeStyles(() => ({}))).toBeInstanceOf(Sheet);
		});

		it('can utilize mixins', () => {
			const sheet = aesthetic.createThemeStyles((css) => ({
				'@root': css.mixin('root', {
					backgroundColor: css.var('palette-neutral-bg-base'),
				}),
			}));

			sheet.render(aesthetic.getEngine(), lightTheme, {});

			expect(getRenderedStyles('global')).toMatchSnapshot();
		});
	});

	describe('generateClassName()', () => {
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
			expect(aesthetic.generateClassName(['a', 'e'], new Set(), classes)).toBe('a e');
		});

		it('returns nothing for an invalid selector', () => {
			expect(aesthetic.generateClassName(['z'], new Set(), classes)).toBe('');
		});

		it('returns nothing for a valid selector but no class name', () => {
			expect(aesthetic.generateClassName(['d'], new Set(), classes)).toBe('');
		});

		it('can append custom class names using an array', () => {
			expect(
				aesthetic.generateClassName(
					['a', ['qux'], 'e', ['foo', false && 'bar', true && 'baz']],
					new Set(),
					classes,
				),
			).toBe('a qux e foo baz');
		});

		describe('variants', () => {
			it('returns class names and matching variants', () => {
				expect(aesthetic.generateClassName(['a'], new Set(['size:df']), classes)).toBe(
					'a a_size_df',
				);
				expect(aesthetic.generateClassName(['a', 'f'], new Set(['size:df']), classes)).toBe(
					'a f a_size_df f_size_df',
				);
			});

			it('returns variants even if theres no base class name', () => {
				expect(aesthetic.generateClassName(['d'], new Set(['size:df']), classes)).toBe('d_size_df');
			});

			it('only returns compound variant result if all names match', () => {
				expect(aesthetic.generateClassName(['h'], new Set(), classes)).toBe('h');
				expect(aesthetic.generateClassName(['h'], new Set(['type:red']), classes)).toBe('h');
				expect(aesthetic.generateClassName(['h'], new Set(['size:df']), classes)).toBe('h');
				expect(aesthetic.generateClassName(['h'], new Set(['type:red', 'size:df']), classes)).toBe(
					'h h_type_red__size_df',
				);

				// Different enums
				expect(aesthetic.generateClassName(['h'], new Set(['type:red', 'size:md']), classes)).toBe(
					'h',
				);
				expect(aesthetic.generateClassName(['h'], new Set(['type:blue', 'size:md']), classes)).toBe(
					'h',
				);
			});

			it('can append custom class names', () => {
				expect(
					aesthetic.generateClassName(
						['a', ['foo', false && 'bar']],
						new Set(['size:df']),
						classes,
					),
				).toBe('a foo a_size_df');
			});
		});
	});

	describe('getActiveDirection()', () => {
		beforeEach(() => {
			// @ts-expect-error Allow access
			aesthetic.activeDirection.reset();
		});

		it('returns the direction defined on the html `dir` attribute', () => {
			const changeSpy = jest.fn();

			aesthetic.subscribe('change:direction', changeSpy);

			document.documentElement.setAttribute('dir', 'rtl');
			document.body.removeAttribute('dir');

			// Reset engine to detect attribute
			aesthetic.configureEngine(createClientEngine());

			expect(aesthetic.getActiveDirection()).toBe('rtl');
			expect(changeSpy).toHaveBeenCalledWith('rtl');
		});

		it('returns the direction defined on the body `dir` attribute', () => {
			document.documentElement.removeAttribute('dir');
			document.body.setAttribute('dir', 'rtl');

			// Reset engine to detect attribute
			aesthetic.configureEngine(createClientEngine());

			expect(aesthetic.getActiveDirection()).toBe('rtl');
		});

		it('returns ltr if no dir found', () => {
			document.documentElement.removeAttribute('dir');
			document.body.removeAttribute('dir');

			// Reset engine to detect attribute
			aesthetic.configureEngine(createClientEngine());

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
			expect(changeSpy).toHaveBeenCalledWith('night', ['cmaohch']);
		});

		it('returns the preferred theme if no active defined', () => {
			const getSpy = jest.spyOn(getAestheticState(aesthetic).themeRegistry, 'getPreferredTheme');
			const changeSpy = jest.fn();

			aesthetic.subscribe('change:theme', changeSpy);
			setupAesthetic(aesthetic);

			expect(aesthetic.getActiveTheme()).toBe(lightTheme);
			expect(getSpy).toHaveBeenCalled();
			expect(changeSpy).toHaveBeenCalledWith('day', ['c1rhiz2p']);
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
			const sheet = aesthetic.createThemeStyles(() => ({}));

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
				aesthetic.styleEngine.reset();
				aesthetic.getEngine();
			}).toThrow('No style engine defined. Have you configured one with `configureEngine()`?');
		});

		it('returns a client engine by default', () => {
			expect(aesthetic.getEngine()).toBeDefined();
		});

		it('can define a custom engine by using a global variable', () => {
			const customEngine = createTestStyleEngine();

			global.AESTHETIC_CUSTOM_ENGINE = customEngine;

			expect(aesthetic.getEngine()).toBe(customEngine);
		});
	});

	describe('renderComponentStyles()', () => {
		function createTempSheet() {
			return aesthetic.createComponentStyles(() => ({
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

		beforeEach(() => {
			setupAesthetic(aesthetic);
		});

		it('errors if sheet is not a `Sheet` instance', () => {
			expect(() => {
				aesthetic.renderComponentStyles(
					// @ts-expect-error Invalid type
					123,
				);
			}).toThrow('Rendering component styles require a `Sheet` instance.');
		});

		it('returns an empty object if no sheet selectors', () => {
			expect(aesthetic.renderComponentStyles(aesthetic.createComponentStyles(() => ({})))).toEqual(
				{},
			);
		});

		it('renders a sheet and returns an object class name', () => {
			const sheet = createTempSheet();
			const spy = jest.spyOn(sheet, 'render');

			expect(aesthetic.renderComponentStyles(sheet)).toEqual({
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
				direction: expect.any(String),
				vendor: false,
			});
		});

		it('can customize params with options', () => {
			const sheet = createTempSheet();
			const spy = jest.spyOn(sheet, 'render');

			aesthetic.configure({
				defaultUnit: 'em',
				vendorPrefixer,
			});

			aesthetic.renderComponentStyles(sheet, { direction: 'rtl' });

			expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), lightTheme, {
				direction: 'rtl',
				vendor: true,
			});
		});

		it('can customize theme with options', () => {
			const sheet = createTempSheet();
			const spy = jest.spyOn(sheet, 'render');

			aesthetic.renderComponentStyles(sheet, { theme: 'night' });

			expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), darkTheme, {
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

	describe('renderThemeStyles()', () => {
		function createTempSheet() {
			return aesthetic.createThemeStyles(() => ({
				'@root': {
					display: 'block',
					width: '100%',
				},
			}));
		}

		it('renders a sheet and returns class names', () => {
			const sheet = createTempSheet();
			const spy = jest.spyOn(sheet, 'render');

			aesthetic.registerDefaultTheme('day', lightTheme, sheet);

			expect(aesthetic.renderThemeStyles(lightTheme)).toEqual(['c1rhiz2p', 'cemumis']);
			expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), lightTheme, {
				direction: expect.any(String),
				vendor: false,
			});
		});

		it('renders theme CSS variables as a rule group', () => {
			const sheet = createTempSheet();
			const spy = jest.spyOn(aesthetic.getEngine(), 'renderRuleGrouped');

			aesthetic.registerDefaultTheme('day', lightTheme, sheet);
			aesthetic.renderThemeStyles(lightTheme);

			expect(spy).toHaveBeenCalledWith(
				lightTheme.toVariables(),
				expect.objectContaining({ type: 'global' }),
			);
		});

		it('can customize params with options', () => {
			const sheet = createTempSheet();
			const spy = jest.spyOn(sheet, 'render');

			aesthetic.configure({
				defaultUnit: 'em',
				vendorPrefixer,
			});
			aesthetic.registerDefaultTheme('day', lightTheme, sheet);
			aesthetic.renderThemeStyles(lightTheme, { direction: 'rtl' });

			expect(spy).toHaveBeenCalledWith(aesthetic.getEngine(), lightTheme, {
				direction: 'rtl',
				vendor: true,
			});
		});
	});
});
