import { LocalBlock } from '@aesthetic/sss';
import { arrayLoop } from '@aesthetic/utils';
import { ClassName } from '@aesthetic/types';
import StyleSheet from './StyleSheet';
import { ClassNameSheet, LocalSheet, LocalSheetFactory, SheetParams } from './types';
import { getRenderer } from './render';
import { getActiveDirection } from './direction';
import { getActiveTheme, getTheme } from './themes';
import { options } from './options';

/**
 * Create a local style sheet for use within components.
 */
export function createComponentStyles<T = unknown>(
  factory: LocalSheetFactory<T, LocalBlock>,
): LocalSheet<T, LocalBlock> {
  const sheet: LocalSheet<T, LocalBlock> = new StyleSheet('local', factory);

  // Attempt to render styles immediately so they're available on mount
  renderComponentStyles(sheet);

  return sheet;
}

/**
 * Generate a class name using the selectors of a style sheet.
 * If an object is provided, it will be used to check for variants.
 */
export function generateClassName<T extends string>(
  keys: T[],
  variants: string[],
  classNames: ClassNameSheet<string>,
): ClassName {
  const className: string[] = [];

  arrayLoop(keys, (key) => {
    const hash = classNames[key];

    if (!hash) {
      return;
    }

    if (hash.class) {
      className.push(hash.class);
    }

    if (hash.variants) {
      arrayLoop(variants, (variant) => {
        if (hash.variants?.[variant]) {
          className.push(hash.variants[variant]);
        }
      });
    }
  });

  return className.join(' ');
}

/**
 * Render a component style sheet to the document with the defined style query parameters.
 */
export function renderComponentStyles<T = unknown>(
  sheet: LocalSheet<T, LocalBlock>,
  params: SheetParams = {},
) {
  if (__DEV__) {
    if (!(sheet instanceof StyleSheet) || sheet.type !== 'local') {
      throw new TypeError('Rendering component styles require a `LocalSheet` instance.');
    }
  }

  const theme = params.theme ? getTheme(params.theme) : getActiveTheme();

  return sheet.render(getRenderer(), theme, {
    direction: getActiveDirection(),
    unit: options.defaultUnit,
    vendor: !!options.vendorPrefixer,
    ...params,
  });
}
