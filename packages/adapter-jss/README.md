# Aesthetic with JSS

[![Build Status](https://github.com/milesj/aesthetic/workflows/Build/badge.svg)](https://github.com/milesj/aesthetic/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/aesthetic-adapter-jss.svg)](https://www.npmjs.com/package/aesthetic-adapter-jss)
[![npm deps](https://david-dm.org/milesj/aesthetic.svg?path=packages/adapter-jss)](https://www.npmjs.com/package/aesthetic-adapter-jss)

Provides [JSS](https://github.com/cssinjs/jss) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

```ts
import aesthetic from 'aesthetic';
import JSSAdapter from 'aesthetic-adapter-jss';
import { create } from 'jss';
import preset from 'jss-preset-default';

aesthetic.configure({
  adapter: new JSSAdapter(create(preset())),
});
```

## Requirements

- Aesthetic
- JSS

## Installation

```
yarn add aesthetic aesthetic-adapter-jss jss jss-nested
// Or
npm install aesthetic aesthetic-adapter-jss jss jss-nested
```

> The `jss-nested` plugin is required.

## Documentation

[https://milesj.gitbook.io/aesthetic/adapters/jss](https://milesj.gitbook.io/aesthetic/adapters/jss)
