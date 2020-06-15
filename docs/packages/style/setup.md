# Getting started

Install with NPM or Yarn. No additional dependencies are required.

```bash
yarn add @aesthetic/style
```

## Usage

We implement and provide what's known as a renderer. The renderer handles all the heavy lifting
behind a streamlined API, but at a high-level, it converts _style objects_ to
[atomic CSS](https://css-tricks.com/lets-define-exactly-atomic-css/), which it then inserts into the
document as performant as possible.

To begin, import and instantiate the `ClientRenderer` from `@aesthetic/style`. This renderer was
designed for the browser, but an alternative exists for [server-side rendering](./ssr.md).

```ts
import { ClientRenderer } from '@aesthetic/style';

const renderer = new ClientRenderer();
```

You can then render CSS declarations and rules to generate atomic class names (1 class name per
declaration). Rendered styles are batched and inserted every animation frame, in an effort to reduce
repaints and layout tearing.

```ts
const className = renderer.renderRule({
  margin: 0,
  padding: '6px 12px',
  textAlign: 'center',
  color: 'var(--color)',
  backgroundColor: 'transparent',
  border: '2px solid #eee',

  ':hover': {
    borderColor: '#fff',
  },

  '@media (max-width: 600px)': {
    display: 'block',
  },
}); // -> a b c d e f g h
```

That's about it, basic right? If you're looking for more advanced techniques, patterns, and usage,
continue reading the following chapters.

- [Rendering concepts](./concepts.md)
- [Features & options](./options.md)
- [API](./api.md)

## Style sheet order

The renderer implements a unique approach around managing `<style />` elements, as it uses 3
elements unlike most competitors which use 1. By using multiple elements, we can ensure proper
specificity and ordering of styles. In document order, the style sheets are:

- **Globals** are the 1st style sheet. Primarily used for rendering root level at-rules like
  `@font-face` and `@keyframes`, but can house anything.
- **Standard rules** are the 2nd style sheet. This is where most CSS declarations are rendered.
- **Conditional rules** are the 3rd and final style sheet. Only renders `@media` and `@supports`
  rules to ensure their styles override the standard styles. Media queries are also
  [sorted based on their query](https://www.npmjs.com/package/sort-css-media-queries).

## Development vs production

Depending on the `NODE_ENV` environment, the renderer will insert styles using different mechanisms.

In `production` it uses the native `CSSStyleSheet#insertRule()` to render as performant and
efficient as possible.

In `development` it uses `style.textContent` to render styles. This approach is much slower but
allows styles to be modified from within a browser's developer tools.
