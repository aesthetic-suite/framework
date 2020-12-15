# Aesthetic - Custom Properties

[![Build Status](https://github.com/aesthetic-suite/framework/workflows/Build/badge.svg)](https://github.com/aesthetic-suite/framework/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40aesthetic%addon-properties.svg)](https://www.npmjs.com/package/@aesthetic/addon-properties)
[![npm deps](https://david-dm.org/aesthetic-suite/framework.svg?path=packages/addon-properties)](https://www.npmjs.com/package/@aesthetic/addon-properties)

Enables custom values and types for built-in CSS properties. Primarily adds support for expanded
form object values.

```ts
import { expandedProperties } from '@aesthetic/addon-properties';
import { configure } from '@aesthetic/<integration>';
import { parse } from '@aesthetic/sss';

// When using entire Aesthetic framework
configure({
  customProperties: expandedProperties,
});

// When using SSS directly
parse('local', styles, {
  customProperties: expandedProperties,
});
```

## Installation

```
yarn add @aesthetic/addon-properties
```

## Documentation

[https://aestheticsuite.dev](https://aestheticsuite.dev)
