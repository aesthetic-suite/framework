# Aesthetic with Fela

[![Build Status](https://github.com/milesj/aesthetic/workflows/Build/badge.svg)](https://github.com/milesj/aesthetic/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/aesthetic-adapter-fela.svg)](https://www.npmjs.com/package/aesthetic-adapter-fela)
[![npm deps](https://david-dm.org/milesj/aesthetic.svg?path=packages/adapter-fela)](https://www.npmjs.com/package/aesthetic-adapter-fela)

Provides [Fela](https://github.com/rofrischmann/fela) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

```ts
import aesthetic from 'aesthetic';
import FelaAdapter from 'aesthetic-adapter-fela';
import { createRenderer } from 'fela';
import webPreset from 'fela-preset-web';

aesthetic.configure({
  adapter: new FelaAdapter(createRenderer({ plugins: [...webPreset] })),
});
```

## Requirements

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
