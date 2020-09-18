# Aesthetic - Vendor Prefixes

[![Build Status](https://github.com/aesthetic-suite/framework/workflows/Build/badge.svg)](https://github.com/aesthetic-suite/framework/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40aesthetic%addon-vendor.svg)](https://www.npmjs.com/package/@aesthetic/addon-vendor)
[![npm deps](https://david-dm.org/aesthetic-suite/framework.svg?path=packages/addon-vendor)](https://www.npmjs.com/package/@aesthetic/addon-vendor)

Aesthetic addon to provide vendor prefixes for properties, values, and selectors.

```ts
import prefixer from '@aesthetic/addon-vendor';
import { configure } from '@aesthetic/core';
import { ClientRenderer } from '@aesthetic/style';

// When using entire Aesthetic framework
configure({
  vendorPrefixer: prefixer,
});

// When using CSS-in-JS engine directly
const renderer = new ClientRenderer({
  prefixer,
});
```

> Currently, features and browsers that are _not dead_ and have _>= 1% market share_ will apply
> vendor prefixes.

## Installation

```
yarn add @aesthetic/addon-vendor
```

## Documentation

[https://aestheticsuite.dev](https://aestheticsuite.dev)
