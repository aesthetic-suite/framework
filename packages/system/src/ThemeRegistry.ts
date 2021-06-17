import { ColorScheme, ContrastLevel, ThemeName } from '@aesthetic/types';
import { Theme } from './Theme';
import { ThemeOptions } from './types';

export class ThemeRegistry<Block extends object> {
	protected darkTheme: string = '';

	protected defaultTheme: string = '';

	protected lightTheme: string = '';

	protected themes: Record<string, Theme<Block>> = {};

	/**
	 * Return the default dark theme.
	 */
	getDarkTheme(): Theme<Block> {
		return this.getTheme(this.darkTheme);
	}

	/**
	 * Return the default light theme.
	 */
	getLightTheme(): Theme<Block> {
		return this.getTheme(this.lightTheme);
	}

	/**
	 * Find an approprite theme based on the user's or device's preferences.
	 * Will check for preferred color schemes and contrast levels.
	 */
	getPreferredTheme({
		matchColorScheme,
		matchContrastLevel,
	}: {
		matchColorScheme?: (scheme: ColorScheme) => boolean;
		matchContrastLevel?: (level: ContrastLevel) => boolean;
	} = {}): Theme<Block> {
		const prefersDarkScheme = matchColorScheme?.('dark');
		const prefersLightScheme = matchColorScheme?.('light');
		const prefersHighContrast = matchContrastLevel?.('high');
		const prefersLowContrast = matchContrastLevel?.('low');
		const schemeCheckOrder: ColorScheme[] = [];

		if (prefersDarkScheme) {
			schemeCheckOrder.push('dark');
		} else if (prefersLightScheme) {
			schemeCheckOrder.push('light');
		}

		let possibleTheme: Theme<Block> | undefined;

		// Find a theme based on device preferences
		schemeCheckOrder.some((scheme) => {
			const contrastCheckOrder: ContrastLevel[] = ['normal'];

			if (prefersHighContrast) {
				contrastCheckOrder.unshift('high');
			} else if (prefersLowContrast) {
				contrastCheckOrder.unshift('low');
			}

			return contrastCheckOrder.some((contrast) => {
				possibleTheme = this.query({ contrast, scheme });

				return !!possibleTheme;
			});
		});

		if (possibleTheme) {
			return possibleTheme;
		}
		if (this.defaultTheme) {
			return this.getTheme(this.defaultTheme);
		}

		throw new Error('No themes have been registered.');
	}

	/**
	 * Return a theme by name or throw an error if not found.
	 */
	getTheme(name: ThemeName): Theme<Block> {
		if (__DEV__ && !name) {
			throw new Error('Cannot find a theme without a name.');
		}

		const theme = this.themes[name];

		if (__DEV__ && !theme) {
			throw new Error(`Theme "${name}" does not exist. Has it been registered?`);
		}

		return theme;
	}

	/**
	 * Query for a theme that matches the defined parameters.
	 */
	query(params: Partial<ThemeOptions>): Theme<Block> | undefined {
		return Object.values(this.themes).find((theme) => {
			const conditions: boolean[] = [];

			if (params.contrast) {
				conditions.push(theme.contrast === params.contrast);
			}

			if (params.scheme) {
				conditions.push(theme.scheme === params.scheme);
			}

			return conditions.every((c) => !!c);
		});
	}

	/**
	 * Register a theme with a unique name. Can optionally mark a theme
	 * as default for their defined color scheme.
	 */
	register(name: string, theme: Theme<Block>, isDefault: boolean = false): this {
		if (__DEV__ && !(theme instanceof Theme)) {
			throw new TypeError('Only a `Theme` object can be registered.');
		}

		if (isDefault) {
			if (theme.scheme === 'dark') {
				this.darkTheme = name;
			} else {
				this.lightTheme = name;
			}
		}

		if (theme.name && theme.name !== name) {
			if (__DEV__) {
				throw new Error(`Theme "${name}" has already been registered under "${theme.name}".`);
			}
		} else {
			// eslint-disable-next-line no-param-reassign
			theme.name = name;
		}

		if (!this.defaultTheme) {
			this.defaultTheme = name;
		}

		this.themes[name] = theme;

		return this;
	}

	/**
	 * Reset the registry to initial state.
	 */
	reset() {
		this.darkTheme = '';
		this.lightTheme = '';
		this.defaultTheme = '';
		this.themes = {};
	}
}
