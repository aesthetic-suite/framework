import { ThemeRegistry } from '@aesthetic/system';
import { darkTheme, design, lightTheme } from '@aesthetic/system/test';
import { ThemeName } from '@aesthetic/types';
import { Aesthetic, AestheticOptions, EventListener, EventType, GlobalSheet } from './index';

export { darkTheme, design, lightTheme };

export function resetAestheticState(aesthetic: Aesthetic<any, any>) {
	// @ts-expect-error
	aesthetic.activeDirection.reset();
	// @ts-expect-error
	aesthetic.activeTheme.reset();
	// @ts-expect-error
	aesthetic.listeners.clear();
	// @ts-expect-error
	aesthetic.globalSheetRegistry.clear();
	// @ts-expect-error
	aesthetic.themeRegistry.reset();

	aesthetic.configure({
		customProperties: {},
		defaultUnit: 'px',
		deterministicClasses: false,
		directionConverter: null,
		vendorPrefixer: null,
	});
}

export function getAestheticState(aesthetic: Aesthetic<any, any>): {
	activeDirection: string | undefined;
	activeTheme: string | undefined;
	globalSheetRegistry: Map<ThemeName, GlobalSheet<any, any, any>>;
	listeners: Map<EventType, Set<EventListener>>;
	options: AestheticOptions;
	themeRegistry: ThemeRegistry<any>;
} {
	return {
		// @ts-expect-error
		activeDirection: aesthetic.activeDirection.get(),
		// @ts-expect-error
		activeTheme: aesthetic.activeTheme.get(),
		// @ts-expect-error
		globalSheetRegistry: aesthetic.globalSheetRegistry,
		// @ts-expect-error
		listeners: aesthetic.listeners,
		// @ts-expect-error
		options: aesthetic.options,
		// @ts-expect-error
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
