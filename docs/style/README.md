# CSS-in-JS Style Engine

The `@aesthetic/style` package is a low-level, high-performance, atomic-based CSS-in-JS styling
engine. It can be used stand-alone but has been designed to power additional abstractions or APIs.

- [Getting started](./setup.md)
- [Rendering concepts](./concepts.md)
- [Features & options](./options.md)
- [Server-side rendering](./ssr.md)
- [API](./api.md)

## What it provides

- Atomic based CSS. One property per class name.
- Specificity ranking so the intended property is always rendered.
- Font faces, keyframes, imports, and other globals are rendered before normal declarations.
- Media and support queries are grouped and rendered after normal declarations.
- Media queries are sorted mobile-first or desktop-first.
- Injection buffering for increased performance and reduced paints.
- Style declarations support pseudos, attributes, conditional at-rules, and nested declarations.
- Deterministic or atomic incremental CSS class names.
- Right-to-left (RTL) integration.
- Automatic vendor prefixing for browsers with >= 1% market share.
- First-class CSS variables support.
- Server-side rendering _and_ client-side hydration.
- Framework and library agnostic. Can be used stand-alone.

## What it does not provide

- A plugin system, as such a system would degrade performance.
- Numerical values are not automatically suffixed with a unit (`px`, etc).
- Rendering of styles in the global scope: `div`, `a`, etc.
- Rendering of uncommon at-rules: `@namespace`, `@document`, `@page`, `@viewport`.
