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
  delay?: CSST.StandardProperties['animationDelay'];
  direction?: CSST.AnimationDirectionProperty;
  duration?: CSST.StandardProperties['animationDuration'];
  fillMode?: CSST.AnimationFillModeProperty;
  iterationCount?: CSST.AnimationIterationCountProperty;
  name?: CSST.AnimationNameProperty;
  playState?: CSST.AnimationPlayStateProperty;
  timingFunction?: CSST.AnimationTimingFunctionProperty;
}

export interface BackgroundProperty {
  attachment?: CSST.BackgroundAttachmentProperty;
  clip?: CSST.BackgroundClipProperty;
  color?: CSST.BackgroundColorProperty;
  image?: CSST.BackgroundImageProperty;
  origin?: CSST.BackgroundOriginProperty;
  position?: CSST.BackgroundPositionProperty<Value>;
  repeat?: CSST.BackgroundRepeatProperty;
  size?: CSST.BackgroundSizeProperty<Value>;
}

export interface BorderProperty {
  color?: CSST.BorderColorProperty;
  style?: CSST.BorderStyleProperty;
  width?: CSST.BorderWidthProperty<Value>;
}

export interface ColumnRuleProperty {
  color?: CSST.ColumnRuleColorProperty;
  style?: CSST.ColumnRuleStyleProperty;
  width?: CSST.ColumnRuleWidthProperty<Value>;
}

export interface FlexProperty {
  basis?: CSST.FlexBasisProperty<Value>;
  grow?: CSST.Properties['flexGrow'];
  shrink?: CSST.Properties['flexShrink'];
}

export interface FontProperty {
  family?: CSST.FontFamilyProperty;
  lineHeight?: CSST.LineHeightProperty<Value>;
  size?: CSST.FontSizeProperty<Value>;
  stretch?: CSST.FontStretchProperty;
  style?: CSST.FontStyleProperty;
  system?: string;
  variant?: CSST.FontVariantProperty;
  weight?: CSST.FontWeightProperty;
}

export interface ListStyleProperty {
  image?: CSST.ListStyleImageProperty;
  position?: CSST.ListStylePositionProperty;
  type?: CSST.ListStyleTypeProperty;
}

export interface MarginProperty {
  bottom?: CSST.MarginBottomProperty<Value>;
  left?: CSST.MarginLeftProperty<Value>;
  leftRight?: CSST.MarginLeftProperty<Value> | CSST.MarginRightProperty<Value>;
  right?: CSST.MarginRightProperty<Value>;
  top?: CSST.MarginTopProperty<Value>;
  topBottom?: CSST.MarginTopProperty<Value> | CSST.MarginBottomProperty<Value>;
}

export interface OffsetProperty {
  anchor?: CSST.OffsetAnchorProperty<string>;
  distance?: CSST.OffsetDistanceProperty<string>;
  path?: CSST.OffsetPathProperty;
  position?: string; // NOT UPSTREAM
  rotate?: CSST.OffsetRotateProperty;
}

export interface OutlineProperty {
  color?: CSST.OutlineColorProperty;
  style?: CSST.OutlineStyleProperty;
  width?: CSST.OutlineWidthProperty<Value>;
}

export interface PaddingProperty {
  bottom?: CSST.PaddingBottomProperty<Value>;
  left?: CSST.PaddingLeftProperty<Value>;
  leftRight?: CSST.PaddingLeftProperty<Value> | CSST.PaddingRightProperty<Value>;
  right?: CSST.PaddingRightProperty<Value>;
  top?: CSST.PaddingTopProperty<Value>;
  topBottom?: CSST.PaddingTopProperty<Value> | CSST.PaddingBottomProperty<Value>;
}

export interface TextDecorationProperty {
  color?: CSST.TextDecorationColorProperty;
  line?: CSST.TextDecorationLineProperty;
  style?: CSST.TextDecorationStyleProperty;
  thickness?: CSST.TextDecorationThicknessProperty<Value>;
}

export interface TransitionProperty {
  delay?: CSST.StandardProperties['transitionDelay'];
  duration?: CSST.StandardProperties['transitionDuration'];
  property?: CSST.TransitionPropertyProperty;
  timingFunction?: CSST.TransitionTimingFunctionProperty;
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
  animation?: CSST.AnimationProperty | AnimationProperty;
  animationName?: CSST.AnimationNameProperty | Keyframes;
  background?: CSST.BackgroundProperty<Value> | BackgroundProperty;
  border?: CSST.BorderProperty<Value> | BorderProperty;
  borderBottom?: CSST.BorderBottomProperty<Value> | BorderProperty;
  borderLeft?: CSST.BorderLeftProperty<Value> | BorderProperty;
  borderRight?: CSST.BorderRightProperty<Value> | BorderProperty;
  borderTop?: CSST.BorderTopProperty<Value> | BorderProperty;
  columnRule?: CSST.ColumnRuleProperty<Value> | ColumnRuleProperty;
  flex?: CSST.FlexProperty<Value> | FlexProperty;
  font?: CSST.FontProperty | FontProperty;
  fontFamily?: ListableProperty<CSST.FontFamilyProperty, FontFace>;
  listStyle?: CSST.ListStyleProperty | ListStyleProperty;
  margin?: CSST.MarginProperty<Value> | MarginProperty;
  offset?: CSST.OffsetProperty<Value> | OffsetProperty;
  outline?: CSST.OutlineProperty<Value> | OutlineProperty;
  padding?: CSST.PaddingProperty<Value> | PaddingProperty;
  textDecoration?: CSST.TextDecorationProperty<Value> | TextDecorationProperty;
  transition?: CSST.TransitionProperty | TransitionProperty;
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

export type Viewport = CSST.Viewport<Value>;

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
