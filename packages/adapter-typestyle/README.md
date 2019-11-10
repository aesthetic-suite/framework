# Aesthetic with TypeStyle

[![Build Status](https://github.com/milesj/aesthetic/workflows/Build/badge.svg)](https://github.com/milesj/aesthetic/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/aesthetic-adapter-typestyle.svg)](https://www.npmjs.com/package/aesthetic-adapter-typestyle)
[![npm deps](https://david-dm.org/milesj/aesthetic.svg?path=packages/adapter-typestyle)](https://www.npmjs.com/package/aesthetic-adapter-typestyle)

Provides [TypeStyle](https://github.com/threepointone/typestyle) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

```ts
import TypeStyleAesthetic from 'aesthetic-adapter-typestyle';
import { TypeStyle } from 'typestyle';
import { Theme } from './types';

const aesthetic = new TypeStyleAesthetic<Theme>(new TypeStyle({ autoGenerateTag: true }), options);
```

## Requirements

- Aesthetic
- TypeStyle

## Installation

```
yarn add aesthetic aesthetic-adapter-typestyle typestyle
// Or
npm install aesthetic aesthetic-adapter-typestyle typestyle
```

## Documentation

[https://milesj.gitbook.io/aesthetic/adapters/typestyle](https://milesj.gitbook.io/aesthetic/adapters/typestyle)
