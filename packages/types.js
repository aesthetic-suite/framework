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

export type AtRule = '@charset' |
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
  ((statement: StyleDeclarations, style: Style) => void) |
  // @font-face
  ((statement: StyleDeclarations, style: FontFace[], fontFamily: string) => void) |
  // @keyframes
  ((statement: StyleDeclarations, style: Keyframe, animationName: string) => void) |
  // @fallbacks
  ((declaration: StyleDeclaration, style: Fallbacks) => void) |
  // @media
  ((declaration: StyleDeclaration, style: MediaQuery, condition: string) => void) |
  // @supports
  ((declaration: StyleDeclaration, style: Support, condition: string) => void) |
  // property
  ((declaration: StyleDeclaration, style: Style, property: string) => void);

export type Fallback = string;

export type Fallbacks = { [propName: string]: Fallback | Fallback[] };

export type FontFace = {
  fontDisplay?: string,
  fontFamily: string,
  fontStyle?: string,
  fontWeight?: string | number,
  local?: string[],
  src: string | string[],
  unicodeRange?: string,
};

export type FontFaces = { [fontFamily: string]: FontFace[] };

export type GlobalDeclaration = {
  [propName: string]: Style,
  '@charset'?: string,
  '@document'?: StyleDeclaration,
  '@font-face'?: FontFaces,
  '@import'?: string,
  '@keyframes'?: Keyframes,
  '@namespace'?: string,
  '@page'?: StyleDeclaration,
  '@viewport'?: StyleDeclaration,
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

export type SelectorMap<T> = { [selector: string]: T };

export type Style = string | string[] | number | StyleBlock | StyleBlock[];

export type StyleBlock = { [propName: string]: Style };

export type StyleCallback = (
  theme: ThemeDeclaration,
  prevStyles: StyleDeclarations,
) => StyleDeclarations;

export type StyleDeclaration = {
  [propName: string]: Style,
  '@fallbacks'?: Fallbacks,
  '@media'?: MediaQueries,
  '@supports'?: Supports,
};

export type StyleDeclarations = SelectorMap<ClassName | StyleDeclaration>;

export type Support = StyleBlock;

export type Supports = { [feature: string]: Support };

export type ThemeDeclaration = StyleBlock;

export type TransformedDeclarations = SelectorMap<ClassName>;
