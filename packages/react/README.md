# Aesthetic - React Integration

[![Build Status](https://github.com/milesj/aesthetic/workflows/Build/badge.svg)](https://github.com/milesj/aesthetic/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/aesthetic-react.svg)](https://www.npmjs.com/package/aesthetic-react)
[![npm deps](https://david-dm.org/milesj/aesthetic.svg?path=packages/react-legacy)](https://www.npmjs.com/package/aesthetic-react)

Style React components with hooks or HOCs, using the powerful
[Aesthetic](https://github.com/milesj/aesthetic) library.

```tsx
import React from 'react';
import { createComponentStyles, useStyles } from '@aesthetic/react';

const styleSheet = createComponentStyles((css) => ({
  button: {
    textAlign: 'center',
    display: 'inline-block',
    padding: css.var('spacing-df'),
  },
}));

export type Props = {
  children: React.ReactNode;
};

export default function Button({ children }: Props) {
  const cx = useStyles(styleSheet);

  return (
    <button type="button" className={cx('button')}>
      {children}
    </button>
  );
}
```

## Requirements

- React 16.6+

## Installation

```
yarn add @aesthetic/core @aesthetic/react react
```

## Documentation

[https://milesj.gitbook.io/aesthetic/integrations/react](https://milesj.gitbook.io/aesthetic/integrations/react)