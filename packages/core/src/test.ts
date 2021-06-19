/* eslint-disable no-param-reassign */

import { ThemeRegistry } from '@aesthetic/system';
import { darkTheme, design, lightTheme } from '@aesthetic/system/test';
import { ThemeName } from '@aesthetic/types';
import { Aesthetic, AestheticOptions, EventListener, EventType, ThemeSheet } from '.';

export { darkTheme, design, lightTheme };

export function resetAestheticState(aesthetic: Aesthetic<any, any>) {
	// @ts-expect-error Allow access
	aesthetic.activeDirection = undefined;
	// @ts-expect-error Allow access
	aesthetic.activeTheme = undefined;
	// @ts-expect-error Allow access
	aesthetic.listeners.clear();
	// @ts-expect-error Allow access
	aesthetic.globalSheetRegistry.clear();
	// @ts-expect-error Allow access
	aesthetic.themeRegistry.reset();

	aesthetic.configure({
		customProperties: {},
		defaultUnit: 'px',
		deterministicClasses: false,
		directionConverter: null,
		rootVariables: false,
		vendorPrefixer: null,
	});
}

export function getAestheticState(aesthetic: Aesthetic<any, any>): {
	activeDirection: string | undefined;
	activeTheme: string | undefined;
	globalSheetRegistry: Map<ThemeName, ThemeSheet<any, any, any>>;
	listeners: Map<EventType, Set<EventListener>>;
	options: AestheticOptions;
	themeRegistry: ThemeRegistry<any>;
} {
	return {
		// @ts-expect-error Allow access
		activeDirection: aesthetic.activeDirection,
		// @ts-expect-error Allow access
		activeTheme: aesthetic.activeTheme,
		// @ts-expect-error Allow access
		globalSheetRegistry: aesthetic.globalSheetRegistry,
		// @ts-expect-error Allow access
		listeners: aesthetic.listeners,
		// @ts-expect-error Allow access
		options: aesthetic.options,
		// @ts-expect-error Allow access
		themeRegistry: aesthetic.themeRegistry,
	};
}

export function setupAesthetic(aesthetic: Aesthetic<any, any>) {
	aesthetic.registerTheme('day', lightTheme);
	aesthetic.registerTheme('night', darkTheme);
}

export function teardownAesthetic(aesthetic: Aesthetic<any, any>) {
	lightTheme.name = '';
	darkTheme.name = '';
	resetAestheticState(aesthetic);
}
