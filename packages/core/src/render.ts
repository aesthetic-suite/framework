/* eslint-disable no-param-reassign */

import {
  FontFace as SSSFontFace,
  Import as SSSImport,
  formatFontFace,
  formatImport,
} from '@aesthetic/sss';
import { ClassName, Engine, FontFace, Keyframes, RenderOptions } from '@aesthetic/types';
import { createState } from '@aesthetic/utils';
import { getActiveDirection } from './direction';
import { options } from './options';

export const styleEngine = createState<Engine<ClassName>>();

export function configureEngine(engine: Engine<ClassName>) {
  engine.direction = getActiveDirection();

  if (!engine.directionConverter && options.directionConverter) {
    engine.directionConverter = options.directionConverter;
  }

  if (!engine.unitSuffixer && options.defaultUnit) {
    engine.unitSuffixer = options.defaultUnit;
  }

  if (!engine.vendorPrefixer && options.vendorPrefixer) {
    engine.vendorPrefixer = options.vendorPrefixer;
  }

  styleEngine.set(engine);
}

/**
 * Return a style engine.
 */
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
export function renderImport(path: string | SSSImport) {
  return getEngine().renderImport(formatImport(path));
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
