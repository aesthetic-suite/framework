# Aesthetic - Direction Converter

[![Build Status](https://github.com/aesthetic-suite/framework/workflows/Build/badge.svg)](https://github.com/aesthetic-suite/framework/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40aesthetic%addon-direction.svg)](https://www.npmjs.com/package/@aesthetic/addon-direction)
[![npm deps](https://david-dm.org/aesthetic-suite/framework.svg?path=packages/addon-direction)](https://www.npmjs.com/package/@aesthetic/addon-direction)

Aesthetic addon to convert direction between LTR and RTL.

```ts
import directionConverter from '@aesthetic/addon-direction';
import { configure } from '@aesthetic/core';
import { createClientEngine } from '@aesthetic/style';

// When using entire Aesthetic framework
configure({
  directionConverter,
});

// When using CSS-in-JS engine directly
const engine = createClientEngine({
  direction: 'ltr', // Base
  directionConverter,
});
```

## Installation

```
yarn add @aesthetic/addon-direction
```

## Documentation

[https://aestheticsuite.dev](https://aestheticsuite.dev)
