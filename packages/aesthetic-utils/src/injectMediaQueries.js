/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import type { MediaQueries, StyleDeclaration } from '../../types';

export default function injectMediaQueries(properties: StyleDeclaration, queries: MediaQueries) {
  Object.keys(queries).forEach((key) => {
    let query = key;

    if (query.slice(0, 1) !== '(' || query.slice(-1) !== ')') {
      query = `(${query})`;
    }

    properties[`@media ${key}`] = queries[key];
  });
}
