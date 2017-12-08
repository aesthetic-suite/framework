/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-use-before-define */

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

export type AtRuleCache<T> = { [key: string]: T };

export type ClassName = string;

export type EventCallback = (() => void) |
  ((selector: string, properties: StyleDeclaration) => void) |
  ((selector: string, fallbacks: Fallbacks) => void) |
  ((selector: string, fontFamily: string, fontFaces: FontFace[]) => void) |
  ((selector: string, animationName: string, keyframe: Keyframe) => void) |
  ((selector: string, queryName: string, mediaQuery: MediaQuery) => void);

export type Fallback = string;

export type Fallbacks = { [propName: string]: Fallback | Fallback[] };

export type FontFace = {
  fontDisplay?: string,
  fontFamily: string,
  fontStyle?: string,
  fontWeight?: string | number,
  localAlias?: string[],
  src: string | string[],
  unicodeRange?: string,
};

export type FontFaces = { [fontFamily: string]: FontFace[] };

export type GlobalDeclaration = {
  '@font-face'?: FontFaces,
  '@keyframes'?: Keyframes,
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
  '@font-face'?: FontFaces,
  '@keyframes'?: Keyframes,
  '@media'?: MediaQueries,
  '@supports'?: Supports,
};

export type StyleDeclarations = SelectorMap<ClassName | StyleDeclaration>;

export type Support = StyleBlock;

export type Supports = { [feature: string]: Support };

export type ThemeDeclaration = StyleBlock;

export type TransformedDeclarations = SelectorMap<ClassName>;
