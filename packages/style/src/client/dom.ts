/* eslint-disable sort-keys */

import { Sheet, SheetMap, SheetType } from '@aesthetic/types';

export function getStyleElement(type: SheetType): Sheet {
	let element: HTMLStyleElement | null = document.querySelector(`#aesthetic-${type}`);

	if (!element) {
		element = document.createElement('style');
		element.setAttribute('id', `aesthetic-${type}`);
		element.setAttribute('type', 'text/css');
		element.setAttribute('media', 'screen');
		element.dataset.aestheticType = type;

		document.head.append(element);
	}

	return element.sheet as unknown as Sheet;
}

export function createStyleElements(): SheetMap {
	return {
		// Order is important here!
		global: getStyleElement('global'),
		standard: getStyleElement('standard'),
		conditions: getStyleElement('conditions'),
	};
}
