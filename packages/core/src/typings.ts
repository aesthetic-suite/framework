/* eslint-disable @typescript-eslint/camelcase */

import LocalSheet from './LocalSheet';

new LocalSheet(() => ({
  button: {
    border: '1px solid black',
    padding: {
      bottom: '10px',
      top: 5,
    },
  },
}))
  .addColorSchemeVariant('dark', () => ({
    button: {
      margin: 0,
      padding: {
        right: 1,
      },
    },
    button_active: {
      color: 'red',
    },
  }))
  .addThemeVariant('night', () => ({
    button: {
      color: 'black',
    },
  }));
