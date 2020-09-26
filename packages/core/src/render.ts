import {
  FontFace as SSSFontFace,
  Import as SSSImport,
  formatFontFace,
  formatImport,
} from '@aesthetic/sss';
import { Renderer, ClientRenderer, ProcessOptions } from '@aesthetic/style';
import { FontFace, Keyframes } from '@aesthetic/types';
import { createState } from '@aesthetic/utils';
import { getActiveDirection } from './direction';
import { options } from './options';

export const styleRenderer = createState<Renderer>();

/**
 * Return a style renderer. When SSR, use a server based renderer.
 */
export function getRenderer() {
  const current = styleRenderer.get();

  if (current) {
    return current;
  }

  const renderer = global.AESTHETIC_CUSTOM_RENDERER || new ClientRenderer();

  renderer.api.direction = getActiveDirection();
  renderer.api.converter = options.directionConverter;
  renderer.api.prefixer = options.vendorPrefixer;

  styleRenderer.set(renderer);

  return renderer;
}

/**
 * Hydrate styles from the document if they have been pre-compiled during a server-side render.
 */
export function hydrate() {
  const renderer = getRenderer();

  if (renderer instanceof ClientRenderer) {
    renderer.hydrateStyles();
  }
}

/**
 * Render a `@font-face` to the global style sheet and return the font family name.
 */
export function renderFontFace(
  fontFace: FontFace | SSSFontFace,
  fontFamily?: string,
  params?: ProcessOptions,
) {
  return getRenderer().renderFontFace(
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
  return getRenderer().renderImport(formatImport(path));
}

/**
 * Render a `@keyframes` to the global style sheet and return the animation name.
 */
export function renderKeyframes(
  keyframes: Keyframes,
  animationName?: string,
  params?: ProcessOptions,
) {
  return getRenderer().renderKeyframes(keyframes, animationName, params);
}
