/* eslint-disable no-param-reassign, unicorn/prefer-prototype-methods */

import { Theme, ThemeRegistry } from '@aesthetic/system';
import {
	ClassName,
	Direction,
	Engine,
	FontFace,
	Import,
	Keyframes,
	RenderOptions,
	Rule,
	ThemeName,
} from '@aesthetic/types';
import { arrayLoop, isDOM } from '@aesthetic/utils';
import { OverrideSheet } from './OverrideSheet';
import { renderComponent, renderTheme } from './renderers';
import { Sheet } from './Sheet';
import {
	AestheticOptions,
	ComponentSheet,
	ComponentSheetFactory,
	ElementSheetFactory,
	EventListener,
	EventType,
	InferKeys,
	OnChangeDirection,
	OnChangeTheme,
	ResultGenerator,
	SheetParams,
	SheetRenderResult,
	ThemeSheet,
	ThemeSheetFactory,
} from './types';

export class Aesthetic<Input extends object = Rule, Output = ClassName> {
	protected activeDirection?: Direction;

	protected activeTheme?: ThemeName;

	protected globalSheetRegistry = new Map<ThemeName, ThemeSheet<string, Input, Output>>();

	protected listeners = new Map<EventType, Set<EventListener>>();

	protected options: AestheticOptions = {};

	protected styleEngine?: Engine<Input, Output>;

	protected themeRegistry = new ThemeRegistry<Input>();

	constructor(options?: AestheticOptions) {
		if (options) {
			this.configure(options);
		}

		// Must be bound manually because of method overloading
		this.emit = this.emit.bind(this);
		this.subscribe = this.subscribe.bind(this);
		this.unsubscribe = this.unsubscribe.bind(this);
	}

	/**
	 * Change the active direction.
	 */
	changeDirection = (direction: Direction, propagate: boolean = true): void => {
		if (direction === this.activeDirection) {
			return;
		}

		const engine = this.getEngine();

		// Set the active direction
		this.activeDirection = direction;

		// Update engine direction
		engine.direction = direction;
		engine.setDirection(direction);

		// Let consumers know about the change
		if (propagate) {
			this.emit('change:direction', [direction]);
		}
	};

	/**
	 * Change the active theme.
	 */
	changeTheme = (name: ThemeName, propagate: boolean = true): void => {
		if (name === this.activeTheme) {
			return;
		}

		const theme = this.getTheme(name);
		const engine = this.getEngine();

		// Set the active theme
		this.activeTheme = name;

		// Set root variables
		if (this.options.rootVariables) {
			engine.setRootVariables(theme.toVariables());
		}

		// Render theme styles
		const results = this.renderThemeSheet(theme);

		// Update engine theme
		engine.setTheme(results);

		// Let consumers know about the change
		if (propagate) {
			this.emit('change:theme', [name, results]);
		}
	};

	/**
	 * Configure options unique to this instance.
	 */
	configure = (options: AestheticOptions): void => {
		Object.assign(this.options, options);

		// Configure the engine with itself to reapply options
		if (this.styleEngine) {
			this.configureEngine(this.styleEngine);
		}
	};

	/**
	 * Configuring which styling engine to use.
	 */
	configureEngine = (engine: Engine<Input, Output>): void => {
		const { options } = this;

		if (options.customProperties) {
			engine.customProperties = options.customProperties;
		}

		if (options.directionConverter) {
			engine.directionConverter = options.directionConverter;
		}

		if (options.defaultUnit) {
			engine.unitSuffixer = options.defaultUnit;
		}

		if (options.vendorPrefixer) {
			engine.vendorPrefixer = options.vendorPrefixer;
		}

		this.styleEngine = engine;
	};

	/**
	 * Create a style sheet that supports multiple elements,
	 * for use within components.
	 */
	createStyleSheet = <T = unknown>(
		factory: ComponentSheetFactory<T, Input>,
	): ComponentSheet<InferKeys<keyof T>, Input, Output> =>
		new OverrideSheet<Input, Output, ComponentSheetFactory<T, Input>>(factory, renderComponent);

	/**
	 * Create a style sheet scoped for a single element.
	 */
	createScopedStyleSheet = <K extends string = 'element'>(
		factory: ElementSheetFactory<Input> | Input,
		selector?: K,
	) =>
		this.createStyleSheet<Record<K, Input>>((utils) => ({
			[selector ?? 'element']: typeof factory === 'function' ? factory(utils) : factory,
		}));

	/**
	 * Create a global style sheet for root theme styles.
	 */
	createThemeSheet = <T = unknown>(
		factory: ThemeSheetFactory<T, Input>,
	): ThemeSheet<InferKeys<keyof T>, Input, Output> => new Sheet(factory, renderTheme);

	/**
	 * Emit all listeners by type, with the defined arguments.
	 */
	emit(type: 'change:direction', args: Parameters<OnChangeDirection>): void;
	emit(type: 'change:theme', args: Parameters<OnChangeTheme>): void;
	emit(type: EventType, args: unknown[]): void {
		this.getListeners(type).forEach((listener) => {
			listener(...args);
		});
	}

	/**
	 * Generate a list of results using the selectors of a style sheet.
	 * If a set is provided, it will be used to check for variants.
	 */
	generateResults: ResultGenerator<string, Output> = (args, variants, renderResult) => {
		const output: Output[] = [];

		arrayLoop(args, (arg) => {
			if (!arg) {
				return;
			}

			// Custom results being passes
			if (Array.isArray(arg)) {
				output.push(...(arg as Output[]).filter(Boolean));

				return;
			}

			const item = renderResult[arg];

			if (item?.result) {
				output.push(item?.result);
			}

			arrayLoop(item?.variants, ({ types, result }) => {
				if (types.every((type) => variants.has(type))) {
					output.push(result);
				}
			});
		});

		return output;
	};

	/**
	 * Return the active direction for the entire application. If an active direction is undefined,
	 * it will be detected from the browser's `dir` attribute.
	 */
	getActiveDirection = (): Direction => {
		if (this.activeDirection) {
			return this.activeDirection;
		}

		// Detect theme from engine
		const direction: Direction = this.getEngine().direction || 'ltr';

		this.changeDirection(direction);

		return direction;
	};

	/**
	 * Return the currently active theme instance. If an active instance has not been defined,
	 * one will be detected from the client's browser preferences.
	 */
	getActiveTheme = (): Theme<Input> => {
		if (this.activeTheme) {
			return this.getTheme(this.activeTheme);
		}

		// Detect theme from browser preferences
		const engine = this.getEngine();
		const theme = this.themeRegistry.getPreferredTheme({
			matchColorScheme: engine.prefersColorScheme,
			matchContrastLevel: engine.prefersContrastLevel,
		});

		this.changeTheme(theme.name);

		return theme;
	};

	/**
	 * Return the current style engine.
	 */
	getEngine = (): Engine<Input, Output> => {
		const current =
			(typeof global !== 'undefined' && global.AESTHETIC_CUSTOM_ENGINE) || this.styleEngine;

		if (current) {
			return current;
		}

		throw new Error('No style engine defined. Have you configured one with `configureEngine()`?');
	};

	/**
	 * Return a set of listeners, or create it if it does not exist.
	 */
	getListeners = <T extends Function>(type: EventType): Set<T> => {
		const set = this.listeners.get(type) ?? new Set();

		this.listeners.set(type, set);

		return set as unknown as Set<T>;
	};

	/**
	 * Return a theme instance by name.
	 */
	getTheme = (name: ThemeName): Theme<Input> => this.themeRegistry.getTheme(name);

	/**
	 * Register a theme, with optional global theme styles.
	 */
	registerTheme = (
		name: ThemeName,
		theme: Theme<Input>,
		sheet: ThemeSheet<string, Input, Output> | null = null,
		isDefault: boolean = false,
	): void => {
		this.themeRegistry.register(name, theme, isDefault);

		if (sheet) {
			if (__DEV__ && !(sheet instanceof Sheet)) {
				throw new TypeError('Rendering theme styles require a `Sheet` instance.');
			}

			this.globalSheetRegistry.set(name, sheet);
		}
	};

	/**
	 * Register a default light or dark theme, with optional global theme styles.
	 */
	registerDefaultTheme = (
		name: ThemeName,
		theme: Theme<Input>,
		sheet: ThemeSheet<string, Input, Output> | null = null,
	): void => {
		this.registerTheme(name, theme, sheet, true);
	};

	/**
	 * Render a `@font-face` to the global style sheet and return the font family name.
	 */
	renderFontFace = (fontFace: FontFace, fontFamily?: string, params?: RenderOptions): string =>
		this.getEngine().renderFontFace(
			{
				fontFamily,
				...fontFace,
			},
			params,
		);

	/**
	 * Render an `@import` to the global style sheet and return the import path.
	 */
	renderImport = (path: Import | string, params?: RenderOptions): string =>
		this.getEngine().renderImport(path, params);

	/**
	 * Render a `@keyframes` to the global style sheet and return the animation name.
	 */
	renderKeyframes = (
		keyframes: Keyframes,
		animationName?: string,
		params?: RenderOptions,
	): string => this.getEngine().renderKeyframes(keyframes, animationName, params);

	/**
	 * Render a style rule outside of the context of a style sheet.
	 */
	renderStyles = (rule: Input) => this.getEngine().renderRule(rule, this.getRenderOptions());

	/**
	 * Render a component style sheet to the document with the defined style query parameters.
	 */
	renderStyleSheet = <T = unknown>(
		sheet: ComponentSheet<T, Input, Output>,
		params: SheetParams = {},
	) => {
		if (__DEV__ && !(sheet instanceof Sheet)) {
			throw new TypeError('Rendering component styles require a `Sheet` instance.');
		}

		return this.renderSheet<InferKeys<T>>(
			sheet,
			params.theme ? this.getTheme(params.theme) : this.getActiveTheme(),
			params,
		);
	};

	/**
	 * Render a theme style sheet and return a result, if one was generated.
	 */
	renderThemeSheet = (theme: Theme<Input>, params: SheetParams = {}): Output[] => {
		const sheet = this.globalSheetRegistry.get(theme.name);
		const results: Output[] = [];

		// Render theme CSS variables
		if (isDOM()) {
			results.push(
				this.getEngine().renderRuleGrouped({ '@variables': theme.toVariables() } as Input, {
					type: 'global',
				}).result,
			);
		}

		// Render theme styles
		if (sheet) {
			const result = this.renderSheet<'root'>(sheet, theme, params).root?.result;

			if (result) {
				results.push(result);
			}
		}

		return results;
	};

	/**
	 * Subscribe and listen to an event by name.
	 */
	subscribe(type: 'change:direction', listener: OnChangeDirection): () => void;
	subscribe(type: 'change:theme', listener: OnChangeTheme): () => void;
	subscribe(type: EventType, listener: Function): () => void {
		this.getListeners(type).add(listener);

		return () => {
			this.unsubscribe(type as 'change:theme', listener as OnChangeTheme);
		};
	}

	/**
	 * Unsubscribe from an event by name.
	 */
	unsubscribe(type: 'change:direction', listener: OnChangeDirection): void;
	unsubscribe(type: 'change:theme', listener: OnChangeTheme): void;
	unsubscribe(type: EventType, listener: Function): void {
		this.getListeners(type).delete(listener);
	}

	protected getRenderOptions(options?: RenderOptions) {
		return {
			deterministic: !!this.options.deterministicClasses,
			direction: this.getActiveDirection(),
			vendor: !!this.options.vendorPrefixer,
			...options,
		};
	}

	protected renderSheet<Keys>(
		sheet: ComponentSheet<string, Input, Output> | ThemeSheet<string, Input, Output>,
		theme: Theme<Input>,
		params: SheetParams,
	): SheetRenderResult<Output, Keys> {
		return sheet.render(
			this.getEngine(),
			theme,
			this.getRenderOptions(params),
		) as SheetRenderResult<Output, Keys>;
	}
}
