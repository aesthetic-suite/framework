/* eslint-disable sort-keys */

import { LocalBlock } from '../../src/types';

export const SYNTAX_LOCAL_BLOCK: LocalBlock = {
  margin: 0,
  padding: '6px 12px',
  border: '1px solid #2e6da4',
  borderRadius: 4,
  display: 'inline-block',
  cursor: 'pointer',
  fontFamily: 'Roboto',
  fontWeight: 'normal',
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  textAlign: 'left',
  backgroundColor: '#337ab7',
  verticalAlign: 'middle',
  color: 'rgba(0, 0, 0, 0)',
  animationName: 'fade',
  animationDuration: '.3s',
  ':hover': {
    backgroundColor: '#286090',
    borderColor: '#204d74',
  },
  '::before': {
    content: '"★"',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: 5,
  },
  '[disabled]': {
    opacity: 0.5,
  },
};

export const SYNTAX_FALLBACKS: LocalBlock = {
  background: 'linear-gradient(...)',
  display: 'flex',
  '@fallbacks': {
    background: 'red',
    display: ['block', 'inline-block'],
    // Test property without a non-fallback
    color: 'blue',
  },
};

export const SYNTAX_MEDIA: LocalBlock = {
  color: 'red',
  paddingLeft: 10,
  '@media': {
    '(min-width: 300px)': {
      color: 'blue',
      paddingLeft: 15,
    },
    '(max-width: 1000px)': {
      color: 'green',
      paddingLeft: 20,
    },
  },
};

export const SYNTAX_MEDIA_NESTED: LocalBlock = {
  color: 'red',
  '@media': {
    '(min-width: 300px)': {
      color: 'blue',
      '@media': {
        '(max-width: 1000px)': {
          color: 'green',
        },
      },
    },
  },
};

export const SYNTAX_SELECTOR_ATTRIBUTES: LocalBlock = {
  display: 'block',
  '[disabled]': {
    opacity: 0.5,
  },
  '[href]': {
    cursor: 'pointer',
  },
};

export const SYNTAX_SELECTOR_PSEUDOS: LocalBlock = {
  position: 'fixed',
  ':hover': {
    position: 'static',
  },
  '::before': {
    position: 'absolute',
  },
};

export const SYNTAX_SELECTORS_SPECIFICITY: LocalBlock = {
  position: 'fixed',
  '@selectors': {
    '&&:hover': {
      position: 'static',
    },
    '&:active': {
      position: 'absolute',
    },
    '&&&[hidden]': {
      position: 'relative',
    },
  },
};

export const SYNTAX_SELECTORS_COMBINATORS: LocalBlock = {
  margin: 0,
  padding: 0,
  '@selectors': {
    '> li': {
      listStyle: 'bullet',
    },
    '+ div': {
      display: 'none',
    },
    '~ span': {
      color: 'black',
    },
    '*': {
      backgroundColor: 'inherit',
    },
  },
};

export const SYNTAX_SELECTORS_MULTIPLE: LocalBlock = {
  cursor: 'pointer',
  '@selectors': {
    ':disabled, &&[disabled], > span': {
      cursor: 'default',
    },
  },
};

export const SYNTAX_PROPERTIES: LocalBlock = {
  color: 'black',
  display: 'inline',
  marginRight: 10,
  padding: 0,
};

export const SYNTAX_NATIVE_PROPERTIES: LocalBlock = {
  // @ts-expect-error Allow for testing React Native
  transform: [{ scale: 2 }],
  shadowOffset: { width: 10, height: 10 },
};

export const SYNTAX_VARIABLES: LocalBlock = {
  display: 'block',
  '@variables': {
    fontSize: '14px',
    color: 'red',
    '--line-height': 1.5,
  },
};

export const SYNTAX_VARIANTS: LocalBlock = {
  '@variants': {
    'size:small': {
      fontSize: 14,
    },
    'size:default': {
      fontSize: 16,
    },
    'size:large': {
      fontSize: 18,
    },
  },
};

export const SYNTAX_COMPOUND_VARIANTS: LocalBlock = {
  '@variants': {
    'size:large + palette:negative': {
      fontWeight: 'bold',
    },
  },
};
