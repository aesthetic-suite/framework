import { ThemeRegistry } from '@aesthetic/system';
import { design, lightTheme, darkTheme } from '@aesthetic/system/lib/test';
import { ThemeName } from '@aesthetic/types';
import { Aesthetic, AestheticOptions, EventType, GlobalSheet } from './index';

export { design, lightTheme, darkTheme };

export function resetAestheticState(aesthetic: Aesthetic) {
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

export function getAestheticState(
  aesthetic: Aesthetic,
): {
  activeDirection: string | undefined;
  activeTheme: string | undefined;
  globalSheetRegistry: Map<ThemeName, GlobalSheet>;
  listeners: Map<EventType, Set<EventListener>>;
  options: AestheticOptions;
  themeRegistry: ThemeRegistry;
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

export function setupAesthetic(aesthetic: Aesthetic) {
  aesthetic.registerTheme('day', lightTheme);
  aesthetic.registerTheme('night', darkTheme);
}

export function teardownAesthetic(aesthetic: Aesthetic) {
  lightTheme.name = '';
  darkTheme.name = '';
  resetAestheticState(aesthetic);
}
