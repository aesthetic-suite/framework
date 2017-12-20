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
// Statement = An object of declarations. Supports global at-rules.

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
  ((statement: Statement, style: string) => void) |
  // @import
  ((statement: Statement, style: string) => void) |
  // @namespace
  ((statement: Statement, style: string) => void) |
  // @page, @viewport
  ((statement: Statement, style: StyleBlock) => void) |
  // @font-face
  ((statement: Statement, style: StyleBlock[], fontFamily: string) => void) |
  // @keyframes
  ((statement: Statement, style: StyleBlock, animationName: string) => void) |
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

export type Statement = {
  '@font-face'?: StyleBlock[],
  // At-rule values
  // CSS class names
  // Style objects
  [selector: string]: string | ClassName | StyleDeclaration,
};

export type StatementUnified = {
  '@charset': string,
  '@font-face': StyleBlock,
  '@import': string,
  '@keyframes': StyleBlock,
  '@namespace': string,
  '@page': StyleBlock,
  '@viewport': StyleBlock,
  // CSS class names
  // Style objects
  [selector: string]: ClassName | StyleDeclarationUnified,
};

export type Style = string | number | StyleBlock | Style[];

export type StyleBlock = { [property: string]: Style };

export type StatementCallback = (theme: ThemeDeclaration, prevStyles: Statement) => Statement;

export type StyleDeclaration = { [property: string]: Style };

export type StyleDeclarationUnified = {
  '@fallbacks': StyleBlock,
  '@media': StyleBlock,
  '@supports': StyleBlock,
  [property: string]: Style,
};

export type ThemeDeclaration = StyleBlock;

export type StyleSheet = { [selector: string]: Object };
