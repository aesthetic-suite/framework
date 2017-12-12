/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-use-before-define, max-len */

// TERMINOLOGY
// Style = The individual value for a property.
// Block = An object of style properties.
// Declaration = Styles for a selector. Supports at-rules.
// Selector = The name of an element.

export type AestheticOptions = {
  defaultTheme: string,
  extendable: boolean,
  pure: boolean,
  stylesPropName: string,
  themePropName: string,
};

export type AtRule =
  '@charset' |
  '@document' |
  '@font-face' |
  '@import' |
  '@keyframes' |
  '@media' |
  '@namespace' |
  '@page' |
  '@supports' |
  '@viewport' |
  '@fallbacks';

export type AtRuleConfig = {
  cache: { [key: string]: * },
  format: AtRuleFormatter,
  nested: boolean,
  rule: AtRule,
};

export type AtRuleFormatter = (rule: AtRule, value: string | StyleBlock) => *;

export type ClassName = string;

export type EventCallback = (() => void) |
  // @charset
  ((statement: Statement, style: string) => void) |
  // @document
  ((statement: Statement, style: StyleBlock, url: string) => void) |
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
  // @media
  ((declaration: StyleDeclaration, style: StyleBlock, condition: string) => void) |
  // @supports
  ((declaration: StyleDeclaration, style: StyleBlock, condition: string) => void) |
  // property
  ((declaration: StyleDeclaration, style: Style, property: string) => void);

export type Fallback = string;

export type Fallbacks = { [property: string]: Fallback | Fallback[] };

export type FontFace = {
  fontDisplay?: string,
  fontFamily: string,
  fontStyle?: string,
  fontWeight?: string | number,
  local?: string[],
  src: string | string[],
  unicodeRange?: string,
};

export type FontFaces = { [fontFamily: string]: FontFace | FontFace[] };

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

export type Keyframe = {
  from?: StyleBlock,
  to?: StyleBlock,
  [percentage: string]: StyleBlock,
};

export type Keyframes = { [animationName: string]: Keyframe };

export type MediaQuery = StyleBlock;

export type MediaQueries = { [condition: string]: MediaQuery };

export type Statement = {
  '@font-face'?: StyleBlock[],
  // At-rule values
  // CSS class names
  // Style objects
  [selector: string]: string | ClassName | StyleDeclaration,
};

export type StatementUnified = {
  '@charset': string,
  '@document': StyleBlock,
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

export type StyleCallback = (theme: ThemeDeclaration, prevStyles: Statement) => Statement;

export type StyleDeclaration = { [property: string]: Style };

export type StyleDeclarationUnified = {
  '@fallbacks': StyleBlock,
  '@media': StyleBlock,
  '@supports': StyleBlock,
  [property: string]: Style,
};

export type ThemeDeclaration = StyleBlock;

export type StyleSheet = { [selector: string]: ClassName };

export type Support = StyleBlock;

export type Supports = { [condition: string]: Support };
