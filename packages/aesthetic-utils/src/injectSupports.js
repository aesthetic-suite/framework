/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import type { Supports, StyleDeclaration } from '../../types';

export default function injectSupports(properties: StyleDeclaration, features: Supports) {
  Object.keys(features).forEach((key) => {
    properties[`@supports ${key}`] = features[key];
  });
}
