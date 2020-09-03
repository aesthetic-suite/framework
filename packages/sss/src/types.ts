import {
  CSST,
  FontFace as BaseFontFace,
  Keyframes as BaseKeyframes,
  Declarations,
  Property,
  Value,
  Variables,
} from '@aesthetic/types';
import Block from './Block';

// PROPERTIES

export interface AnimationProperty {
  delay?: CSST.Property.AnimationDelay;
  direction?: CSST.Property.AnimationDirection;
  duration?: CSST.Property.AnimationDuration;
  fillMode?: CSST.Property.AnimationFillMode;
  iterationCount?: CSST.Property.AnimationIterationCount;
  name?: CSST.Property.AnimationName;
  playState?: CSST.Property.AnimationPlayState;
  timingFunction?: CSST.Property.AnimationTimingFunction;
}

export interface BackgroundProperty {
  attachment?: CSST.Property.BackgroundAttachment;
  clip?: CSST.Property.BackgroundClip;
  color?: CSST.Property.BackgroundColor;
  image?: CSST.Property.BackgroundImage;
  origin?: CSST.Property.BackgroundOrigin;
  position?: CSST.Property.BackgroundPosition<Value>;
  repeat?: CSST.Property.BackgroundRepeat;
  size?: CSST.Property.BackgroundSize<Value>;
}

export interface BorderProperty {
  color?: CSST.Property.BorderColor;
  style?: CSST.Property.BorderStyle;
  width?: CSST.Property.BorderWidth<Value>;
}

export interface ColumnRuleProperty {
  color?: CSST.Property.ColumnRuleColor;
  style?: CSST.Property.ColumnRuleStyle;
  width?: CSST.Property.ColumnRuleWidth<Value>;
}

export interface FlexProperty {
  basis?: CSST.Property.FlexBasis<Value>;
  grow?: CSST.Property.FlexGrow;
  shrink?: CSST.Property.FlexShrink;
}

export interface FontProperty {
  family?: CSST.Property.FontFamily;
  lineHeight?: CSST.Property.LineHeight<Value>;
  size?: CSST.Property.FontSize<Value>;
  stretch?: CSST.Property.FontStretch;
  style?: CSST.Property.FontStyle;
  system?: string;
  variant?: CSST.Property.FontVariant;
  weight?: CSST.Property.FontWeight;
}

export interface ListStyleProperty {
  image?: CSST.Property.ListStyleImage;
  position?: CSST.Property.ListStylePosition;
  type?: CSST.Property.ListStyleType;
}

export interface MarginProperty {
  bottom?: CSST.Property.MarginBottom<Value>;
  left?: CSST.Property.MarginLeft<Value>;
  leftRight?: CSST.Property.MarginLeft<Value> | CSST.Property.MarginRight<Value>;
  right?: CSST.Property.MarginRight<Value>;
  top?: CSST.Property.MarginTop<Value>;
  topBottom?: CSST.Property.MarginTop<Value> | CSST.Property.MarginBottom<Value>;
}

export interface OffsetProperty {
  anchor?: CSST.Property.OffsetAnchor<string>;
  distance?: CSST.Property.OffsetDistance<string>;
  path?: CSST.Property.OffsetPath;
  position?: string; // NOT UPSTREAM
  rotate?: CSST.Property.OffsetRotate;
}

export interface OutlineProperty {
  color?: CSST.Property.OutlineColor;
  style?: CSST.Property.OutlineStyle;
  width?: CSST.Property.OutlineWidth<Value>;
}

export interface PaddingProperty {
  bottom?: CSST.Property.PaddingBottom<Value>;
  left?: CSST.Property.PaddingLeft<Value>;
  leftRight?: CSST.Property.PaddingLeft<Value> | CSST.Property.PaddingRight<Value>;
  right?: CSST.Property.PaddingRight<Value>;
  top?: CSST.Property.PaddingTop<Value>;
  topBottom?: CSST.Property.PaddingTop<Value> | CSST.Property.PaddingBottom<Value>;
}

export interface TextDecorationProperty {
  color?: CSST.Property.TextDecorationColor;
  line?: CSST.Property.TextDecorationLine;
  style?: CSST.Property.TextDecorationStyle;
  thickness?: CSST.Property.TextDecorationThickness<Value>;
}

export interface TransitionProperty {
  delay?: CSST.Property.TransitionDelay;
  duration?: CSST.Property.TransitionDuration;
  property?: CSST.Property.TransitionProperty;
  timingFunction?: CSST.Property.TransitionTimingFunction;
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
  extends Omit<CSST.StandardProperties<Value>, CompoundPropertyTypes | ExpandedPropertyTypes> {
  animation?: CSST.Property.Animation | AnimationProperty;
  animationName?: CSST.Property.AnimationName | Keyframes;
  background?: CSST.Property.Background<Value> | BackgroundProperty;
  border?: CSST.Property.Border<Value> | BorderProperty;
  borderBottom?: CSST.Property.BorderBottom<Value> | BorderProperty;
  borderLeft?: CSST.Property.BorderLeft<Value> | BorderProperty;
  borderRight?: CSST.Property.BorderRight<Value> | BorderProperty;
  borderTop?: CSST.Property.BorderTop<Value> | BorderProperty;
  columnRule?: CSST.Property.ColumnRule<Value> | ColumnRuleProperty;
  flex?: CSST.Property.Flex<Value> | FlexProperty;
  font?: CSST.Property.Font | FontProperty;
  fontFamily?: ListableProperty<CSST.Property.FontFamily, FontFace>;
  listStyle?: CSST.Property.ListStyle | ListStyleProperty;
  margin?: CSST.Property.Margin<Value> | MarginProperty;
  offset?: CSST.Property.Offset<Value> | OffsetProperty;
  outline?: CSST.Property.Outline<Value> | OutlineProperty;
  padding?: CSST.Property.Padding<Value> | PaddingProperty;
  textDecoration?: CSST.Property.TextDecoration<Value> | TextDecorationProperty;
  transition?: CSST.Property.Transition | TransitionProperty;
}

export type FallbackProperties = CSST.StandardPropertiesFallback<Value>;

export type Rule = Declarations<Properties>;

export interface RuleMap<T> {
  [selector: string]: T;
}

export interface FontFace extends BaseFontFace {
  local?: string[];
  srcPaths: string[];
}

export interface Import {
  path: string;
  media?: string;
  url?: boolean;
}

export type Keyframes = BaseKeyframes<Rule>;

export type Viewport = CSST.AtRule.Viewport<Value>;

// TODO Add upstream to csstype
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

// LOCAL STYLE SHEET

export type LocalAtRule =
  | '@fallbacks'
  | '@media'
  | '@selectors'
  | '@supports'
  | '@variables'
  | '@variants';

export type LocalBlock = Rule & {
  '@fallbacks'?: FallbackProperties;
  '@media'?: { [mediaQuery: string]: LocalBlock };
  '@selectors'?: { [selector: string]: LocalBlock };
  '@supports'?: { [featureQuery: string]: LocalBlock };
  '@variables'?: Variables;
  '@variants'?: { [variant: string]: LocalBlock };
};

export type LocalBlockNeverize<T> = {
  [K in keyof T]: K extends keyof LocalBlock ? T[K] : never;
};

export type LocalStyleSheet = RuleMap<string | LocalBlock>;

export type LocalStyleSheetNeverize<T> = {
  [K in keyof T]: T[K] extends string ? string : LocalBlockNeverize<T[K]>;
};

// GLOBAL STYLE SHEET

export type GlobalAtRule =
  | '@font-face'
  | '@import'
  | '@keyframes'
  | '@page'
  | '@root'
  | '@variables'
  | '@viewport';

export interface GlobalStyleSheet {
  '@font-face'?: { [fontFamily: string]: FontFace | FontFace[] };
  '@import'?: (string | Import)[];
  '@keyframes'?: { [animationName: string]: Keyframes };
  '@page'?: Page;
  '@root'?: LocalBlock;
  '@variables'?: Variables;
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

export type RuleListener<T extends object> = (selector: string, block: Block<T>) => void;

export type VariableListener = (name: string, value: Value) => void;
