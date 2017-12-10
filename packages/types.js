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
  cache: { [key: string]: boolean },
  format: AtRuleFormatter,
  nested: boolean,
  rule: AtRule,
};

export type AtRuleFormatter = (rule: AtRule, value: *) => *;

export type ClassName = string;

export type EventCallback = (() => void) |
  // @charset, @document, @import, @namespace, @page, @viewport
  ((statement: Statement, style: Style) => void) |
  // @font-face
  ((statement: Statement, style: FontFace[], fontFamily: string) => void) |
  // @keyframes
  ((statement: Statement, style: Keyframe, animationName: string) => void) |
  // @fallbacks
  ((declaration: StyleDeclaration, style: Fallbacks) => void) |
  // @media
  ((declaration: StyleDeclaration, style: MediaQuery, condition: string) => void) |
  // @supports
  ((declaration: StyleDeclaration, style: Support, condition: string) => void) |
  // property
  ((declaration: StyleDeclaration, style: Style, property: string) => void);

export type Fallback = string;

export type Fallbacks = { [property: string]: Fallback[] }; // Formatted

export type FontFace = {
  fontDisplay?: string,
  fontFamily: string,
  fontStyle?: string,
  fontWeight?: string | number,
  local?: string[],
  src: string | string[],
  unicodeRange?: string,
};

export type FontFaces = { [fontFamily: string]: FontFace[] }; // Formatted

export type GlobalDeclaration = {
  '@charset'?: string,
  '@document'?: { [url: string]: StyleBlock },
  '@font-face'?: { [fontFamily: string]: FontFace | FontFace[] },
  '@import'?: string,
  '@keyframes'?: { [animationName: string]: Keyframe },
  '@namespace'?: string,
  '@page'?: StyleBlock,
  '@viewport'?: StyleBlock,
};

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

export type MediaQueries = { [query: string]: MediaQuery };

export type Statement = {
  ...GlobalDeclaration,
  [selector: string]: ClassName | StyleDeclaration,
};

export type Style = string | string[] | number | StyleBlock | StyleBlock[];

export type StyleBlock = { [property: string]: Style };

export type StyleCallback = (theme: ThemeDeclaration, prevStyles: Statement) => Statement;

export type StyleDeclaration = {
  [property: string]: Style,
  '@fallbacks'?: Fallbacks,
  '@media'?: MediaQueries,
  '@supports'?: Supports,
};

export type Support = StyleBlock;

export type Supports = { [feature: string]: Support };

export type ThemeDeclaration = StyleBlock;

export type StyleSheet = { [selector: string]: ClassName }
