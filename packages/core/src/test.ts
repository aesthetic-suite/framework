import { design, lightTheme, darkTheme } from '@aesthetic/system/lib/test';
import { registerDefaultTheme, resetForTesting } from './index';

export { design, lightTheme, darkTheme };

export function setupAesthetic() {
  registerDefaultTheme('day', lightTheme);
  registerDefaultTheme('night', darkTheme);
}

export function teardownAesthetic() {
  lightTheme.name = '';
  darkTheme.name = '';
  resetForTesting();
}
