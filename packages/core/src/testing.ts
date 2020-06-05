import { getRenderedStyles, purgeStyles, purgeStyles } from '@aesthetic/style/lib/testing';
import { design, lightTheme, darkTheme } from '@aesthetic/system/lib/testing';
import Aesthetic from './Aesthetic';

export { design, lightTheme, darkTheme, getRenderedStyles, purgeStyles, purgeStyles };

export function setupAesthetic(aesthetic: Aesthetic) {
  aesthetic.registerDefaultTheme('day', lightTheme);
  aesthetic.registerDefaultTheme('night', darkTheme);
}

export function teardownAesthetic(aesthetic: Aesthetic) {
  lightTheme.name = '';
  darkTheme.name = '';
  aesthetic.resetForTesting();
}
