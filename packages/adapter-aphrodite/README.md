# Aesthetic with Aphrodite

[![Build Status](https://github.com/milesj/aesthetic/workflows/Build/badge.svg)](https://github.com/milesj/aesthetic/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/aesthetic-adapter-aphrodite.svg)](https://www.npmjs.com/package/aesthetic-adapter-aphrodite)
[![npm deps](https://david-dm.org/milesj/aesthetic.svg?path=packages/adapter-aphrodite)](https://www.npmjs.com/package/aesthetic-adapter-aphrodite)

Provides [Aphrodite](https://github.com/Khan/aphrodite) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

```ts
import aesthetic from 'aesthetic';
import AphroditeAdapter from 'aesthetic-adapter-aphrodite';

aesthetic.configure({
  adapter: new AphroditeAdapter(extensions),
});
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
