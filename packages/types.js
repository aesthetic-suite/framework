/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-use-before-define, max-len */

// TERMINOLOGY
// Style = The individual value for a property.
// Block = An object of style properties.
// Declaration = Styles for a selector. Supports local at-rules.
// Selector = The name of an element.
// StyleSheet = An object of declarations. Supports global at-rules.

export type AestheticOptions = {
  defaultTheme: string,
  extendable: boolean,
  pure: boolean,
  stylesPropName: string,
  themePropName: string,
};

export type AtRule =
  '@charset' |
  '@font-face' |
  '@global' |
  '@import' |
  '@keyframes' |
  '@media' |
  '@namespace' |
  '@page' |
  '@supports' |
  '@viewport' |
  '@fallbacks';

export type ClassName = string;

export type EventCallback =
  // @charset
  ((styleSheet: StyleSheet, style: string) => void) |
  // @import
  ((styleSheet: StyleSheet, style: string) => void) |
  // @namespace
  ((styleSheet: StyleSheet, style: string) => void) |
  // @page, @viewport
  ((styleSheet: StyleSheet, style: StyleBlock) => void) |
  // @font-face
  ((styleSheet: StyleSheet, style: StyleBlock[], fontFamily: string) => void) |
  // @keyframes
  ((styleSheet: StyleSheet, style: StyleBlock, animationName: string) => void) |
  // @global
  ((styleSheet: StyleSheet, declaration: StyleDeclaration, selector: string) => void) |
  // @fallbacks
  ((declaration: StyleDeclaration, style: Style[], property: string) => void) |
  // @media, @supports
  ((declaration: StyleDeclaration, style: StyleBlock, condition: string) => void) |
  // property
  ((declaration: StyleDeclaration, style: Style, property: string) => void);

export type HOCComponent = React$ComponentType<*>;

export type HOCOptions = {
  extendable?: boolean,
  extendFrom?: string,
  pure?: boolean,
  styleName?: string,
  stylesPropName?: string,
  themePropName?: string,
};

export type HOCWrappedComponent = React$ComponentType<*>;

export type HOCWrapper = (component: HOCWrappedComponent) => HOCComponent;

export type Style = string | number | StyleBlock | Style[];

export type StyleBlock = { [property: string]: Style };

export type StyleDeclaration = {
  '@fallbacks'?: StyleBlock,
  '@media'?: StyleBlock,
  '@supports'?: StyleBlock,
  [property: string]: Style,
};

export type StyleSheet = {
  '@charset'?: string,
  '@font-face'?: StyleBlock | StyleBlock[],
  '@global'?: { [selector]: StyleDeclaration },
  '@import'?: string,
  '@keyframes'?: StyleBlock,
  '@namespace'?: string,
  '@page'?: StyleBlock,
  '@viewport'?: StyleBlock,
  // At-rule values
  // CSS class names
  // Style objects
  [selector: string]: string | ClassName | StyleBlock | StyleDeclaration,
};

export type StyleSheetCallback = (theme: ThemeSheet, props: Object) => StyleSheet;

export type ThemeSheet = StyleBlock;
