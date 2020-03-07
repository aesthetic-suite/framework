import CSS from 'csstype';
import Block from './Block';

export type Length = string | number;

// PROPERTIES

export interface AnimationProperty {
  delay?: CSS.StandardProperties['animationDelay'];
  direction?: CSS.AnimationDirectionProperty;
  duration?: CSS.StandardProperties['animationDuration'];
  fillMode?: CSS.AnimationFillModeProperty;
  iterationCount?: CSS.AnimationIterationCountProperty;
  name?: CSS.AnimationNameProperty;
  playState?: CSS.AnimationPlayStateProperty;
  timingFunction?: CSS.AnimationTimingFunctionProperty;
}

export interface BackgroundProperty {
  attachment?: CSS.BackgroundAttachmentProperty;
  clip?: CSS.BackgroundClipProperty;
  color?: CSS.BackgroundColorProperty;
  image?: CSS.BackgroundImageProperty;
  origin?: CSS.BackgroundOriginProperty;
  position?: CSS.BackgroundPositionProperty<Length>;
  repeat?: CSS.BackgroundRepeatProperty;
  size?: CSS.BackgroundSizeProperty<Length>;
}

export interface BorderProperty {
  color?: CSS.BorderColorProperty;
  style?: CSS.BorderStyleProperty;
  width?: CSS.BorderWidthProperty<Length>;
}

export interface ColumnRuleProperty {
  color?: CSS.ColumnRuleColorProperty;
  style?: CSS.ColumnRuleStyleProperty;
  width?: CSS.ColumnRuleWidthProperty<Length>;
}

export interface FlexProperty {
  basis?: CSS.FlexBasisProperty<Length>;
  grow?: CSS.Properties['flexGrow'];
  shrink?: CSS.Properties['flexShrink'];
}

export interface FontProperty {
  family?: CSS.FontFamilyProperty;
  lineHeight?: CSS.LineHeightProperty<Length>;
  size?: CSS.FontSizeProperty<Length>;
  stretch?: CSS.FontStretchProperty;
  style?: CSS.FontStyleProperty;
  system?: string;
  variant?: CSS.FontVariantProperty;
  weight?: CSS.FontWeightProperty;
}

export interface ListStyleProperty {
  image?: CSS.ListStyleImageProperty;
  position?: CSS.ListStylePositionProperty;
  type?: CSS.ListStyleTypeProperty;
}

export interface MarginProperty {
  bottom?: CSS.MarginBottomProperty<Length>;
  left?: CSS.MarginLeftProperty<Length>;
  leftRight?: CSS.MarginLeftProperty<Length> | CSS.MarginRightProperty<Length>;
  right?: CSS.MarginRightProperty<Length>;
  top?: CSS.MarginTopProperty<Length>;
  topBottom?: CSS.MarginTopProperty<Length> | CSS.MarginBottomProperty<Length>;
}

export interface OffsetProperty {
  anchor?: CSS.OffsetAnchorProperty<string>;
  distance?: CSS.OffsetDistanceProperty<string>;
  path?: CSS.OffsetPathProperty;
  position?: string; // NOT UPSTREAM
  rotate?: CSS.OffsetRotateProperty;
}

export interface OutlineProperty {
  color?: CSS.OutlineColorProperty;
  style?: CSS.OutlineStyleProperty;
  width?: CSS.OutlineWidthProperty<Length>;
}

export interface PaddingProperty {
  bottom?: CSS.PaddingBottomProperty<Length>;
  left?: CSS.PaddingLeftProperty<Length>;
  leftRight?: CSS.PaddingLeftProperty<Length> | CSS.PaddingRightProperty<Length>;
  right?: CSS.PaddingRightProperty<Length>;
  top?: CSS.PaddingTopProperty<Length>;
  topBottom?: CSS.PaddingTopProperty<Length> | CSS.PaddingBottomProperty<Length>;
}

export interface TextDecorationProperty {
  color?: CSS.TextDecorationColorProperty;
  line?: CSS.TextDecorationLineProperty;
  style?: CSS.TextDecorationStyleProperty;
  thickness?: CSS.TextDecorationThicknessProperty<Length>;
}

export interface TransitionProperty {
  delay?: CSS.StandardProperties['transitionDelay'];
  duration?: CSS.StandardProperties['transitionDuration'];
  property?: CSS.TransitionPropertyProperty;
  timingFunction?: CSS.TransitionTimingFunctionProperty;
}

export type ExpandProperty<B, T> = B | T | (B | T)[];

// SYNTAX

export type CompoundPropertyTypes = 'animationName' | 'fontFamily';

export type ExpandedPropertyTypes =
  | 'animation'
  | 'background'
  | 'border'
  | 'borderBottom'
  | 'borderLeft'
  | 'borderRight'
  | 'borderTop'
  | 'columnRule'
  | 'flex'
  | 'font'
  | 'listStyle'
  | 'margin'
  | 'offset'
  | 'outline'
  | 'padding'
  | 'textDecoration'
  | 'transition';

export interface Properties
  extends Omit<CSS.StandardProperties<Length>, CompoundPropertyTypes | ExpandedPropertyTypes> {
  animation?: ExpandProperty<CSS.AnimationProperty, AnimationProperty>;
  animationName?: ExpandProperty<CSS.AnimationNameProperty, Keyframes>;
  background?: CSS.BackgroundProperty<Length> | BackgroundProperty;
  border?: CSS.BorderProperty<Length> | BorderProperty;
  borderBottom?: CSS.BorderBottomProperty<Length> | BorderProperty;
  borderLeft?: CSS.BorderLeftProperty<Length> | BorderProperty;
  borderRight?: CSS.BorderRightProperty<Length> | BorderProperty;
  borderTop?: CSS.BorderTopProperty<Length> | BorderProperty;
  columnRule?: CSS.ColumnRuleProperty<Length> | ColumnRuleProperty;
  flex?: CSS.FlexProperty<Length> | FlexProperty;
  font?: CSS.FontProperty | FontProperty;
  fontFamily?: ExpandProperty<CSS.FontFamilyProperty, FontFace>;
  listStyle?: CSS.ListStyleProperty | ListStyleProperty;
  margin?: CSS.MarginProperty<Length> | MarginProperty;
  offset?: CSS.OffsetProperty<Length> | OffsetProperty;
  outline?: CSS.OutlineProperty<Length> | OutlineProperty;
  padding?: CSS.PaddingProperty<Length> | PaddingProperty;
  textDecoration?: CSS.TextDecorationProperty<Length> | TextDecorationProperty;
  transition?: ExpandProperty<CSS.TransitionProperty, TransitionProperty>;
}

export type FallbackProperties = CSS.StandardPropertiesFallback<Length>;

export type Pseudos = { [P in CSS.SimplePseudos]?: DeclarationBlock };

export type Attributes = { [A in CSS.HtmlAttributes]?: DeclarationBlock };

export type DeclarationBlock = Properties & Pseudos & Attributes;

export interface FontFace extends CSS.FontFace {
  local?: string[];
  srcPaths: string[];
}

export interface Import {
  path: string;
  media?: string;
  url?: boolean;
}

export interface Keyframes {
  [percent: string]: DeclarationBlock | string | undefined;
  from?: DeclarationBlock;
  to?: DeclarationBlock;
  name?: string;
}

export type Viewport = CSS.Viewport<Length>;

// TODO add upstream to csstype
export type PageMargins =
  | '@top-left-corner'
  | '@top-left'
  | '@top-center'
  | '@top-right'
  | '@top-right-corner'
  | '@bottom-left-corner'
  | '@bottom-left'
  | '@bottom-center'
  | '@bottom-right'
  | '@bottom-right-corner'
  | '@left-top'
  | '@left-middle'
  | '@left-bottom'
  | '@right-top'
  | '@right-middle'
  | '@right-bottom';

export type PageBlock = Properties & {
  bleed?: string;
  marks?: string;
  size?: string;
} & {
    [K in PageMargins]?: PageBlock;
  };

export type PagePseudos = ':blank' | ':first' | ':left' | ':right';

export type Page = PageBlock & { [K in PagePseudos]?: PageBlock };

export interface Rulesets<T> {
  [selector: string]: T;
}

// LOCAL STYLE SHEET

export type LocalAtRule = '@fallbacks' | '@media' | '@selectors' | '@supports';

export type LocalBlock = DeclarationBlock & {
  '@fallbacks'?: FallbackProperties;
  '@media'?: { [mediaQuery: string]: LocalBlock };
  '@selectors'?: { [selector: string]: LocalBlock };
  '@supports'?: { [featureQuery: string]: LocalBlock };
};

export type LocalBlockNeverize<T> = {
  [K in keyof T]: K extends keyof LocalBlock ? T[K] : never;
};

export type LocalStyleSheet = Rulesets<string | LocalBlock>;

export type LocalStyleSheetNeverize<T> = {
  [K in keyof T]: T[K] extends string ? string : LocalBlockNeverize<T[K]>;
};

// GLOBAL STYLE SHEET

export type GlobalAtRule =
  | '@font-face'
  | '@global'
  | '@import'
  | '@keyframes'
  | '@page'
  | '@viewport';

export interface GlobalStyleSheet {
  '@font-face'?: { [fontFamily: string]: FontFace | FontFace[] };
  '@global'?: LocalBlock;
  '@import'?: (string | Import)[];
  '@keyframes'?: { [animationName: string]: Keyframes };
  '@page'?: Page;
  '@viewport'?: Viewport;
}

export type GlobalStyleSheetNeverize<T> = {
  [K in keyof T]: K extends keyof GlobalStyleSheet ? GlobalStyleSheet[K] : never;
};

// MISC

export type AtRule = LocalAtRule | GlobalAtRule;

export interface NestedBlockParams {
  specificity: number;
}

export interface ParserOptions {
  unit?: string;
}

// TRANSFORMERS

export type UnitWrapper = (property: string, value: Length | undefined) => string;

export interface TransformerUtils {
  join: (...props: (Length | undefined)[]) => string;
  separate: (...props: (Length | undefined)[]) => string;
  wrap: (value: Length | undefined) => string;
}

export type Transformer<T> = (property: T, utils: TransformerUtils) => string;

export type TransformerHandler<T> = (
  property: T,
  wrap: UnitWrapper,
  customTransformer?: Transformer<T>,
) => string;

// EVENTS

export type BlockConditionListener<T extends object> = (
  parent: Block<T>,
  condition: string,
  value: Block<T>,
) => void;

export type BlockNestedListener<T extends object> = (
  parent: Block<T>,
  name: string,
  value: Block<T>,
  params: NestedBlockParams,
) => void;

export type BlockPropertyListener<T extends object> = (
  parent: Block<T>,
  name: string,
  value: unknown,
) => void;

export type BlockListener<T extends object> = (block: Block<T>) => void;

export type ClassNameListener = (selector: string, className: string) => void;

export type FontFaceListener<T extends object> = (
  fontFace: Block<T>,
  fontFamily: string,
  srcPaths: string[],
) => void;

export type ImportListener = (path: string) => void;

export type KeyframesListener<T extends object> = (
  keyframes: Block<T>,
  animationName: string,
) => void;

export type RulesetListener<T extends object> = (selector: string, block: Block<T>) => void;
