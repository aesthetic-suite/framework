/* eslint-disable unicorn/import-index */

import { getRenderedStyles, purgeStyles } from '@aesthetic/style/lib/testing';
import { design, lightTheme, darkTheme } from '@aesthetic/system/lib/testing';
import { aesthetic } from './index';
import Aesthetic from './Aesthetic';

export { design, lightTheme, darkTheme, getRenderedStyles, purgeStyles };

export function setupAesthetic(customAesthetic: Aesthetic = aesthetic) {
  customAesthetic.registerDefaultTheme('day', lightTheme);
  customAesthetic.registerDefaultTheme('night', darkTheme);
}

export function teardownAesthetic(customAesthetic: Aesthetic = aesthetic) {
  lightTheme.name = '';
  darkTheme.name = '';
  customAesthetic.resetForTesting();
}
