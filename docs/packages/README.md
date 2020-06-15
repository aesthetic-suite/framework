# Packages

Aesthetic is an end-to-end, multi-platform styling and design suite, that is powered by multiple NPM
packages. Most of these packages can be used stand-alone, while others are built around and require
other Aesthetic packages.

We're a big fan of composition and interoperability, so we're offering documentation for each
package as if it's being used stand-alone. The following packages are available.

- [Design system](./system/README.md) - JavaScript implementation of the design system
  configuration, with theme and user preference support (color schemes, contrast levels, etc).
- [Structured style sheets](./sss/README.md) - Also known as SSS, it provides a type-safe and
  structured style sheet format for CSS-in-JS solutions. Provides parsers for local and global
  scopes.
- [Style engine](./style/README.md) - Low-level API that renders CSS declarations into the DOM using
  atomic class names and CSS variables for high performance, low filesize, and efficient caching.
  Also supports server-side rendering and client-side hydration.
- **Core** - Core API the combines the previous packages into a single but powerful CSS-in-JS
  solution. Is the foundation for framework integrations below.

Aesthetic was designed to be framework agnostic, and as such, provides integrations for the
following popular view/template based libraries.

- **React** - React integration that is built on top of the core API. Provides hook and HOC based
  patterns, with support for contextual themes, directionality, and SSR.
