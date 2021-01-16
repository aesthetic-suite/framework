// Module augmentation
import '@aesthetic/sss';
// eslint-disable-next-line import/no-unresolved
import CSSType from 'csstype';
import { Value } from '@aesthetic/types';

// EXPANDED PROPERTIES

export interface AnimationProperty {
  delay?: CSSType.Property.AnimationDelay;
  direction?: CSSType.Property.AnimationDirection;
  duration?: CSSType.Property.AnimationDuration;
  fillMode?: CSSType.Property.AnimationFillMode;
  iterationCount?: CSSType.Property.AnimationIterationCount;
  name?: CSSType.Property.AnimationName;
  playState?: CSSType.Property.AnimationPlayState;
  timingFunction?: CSSType.Property.AnimationTimingFunction;
}

export interface BackgroundProperty {
  attachment?: CSSType.Property.BackgroundAttachment;
  clip?: CSSType.Property.BackgroundClip;
  color?: CSSType.Property.BackgroundColor;
  image?: CSSType.Property.BackgroundImage;
  origin?: CSSType.Property.BackgroundOrigin;
  position?: CSSType.Property.BackgroundPosition<Value>;
  repeat?: CSSType.Property.BackgroundRepeat;
  size?: CSSType.Property.BackgroundSize<Value>;
}

export interface BorderProperty {
  color?: CSSType.Property.BorderColor;
  style?: CSSType.Property.BorderStyle;
  width?: CSSType.Property.BorderWidth<Value>;
}

export interface ColumnRuleProperty {
  color?: CSSType.Property.ColumnRuleColor;
  style?: CSSType.Property.ColumnRuleStyle;
  width?: CSSType.Property.ColumnRuleWidth<Value>;
}

export interface FlexProperty {
  basis?: CSSType.Property.FlexBasis<Value>;
  grow?: CSSType.Property.FlexGrow;
  shrink?: CSSType.Property.FlexShrink;
}

export interface FontProperty {
  family?: CSSType.Property.FontFamily;
  lineHeight?: CSSType.Property.LineHeight<Value>;
  size?: CSSType.Property.FontSize<Value>;
  stretch?: CSSType.Property.FontStretch;
  style?: CSSType.Property.FontStyle;
  system?: string;
  variant?: CSSType.Property.FontVariant;
  weight?: CSSType.Property.FontWeight;
}

export interface ListStyleProperty {
  image?: CSSType.Property.ListStyleImage;
  position?: CSSType.Property.ListStylePosition;
  type?: CSSType.Property.ListStyleType;
}

export interface MarginProperty {
  bottom?: CSSType.Property.MarginBottom<Value>;
  left?: CSSType.Property.MarginLeft<Value>;
  leftRight?: CSSType.Property.MarginLeft<Value> | CSSType.Property.MarginRight<Value>;
  right?: CSSType.Property.MarginRight<Value>;
  top?: CSSType.Property.MarginTop<Value>;
  topBottom?: CSSType.Property.MarginTop<Value> | CSSType.Property.MarginBottom<Value>;
}

export interface OffsetProperty {
  anchor?: CSSType.Property.OffsetAnchor<string>;
  distance?: CSSType.Property.OffsetDistance<string>;
  path?: CSSType.Property.OffsetPath;
  position?: string; // NOT UPSTREAM
  rotate?: CSSType.Property.OffsetRotate;
}

export interface OutlineProperty {
  color?: CSSType.Property.OutlineColor;
  style?: CSSType.Property.OutlineStyle;
  width?: CSSType.Property.OutlineWidth<Value>;
}

export interface PaddingProperty {
  bottom?: CSSType.Property.PaddingBottom<Value>;
  left?: CSSType.Property.PaddingLeft<Value>;
  leftRight?: CSSType.Property.PaddingLeft<Value> | CSSType.Property.PaddingRight<Value>;
  right?: CSSType.Property.PaddingRight<Value>;
  top?: CSSType.Property.PaddingTop<Value>;
  topBottom?: CSSType.Property.PaddingTop<Value> | CSSType.Property.PaddingBottom<Value>;
}

export interface TextDecorationProperty {
  color?: CSSType.Property.TextDecorationColor;
  line?: CSSType.Property.TextDecorationLine;
  style?: CSSType.Property.TextDecorationStyle;
  thickness?: CSSType.Property.TextDecorationThickness<Value>;
}

export interface TransitionProperty {
  delay?: CSSType.Property.TransitionDelay;
  duration?: CSSType.Property.TransitionDuration;
  property?: CSSType.Property.TransitionProperty;
  timingFunction?: CSSType.Property.TransitionTimingFunction;
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
