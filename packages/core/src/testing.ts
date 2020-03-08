/* eslint-disable unicorn/import-index */

import { design, lightTheme, darkTheme } from '@aesthetic/system/lib/testing';
import { aesthetic } from './index';

export { design, lightTheme, darkTheme };

export function setupAesthetic() {
  aesthetic.registerDefaultTheme('day', lightTheme);
  aesthetic.registerDefaultTheme('night', darkTheme);
}

export function teardownAesthetic() {
  lightTheme.name = '';
  darkTheme.name = '';
  aesthetic.resetForTesting();
}
