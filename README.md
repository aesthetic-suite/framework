# Aesthetic

[![Build Status](https://github.com/aesthetic-suite/framework/workflows/Build/badge.svg)](https://github.com/aesthetic-suite/framework/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40aesthetic%core.svg)](https://www.npmjs.com/package/@aesthetic/core)
[![npm deps](https://david-dm.org/aesthetic-suite/framework.svg?path=packages/core)](https://www.npmjs.com/package/@aesthetic/core)

> Start using Aesthetic now! [aestheticsuite.dev](https://aestheticsuite.dev)

Aesthetic is an end-to-end, multi-platform styling and design suite, that offers the following
packages.

- [Compiler](./packages/compiler) - Compiles a design system YAML configuration into Android, iOS,
  and Web targets -- like Less, Sass, or CSS-in-JS.
- [Design system](./packages/system) - JavaScript implementation of the design system configuration,
  with theme and user preference support (color schemes, contrast levels, etc).
- [Style engine](./packages/style) - Low-level API that renders CSS declarations into the DOM using
  atomic class names and CSS variables for high performance, low filesize, and efficient caching.
  Also supports server-side rendering and client-side hydration.
- [Core](./packages/core) - Core API the combines the previous 4 packages into a single but powerful
  CSS-in-JS solution. Is framework agnostic and can be used within any project.
- [React](https://github.com/aesthetic-suite/react) - React integration that is built on top of the
  core API. Provides hook and HOC based patterns, with support for contextual themes,
  directionality, and SSR.

## Goals

There are many styling solutions that exist, but none of them are perfect. They either offer too
little, or too much, are not cross-platform, have complicated APIs, require too much overhead, so on
and so forth.

Aesthetic aims to solve all of these problems as streamlined and efficient as possible by delivering
on the following goals for both designers _and_ engineers.

- **Designers must be able to contribute.** To support this, the design system is configured in
  YAML, which is easy to learn, read, and write, and works across all operating systems and
  languages.
- **Configuration _and_ convention.** YAML configuration will allow for explicit customizability if
  needed, otherwise the automated settings will suffice as the common denominator. Ultimately,
  regardless of which approach is chosen, it will be compiled down to the same design tokens.
- **Mobile first _or_ desktop first.** Regardless of what device is being targeted, responsive and
  adaptive support will be baked into the system, with utilities to effortless integrate it.
- **Multiple design systems can be used in parallel.** Through themes, this allows for a migration
  between old and new designs (2019 vs 2020), without having to modify components or style sheets.
  For this to work, the theme needs to be strict.
- **Interoping with third-party libraries must be seamless.** If a library is written in Aesthetic,
  and they use our utilities and theme structure, they immediately gain all the benefits of the
  design system.
- **Support all platforms.** Why only support web? Let's support Android and iOS as well, so that
  the design system is truly universal, and is the source of truth.
- **Support all styling patterns.** Use Sass? Or maybe Less? Or you on the CSS-in-JS train? Either
  way, no matter what pattern your application uses (or maybe multiple patterns), the design system
  can target all of them.
- **Performance is top priority.** Regardless of what platform and target is chosen, performance
  overhead should be almost non-existant. Aim for zero or low runtime overhead.
- **Developer experience must be enjoyable.** Ideally, all Aesthetic APIs and systems are easy to
  use, easy to learn, and ultimately enjoyable to integrate.
- **Testing is an after-thought.** When testing styled components, it will just work. No extra
  overhead or DOM requirements are necessary. Will also be easy to test class name and style changes
  based on props.
- **User preference matters.** Does the user prefer dark color schemes? Low contrast colors? Reduced
  motion? The framework will take all this into account, throughout all aspects of the framework.

## Requirements

- IE 11+
- APIs
  - `Array.from`
  - `Number.parseFloat`
  - `Object.assign`
  - `Object.values`
  - `matchMedia`

## Documentation

[https://aestheticsuite.dev](https://aestheticsuite.dev)
