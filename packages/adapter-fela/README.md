# Aesthetic with Fela

[![Build Status](https://travis-ci.org/milesj/aesthetic.svg?branch=master)](https://travis-ci.org/milesj/aesthetic)
[![npm version](https://badge.fury.io/js/aesthetic-adapter-fela.svg)](https://www.npmjs.com/package/aesthetic-adapter-fela)
[![npm deps](https://david-dm.org/milesj/aesthetic.svg?path=packages/adapter-fela)](https://www.npmjs.com/package/aesthetic-adapter-fela)

Provides [Fela](https://github.com/rofrischmann/fela) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

```ts
import FelaAesthetic from 'aesthetic-adapter-fela';
import { createRenderer } from 'fela';
import webPreset from 'fela-preset-web';
import { Theme } from './types';

const fela = createRenderer({ plugins: [...webPreset] });
const aesthetic = new FelaAesthetic<Theme>(fela, options);
```

## Requirements

- React 16.3+
- Aesthetic
- Fela

## Installation

```
yarn add aesthetic aesthetic-adapter-fela fela fela-dom
// Or
npm install aesthetic aesthetic-adapter-fela fela fela-dom
```

## Documentation

[https://milesj.gitbook.io/aesthetic/adapters/fela](https://milesj.gitbook.io/aesthetic/adapters/fela)
