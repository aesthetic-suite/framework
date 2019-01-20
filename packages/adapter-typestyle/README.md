# Aesthetic with TypeStyle

[![Build Status](https://travis-ci.org/milesj/aesthetic.svg?branch=master)](https://travis-ci.org/milesj/aesthetic)
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

- React 16.3+
- Aesthetic
- TypeStyle

## Installation

```
yarn add aesthetic aesthetic-adapter-typestyle typestyle
// Or
npm install aesthetic aesthetic-adapter-typestyle typestyle
```
