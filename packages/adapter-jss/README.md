# Aesthetic with JSS

[![Build Status](https://travis-ci.org/milesj/aesthetic.svg?branch=master)](https://travis-ci.org/milesj/aesthetic)
[![npm version](https://badge.fury.io/js/aesthetic-adapter-jss.svg)](https://www.npmjs.com/package/aesthetic-adapter-jss)
[![npm deps](https://david-dm.org/milesj/aesthetic.svg?path=packages/adapter-jss)](https://www.npmjs.com/package/aesthetic-adapter-jss)

Provides [JSS](https://github.com/cssinjs/jss) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

```ts
import JSSAesthetic from 'aesthetic-adapter-jss';
import { create } from 'jss';
import preset from 'jss-preset-default';
import { Theme } from './types';

const jss = create(preset());
const aesthetic = new JSSAesthetic<Theme>(jss, options);
```

## Requirements

- React 16.3+
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
