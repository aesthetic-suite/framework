/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import CSS from 'csstype';

/* eslint-disable no-use-before-define, max-len */

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

// ATTRIBUTES

export type HTMLAttributes =
  | '[accept]'
  | '[accept-charset]'
  | '[accesskey]'
  | '[action]'
  | '[align]'
  | '[allow]'
  | '[alt]'
  | '[async]'
  | '[autocapitalize]'
  | '[autofocus]'
  | '[autoplay]'
  | '[bgcolor]'
  | '[border]'
  | '[buffered]'
  | '[challenge]'
  | '[charset]'
  | '[checked]'
  | '[cite]'
  | '[class]'
  | '[code]'
  | '[codebase]'
  | '[color]'
  | '[cols]'
  | '[colspan]'
  | '[content]'
  | '[contenteditable]'
  | '[contextmenu]'
  | '[controls]'
  | '[coords]'
  | '[data]'
  | '[datetime]'
  | '[decoding]'
  | '[default]'
  | '[defer]'
  | '[dir]'
  | '[dirname]'
  | '[disabled]'
  | '[download]'
  | '[draggable]'
  | '[dropzone]'
  | '[enctype]'
  | '[for]'
  | '[form]'
  | '[formaction]'
  | '[headers]'
  | '[height]'
  | '[hidden]'
  | '[high]'
  | '[href]'
  | '[hreflang]'
  | '[http-equiv]'
  | '[icon]'
  | '[id]'
  | '[importance]'
  | '[integrity]'
  | '[ismap]'
  | '[itemprop]'
  | '[keytype]'
  | '[kind]'
  | '[label]'
  | '[lang]'
  | '[language]'
  | '[lazyload]'
  | '[list]'
  | '[loop]'
  | '[low]'
  | '[manifest]'
  | '[max]'
  | '[maxlength]'
  | '[minlength]'
  | '[media]'
  | '[method]'
  | '[min]'
  | '[multiple]'
  | '[muted]'
  | '[name]'
  | '[novalidate]'
  | '[open]'
  | '[optimum]'
  | '[pattern]'
  | '[ping]'
  | '[placeholder]'
  | '[poster]'
  | '[preload]'
  | '[radiogroup]'
  | '[readonly]'
  | '[rel]'
  | '[required]'
  | '[reversed]'
  | '[rows]'
  | '[rowspan]'
  | '[sandbox]'
  | '[scope]'
  | '[scoped]'
  | '[selected]'
  | '[shape]'
  | '[size]'
  | '[sizes]'
  | '[slot]'
  | '[span]'
  | '[spellcheck]'
  | '[src]'
  | '[srcdoc]'
  | '[srclang]'
  | '[srcset]'
  | '[start]'
  | '[step]'
  | '[style]'
  | '[summary]'
  | '[tabindex]'
  | '[target]'
  | '[title]'
  | '[translate]'
  | '[type]'
  | '[usemap]'
  | '[value]'
  | '[width]'
  | '[wrap]';

export type SVGAttributes =
  | '[accent-height]'
  | '[accumulate]'
  | '[additive]'
  | '[alignment-baseline]'
  | '[allowReorder]'
  | '[alphabetic]'
  | '[amplitude]'
  | '[arabic-form]'
  | '[ascent]'
  | '[attributeName]'
  | '[attributeType]'
  | '[autoReverse]'
  | '[azimuth]'
  | '[baseFrequency]'
  | '[baseline-shift]'
  | '[baseProfile]'
  | '[bbox]'
  | '[begin]'
  | '[bias]'
  | '[by]'
  | '[calcMode]'
  | '[cap-height]'
  | '[class]'
  | '[clip]'
  | '[clipPathUnits]'
  | '[clip-path]'
  | '[clip-rule]'
  | '[color]'
  | '[color-interpolation]'
  | '[color-interpolation-filters]'
  | '[color-profile]'
  | '[color-rendering]'
  | '[contentScriptType]'
  | '[contentStyleType]'
  | '[cursor]'
  | '[cx]'
  | '[cy]'
  | '[d]'
  | '[decelerate]'
  | '[descent]'
  | '[diffuseConstant]'
  | '[direction]'
  | '[display]'
  | '[divisor]'
  | '[dominant-baseline]'
  | '[dur]'
  | '[dx]'
  | '[dy]'
  | '[edgeMode]'
  | '[elevation]'
  | '[enable-background]'
  | '[end]'
  | '[exponent]'
  | '[externalResourcesRequired]'
  | '[fill]'
  | '[fill-opacity]'
  | '[fill-rule]'
  | '[filter]'
  | '[filterRes]'
  | '[filterUnits]'
  | '[flood-color]'
  | '[flood-opacity]'
  | '[font-family]'
  | '[font-size]'
  | '[font-size-adjust]'
  | '[font-stretch]'
  | '[font-style]'
  | '[font-variant]'
  | '[font-weight]'
  | '[format]'
  | '[from]'
  | '[fr]'
  | '[fx]'
  | '[fy]'
  | '[g1]'
  | '[g2]'
  | '[glyph-name]'
  | '[glyph-orientation-horizontal]'
  | '[glyph-orientation-vertical]'
  | '[glyphRef]'
  | '[gradientTransform]'
  | '[gradientUnits]'
  | '[hanging]'
  | '[height]'
  | '[href]'
  | '[hreflang]'
  | '[horiz-adv-x]'
  | '[horiz-origin-x]'
  | '[id]'
  | '[ideographic]'
  | '[image-rendering]'
  | '[in]'
  | '[in2]'
  | '[intercept]'
  | '[k]'
  | '[k1]'
  | '[k2]'
  | '[k3]'
  | '[k4]'
  | '[kernelMatrix]'
  | '[kernelUnitLength]'
  | '[kerning]'
  | '[keyPoints]'
  | '[keySplines]'
  | '[keyTimes]'
  | '[lang]'
  | '[lengthAdjust]'
  | '[letter-spacing]'
  | '[lighting-color]'
  | '[limitingConeAngle]'
  | '[local]'
  | '[marker-end]'
  | '[marker-mid]'
  | '[marker-start]'
  | '[markerHeight]'
  | '[markerUnits]'
  | '[markerWidth]'
  | '[mask]'
  | '[maskContentUnits]'
  | '[maskUnits]'
  | '[mathematical]'
  | '[max]'
  | '[media]'
  | '[method]'
  | '[min]'
  | '[mode]'
  | '[name]'
  | '[numOctaves]'
  | '[offset]'
  | '[opacity]'
  | '[operator]'
  | '[order]'
  | '[orient]'
  | '[orientation]'
  | '[origin]'
  | '[overflow]'
  | '[overline-position]'
  | '[overline-thickness]'
  | '[panose-1]'
  | '[paint-order]'
  | '[path]'
  | '[pathLength]'
  | '[patternContentUnits]'
  | '[patternTransform]'
  | '[patternUnits]'
  | '[ping]'
  | '[pointer-events]'
  | '[points]'
  | '[pointsAtX]'
  | '[pointsAtY]'
  | '[pointsAtZ]'
  | '[preserveAlpha]'
  | '[preserveAspectRatio]'
  | '[primitiveUnits]'
  | '[r]'
  | '[radius]'
  | '[referrerPolicy]'
  | '[refX]'
  | '[refY]'
  | '[rel]'
  | '[rendering-intent]'
  | '[repeatCount]'
  | '[repeatDur]'
  | '[requiredExtensions]'
  | '[requiredFeatures]'
  | '[restart]'
  | '[result]'
  | '[rotate]'
  | '[rx]'
  | '[ry]'
  | '[scale]'
  | '[seed]'
  | '[shape-rendering]'
  | '[slope]'
  | '[spacing]'
  | '[specularConstant]'
  | '[specularExponent]'
  | '[speed]'
  | '[spreadMethod]'
  | '[startOffset]'
  | '[stdDeviation]'
  | '[stemh]'
  | '[stemv]'
  | '[stitchTiles]'
  | '[stop-color]'
  | '[stop-opacity]'
  | '[strikethrough-position]'
  | '[strikethrough-thickness]'
  | '[string]'
  | '[stroke]'
  | '[stroke-dasharray]'
  | '[stroke-dashoffset]'
  | '[stroke-linecap]'
  | '[stroke-linejoin]'
  | '[stroke-miterlimit]'
  | '[stroke-opacity]'
  | '[stroke-width]'
  | '[style]'
  | '[surfaceScale]'
  | '[systemLanguage]'
  | '[tabindex]'
  | '[tableValues]'
  | '[target]'
  | '[targetX]'
  | '[targetY]'
  | '[text-anchor]'
  | '[text-decoration]'
  | '[text-rendering]'
  | '[textLength]'
  | '[to]'
  | '[transform]'
  | '[type]'
  | '[u1]'
  | '[u2]'
  | '[underline-position]'
  | '[underline-thickness]'
  | '[unicode]'
  | '[unicode-bidi]'
  | '[unicode-range]'
  | '[units-per-em]'
  | '[v-alphabetic]'
  | '[v-hanging]'
  | '[v-ideographic]'
  | '[v-mathematical]'
  | '[values]'
  | '[vector-effect]'
  | '[version]'
  | '[vert-adv-y]'
  | '[vert-origin-x]'
  | '[vert-origin-y]'
  | '[viewBox]'
  | '[viewTarget]'
  | '[visibility]'
  | '[width]'
  | '[widths]'
  | '[word-spacing]'
  | '[writing-mode]'
  | '[x]'
  | '[x-height]'
  | '[x1]'
  | '[x2]'
  | '[xChannelSelector]'
  | '[xlink:actuate]'
  | '[xlink:arcrole]'
  | '[xlink:href]'
  | '[xlink:role]'
  | '[xlink:show]'
  | '[xlink:title]'
  | '[xlink:type]'
  | '[xml:base]'
  | '[xml:lang]'
  | '[xml:space]'
  | '[y]'
  | '[y1]'
  | '[y2]'
  | '[yChannelSelector]'
  | '[z]'
  | '[zoomAndPan]';

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

export interface Properties extends Omit<CSS.Properties<string | number>, 'animationName'> {
  animationName?: CSS.AnimationNameProperty | Keyframes | (string | Keyframes)[];
}

export type PropertiesFallback = CSS.PropertiesFallback<string | number>;

export type Pseudos = { [P in CSS.Pseudos]?: Properties & Attributes };

export type Attributes = { [A in HTMLAttributes | SVGAttributes]?: Properties & Pseudos };

export interface FontFace extends CSS.FontFace {
  local?: string[];
  srcPaths: string[];
}

export interface Keyframes {
  from?: Block;
  to?: Block;
  [percent: string]: Block | undefined;
}

export type Block = Properties & Pseudos & Attributes;

export interface LocalAtRules {
  '@fallbacks'?: PropertiesFallback;
  '@media'?: { [mediaQuery: string]: Block };
  '@selectors'?: { [selector: string]: Block };
  '@supports'?: { [featureQuery: string]: Block };
}

export interface GlobalAtRules {
  '@charset'?: string;
  '@font-face'?: { [fontFamily: string]: FontFace | FontFace[] };
  '@global'?: { [selector: string]: Block };
  '@import'?: string | string[];
  '@keyframes'?: { [animationName: string]: Keyframes };
  '@page'?: Block;
  '@viewport'?: Block;
}

export type StyleSheetMap<T> = { [selector: string]: T };

export type StyleSheetDefinition<Theme, Props = any> =
  | null
  | ((theme: Theme, props: Props) => ComponentStyleSheet);

export type ComponentRuleset = Block & LocalAtRules;

export type ComponentStyleSheet = StyleSheetMap<ComponentRuleset>;

export type GlobalDefinition<Theme> = null | ((theme: Theme, props: any) => GlobalAtRules);

// COMPONENT

export interface WithStylesWrapperProps {
  themeName?: ThemeName;
  wrappedRef?: React.Ref<any>;
}

export interface WithStylesProps<Theme, ParsedBlock> {
  ref?: React.Ref<any>;
  styles: StyleSheetMap<ParsedBlock>;
  theme?: Theme;
  themeName?: ThemeName;
}

export interface WithStylesState<ParsedBlock> {
  styles: StyleSheetMap<ParsedBlock>;
  themeName: ThemeName;
}

export interface WithStylesOptions {
  extendable: boolean;
  extendFrom: string;
  passThemeNameProp: boolean;
  passThemeProp: boolean;
  pure: boolean;
  stylesPropName: string;
  themePropName: string;
}

export interface StyledComponent<Theme, Props> extends React.ComponentClass<Props> {
  displayName: string;
  styleName: StyleName;
  WrappedComponent: React.ComponentType<Props & WithStylesProps<Theme, any>>;

  extendStyles(
    styleSheet: StyleSheetDefinition<Theme, Props>,
    extendOptions?: Partial<Omit<WithStylesOptions, 'extendFrom'>>,
  ): StyledComponent<Theme, Props>;
}

// HANDLERS

export type Handler = (...args: any[]) => void;

// export type CharsetArgs<S> = [S, string];

// export type CharsetHandler<S> = (styleSheet: S, charset: string) => void;

// export type FallbacksArgs<D> = [D, any[], string];

// export type FallbacksHandler<D> = (declaration: D, values: any[], property: string) => void;

// export type FontFaceArgs<S, F = FontFace> = [S, F[], string, string[][]];

// export type FontFaceHandler<S, F = FontFace> = (
//   styleSheet: S,
//   fontFaces: F[],
//   fontFamily: string,
//   srcPaths: string[][],
// ) => void;

// export type GlobalArgs<S, D> = [S, D, string];

// export type GlobalHandler<S, D> = (styleSheet: S, declaration: D, selector: string) => void;

// export type KeyframesArgs<S, K = Keyframes> = [S, K, string];

// export type KeyframesHandler<S, K = Keyframes> = (
//   styleSheet: S,
//   keyframes: K,
//   animationName: string,
// ) => void;

// export type ImportArgs<S> = [S, string[]];

// export type ImportHandler<S> = (styleSheet: S, paths: string[]) => void;

// export type MediaArgs<D> = [D, D, string];

// export type MediaHandler<D> = (declaration: D, value: D, query: string) => void;

// export type PageArgs<S, D> = [S, D];

// export type PageHandler<S, D> = (styleSheet: S, declaration: D) => void;

// export type PropertyArgs<D> = [D, any, keyof D];

// export type PropertyHandler<D> = (declaration: D, value: any, property: keyof D) => void;

// export type SelectorArgs<D> = [D, any, string];

// export type SelectorHandler<D> = (declaration: D, value: any, selector: string) => void;

// export type SupportsArgs<D> = [D, D, string];

// export type SupportsHandler<D> = (declaration: D, value: D, query: string) => void;

// export type ViewportArgs<S, D> = [S, D];

// export type ViewportHandler<S, D> = (styleSheet: S, declaration: D) => void;
