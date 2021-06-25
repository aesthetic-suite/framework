import { camelCase, kebabCase } from 'lodash';
import { DeepPartial, Hexcode } from '@aesthetic/system';
import { ColorScheme, ContrastLevel } from '@aesthetic/types';
import { deepMerge } from '@aesthetic/utils';
import {
	INHERIT_SETTING,
	SHADE_BASE,
	SHADE_DISABLED,
	SHADE_FOCUSED,
	SHADE_HOVERED,
	SHADE_SELECTED,
	SHADE_TEXT,
} from './constants';
import { formatShade } from './helpers';
import {
	ColorName,
	ColorShadeRef,
	PaletteConfig,
	PaletteState,
	PaletteTemplate,
	ThemeConfig,
	ThemeTemplate,
} from './types';

export class SystemTheme<ColorNames extends string = string> {
	contrast: ContrastLevel;

	dashedName: string;

	extendedFrom: string;

	name: string;

	scheme: ColorScheme;

	template: ThemeTemplate;

	private readonly config: ThemeConfig<ColorNames>;

	constructor(name: string, config: ThemeConfig<ColorNames>, extendedFrom: string = '') {
		this.name = camelCase(name);
		this.dashedName = kebabCase(name);
		this.config = config;
		this.contrast = config.contrast;
		this.scheme = config.scheme;
		this.template = {
			palette: this.compilePalettes(),
		};
		this.extendedFrom = camelCase(extendedFrom);
	}

	extend(
		name: string,
		config: DeepPartial<ThemeConfig<ColorNames>>,
		extendedFrom: string,
	): SystemTheme<ColorNames> {
		return new SystemTheme(name, deepMerge(this.config, config), extendedFrom);
	}

	protected getColor(ref: ColorShadeRef): ColorName {
		return ref.split('.')[0];
	}

	protected getHexcode(color: string, shade: number | string): Hexcode {
		const shades = this.config.colors[color as ColorNames];

		if (typeof shades === 'string') {
			return shades;
		}

		return shades[formatShade(shade)];
	}

	protected getHexcodeByRef(ref: ColorShadeRef, defaultShade: number = 40): Hexcode {
		const [color, shade] = ref.split('.');

		return this.getHexcode(color, shade || defaultShade);
	}

	protected compilePalettes(): ThemeTemplate['palette'] {
		const { palettes } = this.config;
		const tokens: Partial<ThemeTemplate['palette']> = {};

		Object.entries(palettes).forEach(([name, config]) => {
			tokens[name as keyof typeof palettes] = this.compilePalette(config);
		});

		return tokens as ThemeTemplate['palette'];
	}

	protected compilePalette(config: ColorName | PaletteConfig): PaletteTemplate {
		let color = '';
		let text = '';
		let bg: PaletteConfig['bg'] = '';
		let fg: PaletteConfig['fg'] = '';

		if (typeof config === 'string') {
			color = config;
			text = config;
			bg = config;
			fg = config;
		} else {
			({ color, text, bg, fg } = config);
		}

		const colorShades = this.config.colors[color as ColorNames];

		if (typeof colorShades === 'string') {
			throw new TypeError(
				`Expected color "${color}" to be an object of shades, but found a single shade (a string).`,
			);
		}

		return {
			color: colorShades,
			text: this.getHexcodeByRef(text === INHERIT_SETTING ? color : text, SHADE_TEXT),
			bg: this.compilePaletteState(bg === INHERIT_SETTING ? color : bg),
			fg: this.compilePaletteState(fg === INHERIT_SETTING ? 'white' : fg),
		};
	}

	protected compilePaletteState(
		config: ColorName | PaletteState<ColorShadeRef>,
	): PaletteState<Hexcode> {
		let base = '';
		let focused = '';
		let hovered = '';
		let selected = '';
		let disabled = '';

		if (typeof config === 'string') {
			base = config;
			focused = config;
			hovered = config;
			selected = config;
			disabled = config;
		} else {
			({ base, focused, hovered, selected, disabled } = config);
		}

		const baseColor = this.getColor(base);

		return {
			base: this.getHexcodeByRef(base, SHADE_BASE),
			focused: this.getHexcodeByRef(
				focused === INHERIT_SETTING ? baseColor : focused,
				SHADE_FOCUSED,
			),
			hovered: this.getHexcodeByRef(
				hovered === INHERIT_SETTING ? baseColor : hovered,
				SHADE_HOVERED,
			),
			selected: this.getHexcodeByRef(
				selected === INHERIT_SETTING ? baseColor : selected,
				SHADE_SELECTED,
			),
			disabled: this.getHexcodeByRef(
				disabled === INHERIT_SETTING ? baseColor : disabled,
				SHADE_DISABLED,
			),
		};
	}
}
