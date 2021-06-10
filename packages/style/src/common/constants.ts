// We duplicate these as they're not available in SSR
export const STYLE_RULE = 1;
export const IMPORT_RULE = 3;
export const MEDIA_RULE = 4;
export const FONT_FACE_RULE = 5;
export const KEYFRAME_RULE = 6;
export const KEYFRAMES_RULE = 7;
export const SUPPORTS_RULE = 12;

export const VARIANT_PATTERN = /([a-z][a-z0-9]*:[a-z0-9_-]+)/iu;
export const VARIANT_COMBO_PATTERN = new RegExp(
  `^${VARIANT_PATTERN.source}( \\+ ${VARIANT_PATTERN.source})*$`,
  'iu',
);
