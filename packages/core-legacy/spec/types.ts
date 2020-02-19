/* eslint-disable  */

import CSS from 'csstype';

type Style = CSS.StandardProperties;

type StyleSheet = { [key: string]: Style };

export type StyleNeverize<T> = {
  [K in keyof T]: K extends keyof Style ? Style[K] : never;
};

export type StyleSheetNeverize<T> = {
  [K in keyof T]: StyleNeverize<T[K]>;
};

type StyleSheetFactory<T = unknown> = () => T extends unknown
  ? StyleSheet
  : StyleSheet & StyleSheetNeverize<T>;

type CompiledStyleSheet = { [key: string]: object };

type Transformer = (...styles: (undefined | false | string | object)[]) => string;

function createStyleSheet<T>(styleSheet: StyleSheetFactory<T>): StyleSheetFactory<T> {
  return styleSheet;
}

const styleSheet = createStyleSheet(() => ({
  button: {
    fontVariantCaps: 'normal',
    display: 'block',
  },
  button__active: {},
}));

function useStyles(styleSheet: StyleSheetFactory): [CompiledStyleSheet, Transformer] {
  return [(styleSheet as unknown) as CompiledStyleSheet, () => ''];
}

const [styles, cx] = useStyles(styleSheet);

styles.button;
styles.button__active;
