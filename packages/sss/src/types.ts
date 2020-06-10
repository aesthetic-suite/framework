import CSS from 'csstype';
import Block from './Block';

export type Value = string | number;

export type MaybeValue = Value | undefined;

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
  position?: CSS.BackgroundPositionProperty<Value>;
  repeat?: CSS.BackgroundRepeatProperty;
  size?: CSS.BackgroundSizeProperty<Value>;
}

export interface BorderProperty {
  color?: CSS.BorderColorProperty;
  style?: CSS.BorderStyleProperty;
  width?: CSS.BorderWidthProperty<Value>;
}

export interface ColumnRuleProperty {
  color?: CSS.ColumnRuleColorProperty;
  style?: CSS.ColumnRuleStyleProperty;
  width?: CSS.ColumnRuleWidthProperty<Value>;
}

export interface FlexProperty {
  basis?: CSS.FlexBasisProperty<Value>;
  grow?: CSS.Properties['flexGrow'];
  shrink?: CSS.Properties['flexShrink'];
}

export interface FontProperty {
  family?: CSS.FontFamilyProperty;
  lineHeight?: CSS.LineHeightProperty<Value>;
  size?: CSS.FontSizeProperty<Value>;
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
  bottom?: CSS.MarginBottomProperty<Value>;
  left?: CSS.MarginLeftProperty<Value>;
  leftRight?: CSS.MarginLeftProperty<Value> | CSS.MarginRightProperty<Value>;
  right?: CSS.MarginRightProperty<Value>;
  top?: CSS.MarginTopProperty<Value>;
  topBottom?: CSS.MarginTopProperty<Value> | CSS.MarginBottomProperty<Value>;
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
  width?: CSS.OutlineWidthProperty<Value>;
}

export interface PaddingProperty {
  bottom?: CSS.PaddingBottomProperty<Value>;
  left?: CSS.PaddingLeftProperty<Value>;
  leftRight?: CSS.PaddingLeftProperty<Value> | CSS.PaddingRightProperty<Value>;
  right?: CSS.PaddingRightProperty<Value>;
  top?: CSS.PaddingTopProperty<Value>;
  topBottom?: CSS.PaddingTopProperty<Value> | CSS.PaddingBottomProperty<Value>;
}

export interface TextDecorationProperty {
  color?: CSS.TextDecorationColorProperty;
  line?: CSS.TextDecorationLineProperty;
  style?: CSS.TextDecorationStyleProperty;
  thickness?: CSS.TextDecorationThicknessProperty<Value>;
}

export interface TransitionProperty {
  delay?: CSS.StandardProperties['transitionDelay'];
  duration?: CSS.StandardProperties['transitionDuration'];
  property?: CSS.TransitionPropertyProperty;
  timingFunction?: CSS.TransitionTimingFunctionProperty;
}

export type ListableProperty<B, T> = B | T | (B | T)[];

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
  extends Omit<CSS.StandardProperties<Value>, CompoundPropertyTypes | ExpandedPropertyTypes> {
  animation?: CSS.AnimationProperty | AnimationProperty;
  animationName?: ListableProperty<CSS.AnimationNameProperty, Keyframes>;
  background?: CSS.BackgroundProperty<Value> | BackgroundProperty;
  border?: CSS.BorderProperty<Value> | BorderProperty;
  borderBottom?: CSS.BorderBottomProperty<Value> | BorderProperty;
  borderLeft?: CSS.BorderLeftProperty<Value> | BorderProperty;
  borderRight?: CSS.BorderRightProperty<Value> | BorderProperty;
  borderTop?: CSS.BorderTopProperty<Value> | BorderProperty;
  columnRule?: CSS.ColumnRuleProperty<Value> | ColumnRuleProperty;
  flex?: CSS.FlexProperty<Value> | FlexProperty;
  font?: CSS.FontProperty | FontProperty;
  fontFamily?: ListableProperty<CSS.FontFamilyProperty, FontFace>;
  listStyle?: CSS.ListStyleProperty | ListStyleProperty;
  margin?: CSS.MarginProperty<Value> | MarginProperty;
  offset?: CSS.OffsetProperty<Value> | OffsetProperty;
  outline?: CSS.OutlineProperty<Value> | OutlineProperty;
  padding?: CSS.PaddingProperty<Value> | PaddingProperty;
  textDecoration?: CSS.TextDecorationProperty<Value> | TextDecorationProperty;
  transition?: CSS.TransitionProperty | TransitionProperty;
}

export type Property = keyof Properties;

export type FallbackProperties = CSS.StandardPropertiesFallback<Value>;

export interface GenericProperties {
  [key: string]: Value;
}

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
  [percent: string]: DeclarationBlock | undefined;
  from?: DeclarationBlock;
  to?: DeclarationBlock;
}

export interface CSSVariables {
  [name: string]: Value;
}

export type Viewport = CSS.Viewport<Value>;

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

export type LocalAtRule = '@fallbacks' | '@media' | '@selectors' | '@supports' | '@variables';

export type LocalBlock = DeclarationBlock & {
  '@fallbacks'?: FallbackProperties;
  '@media'?: { [mediaQuery: string]: LocalBlock };
  '@selectors'?: { [selector: string]: LocalBlock };
  '@supports'?: { [featureQuery: string]: LocalBlock };
  '@variables'?: CSSVariables;
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
  | '@variables'
  | '@viewport';

export interface GlobalStyleSheet {
  '@font-face'?: { [fontFamily: string]: FontFace | FontFace[] };
  '@global'?: LocalBlock;
  '@import'?: (string | Import)[];
  '@keyframes'?: { [animationName: string]: Keyframes };
  '@page'?: Page;
  '@variables'?: CSSVariables;
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

export type OnProcessProperty = (property: Property, value: Value) => void;

export type Processor<T> = (value: T, onProcess: OnProcessProperty) => Value | undefined | void;

export interface ProcessorMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: Processor<any>;
}

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
  animationName: string | undefined,
) => string;

export type RulesetListener<T extends object> = (selector: string, block: Block<T>) => void;

export type VariableListener = (name: string, value: Value) => void;
