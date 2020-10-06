import { FontFace as SSSFontFace, formatFontFace } from '@aesthetic/sss';
import { ClassName, Engine, FontFace, Keyframes, RenderOptions } from '@aesthetic/types';
import { styleEngine } from './options';

export function getEngine(): Engine<ClassName> {
  const current = global.AESTHETIC_CUSTOM_ENGINE || styleEngine.get();

  if (current) {
    return current;
  }

  throw new Error('No style engine defined. Have you configured one with `configureEngine()`?');
}

/**
 * Render a `@font-face` to the global style sheet and return the font family name.
 */
export function renderFontFace(
  fontFace: FontFace | SSSFontFace,
  fontFamily?: string,
  params?: RenderOptions,
) {
  return getEngine().renderFontFace(
    formatFontFace({
      fontFamily,
      ...fontFace,
    }) as FontFace,
    params,
  );
}

/**
 * Render an `@import` to the global style sheet.
 */
export function renderImport(path: string, params?: RenderOptions) {
  return getEngine().renderImport(path, params);
}

/**
 * Render a `@keyframes` to the global style sheet and return the animation name.
 */
export function renderKeyframes(
  keyframes: Keyframes,
  animationName?: string,
  params?: RenderOptions,
) {
  return getEngine().renderKeyframes(keyframes, animationName, params);
}
