// Module augmentation
import '@aesthetic/sss';
import { CSST, Value } from '@aesthetic/types';

// EXPANDED PROPERTIES

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

declare module '@aesthetic/sss' {
  export interface CustomProperties {
    animation?: AnimationProperty;
    background?: BackgroundProperty;
    border?: BorderProperty;
    borderBottom?: BorderProperty;
    borderLeft?: BorderProperty;
    borderRight?: BorderProperty;
    borderTop?: BorderProperty;
    columnRule?: ColumnRuleProperty;
    flex?: FlexProperty;
    font?: FontProperty;
    listStyle?: ListStyleProperty;
    margin?: MarginProperty;
    offset?: OffsetProperty;
    outline?: OutlineProperty;
    padding?: PaddingProperty;
    textDecoration?: TextDecorationProperty;
    transition?: TransitionProperty;
  }
}
