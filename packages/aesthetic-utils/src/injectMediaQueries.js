/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import type { MediaQueries, StyleDeclaration } from '../../types';

export default function injectMediaQueries(properties: StyleDeclaration, queries: MediaQueries) {
  Object.keys(queries).forEach((key) => {
    properties[`@media ${key}`] = queries[key];
  });
}
