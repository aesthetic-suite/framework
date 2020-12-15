import { design, lightTheme, darkTheme } from '@aesthetic/system/lib/test';
import { Aesthetic } from './index';

export { design, lightTheme, darkTheme };

export function setupAesthetic(aesthetic: Aesthetic) {
  aesthetic.registerDefaultTheme('day', lightTheme);
  aesthetic.registerDefaultTheme('night', darkTheme);
}

export function teardownAesthetic(aesthetic: Aesthetic) {
  lightTheme.name = '';
  darkTheme.name = '';
  aesthetic.resetForTesting();
}
