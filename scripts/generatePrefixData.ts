import fs from 'fs';
import path from 'path';
import { getSupport, getBrowserScope, setBrowserScope } from 'caniuse-api';
import { DeclarationPrefixMap, PrefixMap } from '../packages/addon-vendor/src/types';
import prefixFeatureMapping from './prefixes';

enum Vendor {
	WEBKIT = 1,
	MOZ = 2,
	MS = 4,
}

const browsersList: string[] = ['> 1%', 'not dead'];

// Based on the query above
// https://browserl.ist/?q=%3E+1%25%2C+not+dead
// https://caniuse.com/usage-table
const browserSupport: { [browser: string]: { type: number; version: number } } = {
	and_chr: { type: Vendor.WEBKIT, version: 78 },
	and_uc: { type: Vendor.WEBKIT, version: 12.12 },
	chrome: { type: Vendor.WEBKIT, version: 77 },
	edge: { type: Vendor.MS, version: 18 }, // Switched to webkit in 79
	firefox: { type: Vendor.MOZ, version: 70 },
	ie: { type: Vendor.MS, version: 11 },
	ios_saf: { type: Vendor.WEBKIT, version: 12.4 },
	op_mini: { type: Vendor.WEBKIT, version: 59 },
	safari: { type: Vendor.WEBKIT, version: 13 },
	samsung: { type: Vendor.WEBKIT, version: 10.1 },
};

// Based on the list used in autoprefixer
// https://github.com/postcss/autoprefixer/blob/master/data/prefixes.js
const featuresList: string[] = [
	'background-clip-text',
	'border-image',
	'border-radius',
	'calc',
	'css-animation',
	'css-any-link',
	'css-appearance',
	'css-backdrop-filter',
	'css-boxdecorationbreak',
	'css-boxshadow',
	'css-clip-path',
	'css-color-adjust',
	'css-crisp-edges',
	'css-cross-fade',
	'css-deviceadaptation',
	'css-element-function',
	'css-filter-function',
	'css-filters',
	'css-gradients',
	'css-grid',
	'css-hyphens',
	'css-image-set',
	'css-logical-props',
	'css-masks',
	'css-media-resolution',
	'css-overscroll-behavior',
	'css-placeholder-shown',
	'css-placeholder',
	'css-read-only-write',
	'css-regions',
	'css-selection',
	'css-shapes',
	'css-snappoints',
	'css-sticky',
	'css-text-align-last',
	'css-text-orientation',
	'css-text-spacing',
	'css-transitions',
	'css-unicode-bidi',
	'css-writing-mode',
	'css3-boxsizing',
	'css3-cursors-grab',
	'css3-cursors-newer',
	'css3-tabsize',
	'flexbox',
	'font-feature',
	'font-kerning',
	'fullscreen',
	'intrinsic-width',
	'multicolumn',
	'object-fit',
	'pointer',
	'text-decoration',
	'text-emphasis',
	'text-overflow',
	'text-size-adjust',
	'transforms2d',
	'transforms3d',
	'user-select-none',
];

// A static mapping of all prefixes to CSS properties
const declarationMapping: DeclarationPrefixMap = {};
const selectorMapping: PrefixMap = {};

function getPrefixMapItem(property: string) {
	if (!declarationMapping[property]) {
		declarationMapping[property] = {};
	}

	return declarationMapping[property];
}

function addPropertyPrefix(property: string, prefix: number) {
	const item = getPrefixMapItem(property);

	item.prefixes = (item.prefixes || 0) | prefix;
}

function addFunctionPrefix(property: string, func: string, prefix: number) {
	const item = getPrefixMapItem(property);

	if (!item.functions) {
		item.functions = {};
	}

	item.functions[func] = (item.functions[func] || 0) | prefix;
}

function addValuePrefix(property: string, value: string, prefix: number) {
	const item = getPrefixMapItem(property);

	if (!item.values) {
		item.values = {};
	}

	item.values[value] = (item.values[value] || 0) | prefix;
}

function addSelectorPrefix(selector: string, prefix: number) {
	selectorMapping[selector] = (selectorMapping[selector] || 0) | prefix;
}

// Dynamically generate the mapping
setBrowserScope(browsersList.join(', '));

const browsers = getBrowserScope();
const requiresPrefix = new Set<string>();

featuresList.forEach((feature) => {
	const support = getSupport(feature);

	for (const browser of browsers) {
		const versions = support[browser] || {};

		if (!browserSupport[browser]) {
			throw new Error(`No mapping for browser "${browser}".`);
		}

		const { type, version } = browserSupport[browser];

		// @ts-ignore Thinks object is undefined
		if (versions.x >= version && prefixFeatureMapping[feature]) {
			requiresPrefix.add(feature);

			const { props = [], function: func, selectors, values } = prefixFeatureMapping[feature];

			if (selectors) {
				selectors.forEach((selector) => addSelectorPrefix(selector, type));
			}

			if (values) {
				props.forEach((prop) => {
					values.forEach((value) => addValuePrefix(prop, value, type));
				});
			} else if (func) {
				props.forEach((prop) => addFunctionPrefix(prop, func, type));
			} else {
				props.forEach((prop) => addPropertyPrefix(prop, type));
			}
		}
	}
});

fs.writeFileSync(
	path.join(__dirname, '../packages/addon-vendor/src/data.ts'),
	`/* eslint-disable sort-keys */

import { DeclarationPrefixMap, PrefixMap } from './types';

export const declarationMapping: DeclarationPrefixMap = ${JSON.stringify(declarationMapping)}

export const selectorMapping: PrefixMap = ${JSON.stringify(selectorMapping)}`,
	'utf8',
);
