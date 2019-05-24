# Aesthetic with Aphrodite

[![Build Status](https://travis-ci.org/milesj/aesthetic.svg?branch=master)](https://travis-ci.org/milesj/aesthetic)
[![npm version](https://badge.fury.io/js/aesthetic-adapter-aphrodite.svg)](https://www.npmjs.com/package/aesthetic-adapter-aphrodite)
[![npm deps](https://david-dm.org/milesj/aesthetic.svg?path=packages/adapter-aphrodite)](https://www.npmjs.com/package/aesthetic-adapter-aphrodite)

Provides [Aphrodite](https://github.com/Khan/aphrodite) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

```ts
import AphroditeAesthetic from 'aesthetic-adapter-aphrodite';
import { Theme } from './types';

const aesthetic = new AphroditeAesthetic<Theme>(extensions, options);
```

## Requirements

- Aesthetic
- Aphrodite

## Installation

```
yarn add aesthetic aesthetic-adapter-aphrodite aphrodite
// Or
npm install aesthetic aesthetic-adapter-aphrodite aphrodite
```

## Documentation

[https://milesj.gitbook.io/aesthetic/adapters/aphrodite](https://milesj.gitbook.io/aesthetic/adapters/aphrodite)
