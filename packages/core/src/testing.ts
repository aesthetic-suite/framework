import { getRenderedStyles, purgeStyles } from '@aesthetic/style/lib/testing';
import { design, lightTheme, darkTheme } from '@aesthetic/system/lib/testing';
// eslint-disable-next-line unicorn/import-index
import { registerDefaultTheme, resetForTesting } from './index';

export { design, lightTheme, darkTheme, getRenderedStyles, purgeStyles };

export function setupAesthetic() {
  registerDefaultTheme('day', lightTheme);
  registerDefaultTheme('night', darkTheme);
}

export function teardownAesthetic() {
  lightTheme.name = '';
  darkTheme.name = '';
  resetForTesting();
}
