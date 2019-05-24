# Aesthetic via React

[![Build Status](https://travis-ci.org/milesj/aesthetic.svg?branch=master)](https://travis-ci.org/milesj/aesthetic)
[![npm version](https://badge.fury.io/js/aesthetic-react.svg)](https://www.npmjs.com/package/aesthetic-react)
[![npm deps](https://david-dm.org/milesj/aesthetic.svg?path=packages/react)](https://www.npmjs.com/package/aesthetic-react)

Style React components with hooks or HOCs, using the powerful
[Aesthetic](https://github.com/milesj/aesthetic) library.

```tsx
import React from 'react';
import useStyles from './useStyles';

export type Props = {
  children: React.ReactNode;
};

export default function Button({ children }: Props) {
  const [styles, cx] = useStyles(({ unit }) => ({
    button: {
      textAlign: 'center',
      display: 'inline-block',
      padding: unit,
    },
  }));

  return (
    <button type="button" className={cx(styles.button)}>
      {children}
    </button>
  );
}
```

## Requirements

- React 16.6+

## Installation

```
yarn add aesthetic aesthetic-react react
// Or
npm install aesthetic aesthetic-react react
```

## Documentation

[https://milesj.gitbook.io/aesthetic/integrations/react](https://milesj.gitbook.io/aesthetic/integrations/react)
