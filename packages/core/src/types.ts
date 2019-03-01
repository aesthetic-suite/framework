import { ClassName, ComponentBlock, GlobalSheet, StyleSheet, SheetMap } from 'unified-css-syntax';
import { Omit } from 'utility-types';

// NEVERIZE
// https://github.com/Microsoft/TypeScript/issues/29390

export type StyleName = string;

export type ThemeName = string;

export type ClassNameGenerator<N extends object, P extends object | string> = (
  ...styles: (undefined | false | ClassName | N | P)[]
) => ClassName;

// SYNTAX

export type ComponentBlockNeverize<T> = T extends string
  ? string
  : { [K in keyof T]: K extends keyof ComponentBlock ? ComponentBlock[K] : never };

export type StyleSheetNeverize<T> = { [K in keyof T]: ComponentBlockNeverize<T[K]> };

export type StyleSheetDefinition<Theme, T> = (
  theme: Theme,
) => T extends any ? StyleSheet : StyleSheet & StyleSheetNeverize<T>;

export type GlobalSheetNeverize<T> = {
  [K in keyof T]: K extends keyof GlobalSheet ? GlobalSheet[K] : never
};

export type GlobalSheetDefinition<Theme, T> =
  | ((theme: Theme) => GlobalSheet & GlobalSheetNeverize<T>)
  | null;

// AESTHETIC

export interface AestheticOptions {
  /** Can this component's styles be extended to create a new component. Provided by `withStyles`. */
  extendable: boolean;
  /** Pass the theme object prop to the wrapped component. Provided by `withStyles`. */
  passThemeProp: boolean;
  /** Render a pure component instead of a regular component. Provided by `withStyles`. */
  pure: boolean;
  /** Name of the prop in which to pass styles to the wrapped component. Provided by `withStyles`. */
  stylesPropName: string;
  /** Currently active theme. */
  theme: ThemeName;
  /** Name of the prop in which to pass the theme object to the wrapped component. Provided by `withStyles`. */
  themePropName: string;
}

// COMPONENT

export interface WithThemeWrapperProps {
  /** Gain a reference to the wrapped component. Provided by `withTheme`. */
  wrappedRef?: React.Ref<any>;
}

export interface WithThemeProps<Theme> {
  /** The ref passed through the `wrappedRef` prop. Provided by `withTheme`. */
  ref?: React.Ref<any>;
  /** The theme object. Provided by `withTheme`. */
  theme: Theme;
}

export type WithThemeOptions = Partial<Pick<AestheticOptions, 'pure' | 'themePropName'>>;

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

export type WithStylesOptions = Partial<Omit<AestheticOptions, 'theme'>> & {
  /** The parent component ID in which to extend styles from. This is usually defined automatically. Provided by `withStyles`. */
  extendFrom?: string;
};

export interface StyledComponentClass<Theme, Props> extends React.ComponentClass<Props> {
  displayName: string;
  styleName: StyleName;
  WrappedComponent: React.ComponentType<Props & WithStylesProps<Theme, any>>;

  extendStyles<T>(
    styleSheet: StyleSheetDefinition<Theme, T>,
    extendOptions?: Omit<WithStylesOptions, 'extendFrom'>,
  ): StyledComponentClass<Theme, Props>;
}
