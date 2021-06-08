/* eslint-disable sort-keys */

import { Rule } from '@aesthetic/types';

export const SYNTAX_SUPPORTS: Rule = {
  display: 'block',
  '@supports': {
    '(display: flex)': {
      display: 'flex',
    },
    'not (display: flex)': {
      float: 'left',
    },
  },
};
