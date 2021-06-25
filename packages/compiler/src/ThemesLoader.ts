import optimal, {
	object,
	ObjectOf,
	ObjectPredicate,
	Schema,
	shape,
	ShapePredicate,
	string,
	StringPredicate,
	union,
	UnionPredicate,
} from 'optimal';
import { DeepPartial, Hexcode } from '@aesthetic/system';
import { ColorScheme, ContrastLevel } from '@aesthetic/types';
import { deepMerge } from '@aesthetic/utils';
import { Path } from '@boost/common';
import { INHERIT_SETTING, SHADE_RANGES, THEMES_FILE } from './constants';
import { Loader } from './Loader';
import {
	ColorConfig,
	ColorName,
	ColorShadeRef,
	PaletteConfig,
	PalettesConfig,
	PaletteState,
	ThemeConfig,
	ThemesConfigFile,
} from './types';

const COLOR_SHADE_REF_PATTERN = new RegExp(`^[a-z0-9]+(.(${SHADE_RANGES.join('|')}))?$`, 'iu');

function hexcode() {
	return string()
		.match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/iu)
		.required();
}

export class ThemesLoader extends Loader<ThemesConfigFile> {
	colorNames: string[];

	constructor(colorNames: string[]) {
		super();

		this.colorNames = colorNames;
	}

	getFileName() {
		return THEMES_FILE;
	}

	validate(config: DeepPartial<ThemesConfigFile>, filePath: Path): ThemesConfigFile {
		const themes: ThemesConfigFile['themes'] = {};

		// Merge themes that extend from each other,
		// as our validation requires many fields to exist
		if (config.themes) {
			Object.entries<ThemeConfig>(config.themes as ThemesConfigFile['themes']).forEach(
				([name, theme]) => {
					if (theme.extends) {
						const parentTheme = themes[theme.extends];

						if (!parentTheme) {
							throw new Error(`Parent theme "${theme.extends}" does not exist.`);
						}

						themes[name] = deepMerge(parentTheme, theme);
					} else {
						themes[name] = theme;
					}
				},
			);

			// eslint-disable-next-line no-param-reassign
			config.themes = themes;
		}

		return optimal(
			config,
			{
				extends: string(),
				themes: this.themes(),
			},
			{ file: process.env.NODE_ENV === 'test' ? undefined : filePath.path() },
		);
	}

	protected colorName(): StringPredicate {
		return string().notEmpty().custom(this.validatePaletteColorReference);
	}

	protected colorShadeRef(): StringPredicate {
		return string(INHERIT_SETTING)
			.match(COLOR_SHADE_REF_PATTERN)
			.custom((ref) => {
				const [color] = ref.split('.');

				this.validatePaletteColorReference(color);
			});
	}

	protected themes(): ObjectPredicate<ThemeConfig, string> {
		return object(
			shape<ThemeConfig>({
				colors: this.themeColors(),
				contrast: string('normal').oneOf<ContrastLevel>(['high', 'low', 'normal']),
				extends: string(),
				palettes: shape<PalettesConfig>({
					brand: this.themePalette(),
					danger: this.themePalette(),
					muted: this.themePalette(),
					negative: this.themePalette(),
					neutral: this.themePalette(),
					positive: this.themePalette(),
					primary: this.themePalette(),
					secondary: this.themePalette(),
					tertiary: this.themePalette(),
					warning: this.themePalette(),
				})
					.exact()
					.required(),
				scheme: string('light').oneOf<ColorScheme>(['dark', 'light']),
			}).exact(),
		);
	}

	protected themeColors(): ObjectPredicate<ColorConfig | Hexcode> {
		return object(
			union<ColorConfig | string>(
				[
					shape<ColorConfig>({
						'00': hexcode(),
						'10': hexcode(),
						'20': hexcode(),
						'30': hexcode(),
						'40': hexcode(),
						'50': hexcode(),
						'60': hexcode(),
						'70': hexcode(),
						'80': hexcode(),
						'90': hexcode(),
					}).exact(),
					hexcode(),
				],
				'',
			),
		)
			.custom(this.validateThemeImplementsColors)
			.required();
	}

	protected themePaletteState(): ShapePredicate<PaletteState<ColorShadeRef>> {
		return shape({
			base: this.colorShadeRef(),
			focused: this.colorShadeRef(),
			hovered: this.colorShadeRef(),
			selected: this.colorShadeRef(),
			disabled: this.colorShadeRef(),
		}).exact();
	}

	protected themePalette(): UnionPredicate<ColorName | PaletteConfig> {
		return union(
			[
				this.colorName(),
				shape<PaletteConfig>({
					color: this.colorName().required().notEmpty(),
					text: union([this.colorName(), this.colorShadeRef()], INHERIT_SETTING),
					bg: union([this.colorName(), this.themePaletteState()], INHERIT_SETTING),
					fg: union([this.colorName(), this.themePaletteState()], INHERIT_SETTING),
				})
					.exact()
					.required(),
			],
			'',
		);
	}

	protected validatePaletteColorReference = (name: string) => {
		if (name === INHERIT_SETTING) {
			return;
		}

		const names = new Set<string>(this.colorNames);

		if (!names.has(name)) {
			throw new Error(`Invalid color "${name}".`);
		}
	};

	protected validateThemeImplementsColors = (
		colors: ObjectOf<ColorConfig | Hexcode>,
		schema: Schema<ThemesConfigFile>,
	) => {
		const theme = schema.currentPath.split('.')[1];
		const names = new Set<string>(this.colorNames);
		const unknown = new Set<string>();

		// Theme extends another theme, so dont validate as it will merge
		if (schema.struct.themes?.[theme]?.extends) {
			return;
		}

		Object.keys(colors).forEach((color) => {
			if (names.has(color)) {
				names.delete(color);
			} else {
				unknown.add(color);
			}
		});

		if (names.size > 0) {
			throw new Error(`Theme has not implemented the following colors: ${[...names].join(', ')}`);
		}

		if (unknown.size > 0) {
			throw new Error(`Theme is using unknown colors: ${[...unknown].join(', ')}`);
		}
	};
}
