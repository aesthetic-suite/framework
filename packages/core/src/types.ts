/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import CSS from 'csstype'; // eslint-disable-line import/no-unresolved

export type Omit<T, U> = Pick<T, Exclude<keyof T, U>>;

// TERMINOLOGY
// https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax
// Declaration - The property and value pair.
// Block - A mapping of multiple declarations.
// Selector - The name of an element(s).
// Ruleset - The selector and block pair.
// StyleSheet = A mapping of multiple rulesets by selector.

export type StyleName = string;

export type ThemeName = string;

export type ClassName = string;

//  SYNTAX

export type AtRule =
  | '@charset'
  | '@font-face'
  | '@global'
  | '@import'
  | '@keyframes'
  | '@media'
  | '@page'
  | '@selectors'
  | '@supports'
  | '@viewport'
  | '@fallbacks';

export type PropertyAnimationName =
  | CSS.AnimationNameProperty
  | Keyframes
  | (CSS.AnimationNameProperty | Keyframes)[];

export type PropertyFontFamily =
  | CSS.FontFamilyProperty
  | FontFace
  | (CSS.FontFamilyProperty | FontFace)[];

export interface Properties
  extends Omit<CSS.Properties<string | number>, 'animationName' | 'fontFamily'> {
  animationName?: PropertyAnimationName;
  fontFamily?: PropertyFontFamily;
}

export type PropertiesFallback = CSS.PropertiesFallback<string | number>;

export type Pseudos = { [P in CSS.SimplePseudos]?: Properties & Attributes };

export type Attributes = { [A in CSS.HtmlAttributes & CSS.SvgAttributes]?: Properties & Pseudos };

export type Block = Properties & Pseudos & Attributes;

export interface FontFace extends CSS.FontFace {
  local?: string[];
  srcPaths: string[];
}

export interface Keyframes {
  from?: Block;
  to?: Block;
  name?: string;
  [percent: string]: Block | string | undefined;
}

export type SheetMap<T> = { [selector: string]: T };

export type ComponentBlock = Block & {
  '@fallbacks'?: PropertiesFallback;
  '@media'?: { [mediaQuery: string]: Block };
  '@selectors'?: { [selector: string]: Block };
  '@supports'?: { [featureQuery: string]: Block };
};

export type StyleSheet = SheetMap<ClassName | ComponentBlock>;

export type StyleSheetDefinition<Theme, Props = any> =
  | null
  | ((theme: Theme, props: Props) => StyleSheet);

export interface GlobalSheet {
  '@charset'?: string;
  '@font-face'?: { [fontFamily: string]: FontFace | FontFace[] };
  '@global'?: { [selector: string]: Block };
  '@import'?: string | string[];
  '@keyframes'?: { [animationName: string]: Keyframes };
  '@page'?: Block;
  '@viewport'?: Block;
}

export type GlobalSheetDefinition<Theme> = null | ((theme: Theme) => GlobalSheet);

// COMPONENT

export interface WithStylesWrapperProps {
  /** Gain a reference to the wrapped component. Provided by `withStyles`. */
  wrappedRef?: React.Ref<any>;
}

export interface WithStylesProps<Theme, ParsedBlock> {
  /** The ref passed through the `wrappedRef` prop. Provided by `withStyles`. */
  ref?: React.Ref<any>;
  /** The parsed component style sheet in which rulesets can be transformed to class names. Provided by `withStyles`. */
  styles: SheetMap<ParsedBlock>;
  /** The theme object when `passThemeProp` is true. Provided by `withStyles`. */
  theme?: Theme;
}

export interface WithStylesState<Props, ParsedBlock> {
  props?: Props;
  styles: SheetMap<ParsedBlock>;
}

export interface WithStylesOptions {
  /** Can this component's styles be extended to create a new component. Provided by `withStyles`. */
  extendable?: boolean;
  /** The parent component ID in which to extend styles from. This is usually defined automatically. Provided by `withStyles`. */
  extendFrom?: string;
  /** Pass the theme object prop to the wrapped component. Provided by `withStyles`. */
  passThemeProp?: boolean;
  /** Render a pure component instead of a regular component. Provided by `withStyles`. */
  pure?: boolean;
  /** Name of the prop in which to pass styles to the wrapped component. Provided by `withStyles`. */
  stylesPropName?: string;
  /** Name of the prop in which to pass the theme object to the wrapped component. Provided by `withStyles`. */
  themePropName?: string;
}

export interface StyledComponent<Theme, Props> extends React.ComponentClass<Props> {
  displayName: string;
  styleName: StyleName;
  WrappedComponent: React.ComponentType<Props & WithStylesProps<Theme, any>>;

  extendStyles(
    styleSheet: StyleSheetDefinition<Theme, Props>,
    extendOptions?: Omit<WithStylesOptions, 'extendFrom'>,
  ): StyledComponent<Theme, Props>;
}
