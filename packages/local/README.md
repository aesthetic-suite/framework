# Aesthetic - React Integration

[![Build Status](https://github.com/aesthetic-suite/react/workflows/Build/badge.svg)](https://github.com/aesthetic-suite/react/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40aesthetic%react.svg)](https://www.npmjs.com/package/@aesthetic/react)
[![npm deps](https://david-dm.org/aesthetic-suite/react.svg?path=packages/react)](https://www.npmjs.com/package/@aesthetic/react)

Provides styles for React components through hook or HOC based APIs. Built around the powerful
[Aesthetic](https://github.com/aesthetic-suite/framework) core library.

```tsx
import React from 'react';
import { createComponentStyles, useStyles } from '@aesthetic/react';

export const styleSheet = createComponentStyles((css) => ({
  button: css.mixin('pattern-reset-button', {
    padding: css.var('spacing-df'),
  }),

  button_block: {
    display: 'block',
  },
}));

export interface ButtonProps {
  children: React.ReactNode;
  block?: boolean;
}

export default function Button({ children, block = false }: ButtonProps) {
  const cx = useStyles(styleSheet);

  return (
    <button type="button" className={cx('button', block && 'button_block')}>
      {children}
    </button>
  );
}
```

## Features

- Hook and HOC based APIs for styling components, accessing themes, and handling directionality.
- Global, document, and element level themes powered through context.
- Nested themes that avoid polluting the global scope.
- First-class directionality support (RTL, LTR).

## Requirements

- React 16.6+ / 17+

## Installation

```
yarn add @aesthetic/react react react-dom
```

## Documentation

[https://aestheticsuite.dev/docs/integrations/react](https://aestheticsuite.dev/docs/integrations/react)
