/* eslint-disable no-param-reassign */
/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { AddPropertyCallback, PropertyHandlerMap } from '@aesthetic/sss';
import { Value } from '@aesthetic/types';
import { isObject, objectLoop } from '@aesthetic/utils';
import { FontProperty, MarginProperty, PaddingProperty } from './types';

function collapse(property: string, object: object, add: AddPropertyCallback) {
  objectLoop(object, (val: Value, key: string) => {
    add(property + key[0].toUpperCase() + key.slice(1), val);
  });
}

function handleExpanded(property: string) {
  return (value: unknown, add: AddPropertyCallback) => {
    if (isObject(value)) {
      collapse(property, value, add);
    } else {
      add(property, value as Value);
    }
  };
}

function handleExpandedSpacing(property: string) {
  return (value: unknown, add: AddPropertyCallback) => {
    if (!isObject<MarginProperty | PaddingProperty>(value)) {
      add(property, value as Value);

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
  animation: handleExpanded('animation'),
  background: handleExpanded('background'),
  border: handleExpanded('border'),
  borderBottom: handleExpanded('borderBottom'),
  borderLeft: handleExpanded('borderLeft'),
  borderRight: handleExpanded('borderRight'),
  borderTop: handleExpanded('borderTop'),
  columnRule: handleExpanded('columnRule'),
  flex: handleExpanded('flex'),
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
  listStyle: handleExpanded('listStyle'),
  margin: handleExpandedSpacing('margin'),
  offset: handleExpanded('offset'),
  outline: handleExpanded('outline'),
  padding: handleExpandedSpacing('padding'),
  textDecoration: handleExpanded('textDecoration'),
  transition: handleExpanded('transition'),
};

export * from './types';
