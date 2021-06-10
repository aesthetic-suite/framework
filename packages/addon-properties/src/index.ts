/* eslint-disable no-param-reassign */

/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import {
  AddPropertyCallback,
  Engine,
  FontFace,
  Keyframes,
  PropertyHandlerMap,
  Value,
} from '@aesthetic/types';
import { isObject, objectLoop, toArray } from '@aesthetic/utils';
import {
  AnimationProperty,
  BackgroundProperty,
  BorderProperty,
  ColumnRuleProperty,
  FlexProperty,
  FontProperty,
  ListStyleProperty,
  MarginProperty,
  OffsetProperty,
  OutlineProperty,
  PaddingProperty,
  TextDecorationProperty,
  TransitionProperty,
} from './types';

function collapse(property: string, object: object, add: AddPropertyCallback) {
  objectLoop(object, (value: Value, key: string) => {
    add((property + key[0].toUpperCase() + key.slice(1)) as 'padding', value);
  });
}

function handleCompound(property: 'animationName' | 'fontFamily') {
  return (
    value: FontFace | FontFace[] | Keyframes | Keyframes[] | string,
    add: AddPropertyCallback,
    engine: Engine<unknown>,
  ) => {
    const items = toArray(value).map((item) => {
      if (typeof item === 'string') {
        return item;
      }

      if (property === 'animationName') {
        return engine.renderKeyframes(item as Keyframes);
      }

      if (property === 'fontFamily') {
        return engine.renderFontFace(item as FontFace);
      }

      return '';
    });

    const name = Array.from(new Set(items)).filter(Boolean).join(', ');

    if (name) {
      add(property, name);
    }
  };
}

function handleExpanded<T extends object>(
  property:
    | 'animation'
    | 'background'
    | 'border'
    | 'borderBottom'
    | 'borderLeft'
    | 'borderRight'
    | 'borderTop'
    | 'columnRule'
    | 'flex'
    | 'listStyle'
    | 'offset'
    | 'outline'
    | 'textDecoration'
    | 'transition',
) {
  return (value: T | Value, add: AddPropertyCallback) => {
    if (isObject(value)) {
      collapse(property, value, add);
    } else {
      add(property, value);
    }
  };
}

function handleExpandedSpacing(property: 'margin' | 'padding') {
  return (value: MarginProperty | PaddingProperty | Value, add: AddPropertyCallback) => {
    if (!isObject(value)) {
      add(property, value);

      return;
    }

    if (value.topBottom) {
      add(`${property}Top`, value.topBottom);
      add(`${property}Bottom`, value.topBottom);
      value.topBottom = undefined;
    }

    if (value.leftRight) {
      add(`${property}Left`, value.leftRight);
      add(`${property}Right`, value.leftRight);
      value.leftRight = undefined;
    }

    collapse(property, value, add);
  };
}

export const expandedProperties: PropertyHandlerMap = {
  animation: handleExpanded<AnimationProperty>('animation'),
  animationName: handleCompound('animationName'),
  background: handleExpanded<BackgroundProperty>('background'),
  border: handleExpanded<BorderProperty>('border'),
  borderBottom: handleExpanded<BorderProperty>('borderBottom'),
  borderLeft: handleExpanded<BorderProperty>('borderLeft'),
  borderRight: handleExpanded<BorderProperty>('borderRight'),
  borderTop: handleExpanded<BorderProperty>('borderTop'),
  columnRule: handleExpanded<ColumnRuleProperty>('columnRule'),
  flex: handleExpanded<FlexProperty>('flex'),
  font(value, add) {
    if (isObject<FontProperty>(value)) {
      if (value.lineHeight) {
        add('lineHeight', value.lineHeight);
        value.lineHeight = undefined;
      }

      if (value.system) {
        add('font', value.system);
      } else {
        collapse('font', value, add);
      }
    } else {
      add('font', value);
    }
  },
  fontFamily: handleCompound('fontFamily'),
  listStyle: handleExpanded<ListStyleProperty>('listStyle'),
  margin: handleExpandedSpacing('margin'),
  offset: handleExpanded<OffsetProperty>('offset'),
  outline: handleExpanded<OutlineProperty>('outline'),
  padding: handleExpandedSpacing('padding'),
  textDecoration: handleExpanded<TextDecorationProperty>('textDecoration'),
  transition: handleExpanded<TransitionProperty>('transition'),
};

export * from './types';
