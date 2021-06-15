import {
	ClassName,
	CSS,
	CSSType,
	FontFace,
	GenericProperties,
	Import,
	NativeProperty,
	RenderOptions,
	Value,
	VariablesMap,
} from '@aesthetic/types';
import { arrayLoop, arrayReduce, hyphenate, objectReduce } from '@aesthetic/utils';
import { StyleEngine } from '../types';
import { isUnitlessProperty, isVariable } from './helpers';

export function formatVariable(name: string): string {
	let varName = hyphenate(name);

	if (!isVariable(varName)) {
		varName = `--${varName}`;
	}

	return varName;
}

export function formatProperty(property: string): string {
	return hyphenate(property);
}

export function formatValue(
	property: NativeProperty,
	value: unknown,
	options: RenderOptions,
	engine: StyleEngine,
): string {
	if (typeof value === 'string' || isUnitlessProperty(property) || value === 0) {
		return String(value);
	}

	let suffix = options.unit;

	if (!suffix) {
		const { unitSuffixer } = engine;

		suffix = typeof unitSuffixer === 'function' ? unitSuffixer(property) : unitSuffixer;
	}

	return String(value) + (suffix ?? 'px');
}

export function formatDeclaration(key: string, value: Value | Value[]): CSS {
	if (Array.isArray(value)) {
		return arrayReduce(value, (val) => formatDeclaration(key, val));
	}

	return `${key}:${value};`;
}

const FORMATS: Record<string, string> = {
	'.eot': 'embedded-opentype',
	'.otf': 'opentype',
	'.svg': 'svg',
	'.svgz': 'svg',
	'.ttf': 'truetype',
	'.woff': 'woff',
	'.woff2': 'woff2',
};

export function formatFontFace(properties: Partial<FontFace>): CSSType.AtRule.FontFace {
	const fontFace = { ...properties };
	const src: string[] = [];

	if (Array.isArray(fontFace.local)) {
		arrayLoop(fontFace.local, (alias) => {
			src.push(`local('${alias}')`);
		});

		delete fontFace.local;
	}

	if (Array.isArray(fontFace.srcPaths)) {
		arrayLoop(fontFace.srcPaths, (srcPath) => {
			let ext = srcPath.slice(srcPath.lastIndexOf('.'));

			if (ext.includes('?')) {
				[ext] = ext.split('?');
			}

			if (FORMATS[ext]) {
				src.push(`url('${srcPath}') format('${FORMATS[ext]}')`);
			} else if (__DEV__) {
				throw new Error(`Unsupported font format "${ext}".`);
			}
		});

		delete fontFace.srcPaths;
	} else {
		return fontFace;
	}

	fontFace.src = src.join(', ');

	return fontFace;
}

export function formatImport(value: Import | string): string {
	if (typeof value === 'string') {
		return value;
	}

	let path = `"${value.path}"`;

	if (value.url) {
		path = `url(${path})`;
	}

	if (value.media) {
		path += ` ${value.media}`;
	}

	return path;
}

export function formatRule(
	className: ClassName,
	block: CSS,
	{ media, selector = '', supports }: RenderOptions,
): CSS {
	let rule = `.${className}${selector} { ${block} }`;

	// Server-side rendering recursively creates CSS rules to collapse
	// conditionals to their smallest representation, so we need to avoid
	// wrapping with the outer conditional for this to work correctly.
	if (!process.env.AESTHETIC_SSR) {
		if (media) {
			rule = `@media ${media} { ${rule} }`;
		}

		if (supports) {
			rule = `@supports ${supports} { ${rule} }`;
		}
	}

	return rule;
}

export function formatVariableBlock(variables: VariablesMap): CSS {
	return objectReduce(variables, (value, key) => formatDeclaration(formatVariable(key), value));
}

export function createDeclaration(
	property: string,
	value: unknown,
	options: RenderOptions,
	engine: StyleEngine,
): CSS {
	const { directionConverter, vendorPrefixer } = engine;
	let key = formatProperty(property) as NativeProperty;
	let val = formatValue(key, value, options, engine);

	// Convert between LTR and RTL
	if (options.direction && directionConverter) {
		({ property: key, value: val } = directionConverter.convert(
			engine.direction,
			options.direction,
			key,
			val,
		));
	}

	// Apply vendor prefixes and format declaration(s)
	return options.vendor && vendorPrefixer
		? objectReduce(vendorPrefixer.prefix(key, val), (v, k) => formatDeclaration(k, v))
		: formatDeclaration(key, val);
}

export function createDeclarationBlock(
	properties: GenericProperties,
	options: RenderOptions,
	engine: StyleEngine,
): CSS {
	return objectReduce(properties, (value, key) => createDeclaration(key, value, options, engine));
}
