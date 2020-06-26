# Compile design tokens

Design tokens are reusable, flexible, and scalable variables and mixins that are derived from a
design system's language and themes. They enable teams to work cross-platform, across different
implementations, libraries, and programming languages, by offering true interoperability.

Once your design system has been [created](./create.md) and [configured](../config/README.md), you
may compile the configuration into the tokens mentioned above by running the `compile`
[command](../prerequisites.md#command-line). This command requires a name (a folder within
`.aesthetic`), an [output format](#formats), and a target folder to write files to.

```bash
aesthetic compile <name> ./styles/system --format web-css
```

## Formats

Formats are the combination of a device platform and target language, and represent the compiled
output of a design system configuration. Pass the `--format` option to choose one of the following.

- **Android**
  - _(Coming soon)_
- **iOS**
  - _(Coming soon)_
- **Web**
  - [web-ts](../formats/web/css-in-js.md) - CSS-in-JS with TypeScript.
  - [web-js](../formats/web/css-in-js.md) - CSS-in-JS with JavaScript.
  - [web-cjs](../formats/web/css-in-js.md) - CSS-in-JS with JavaScript (CommonJS).
  - [web-css](../formats/web/css.md) - CSS variables and classes.
  - [web-scss](../formats/web/scss.md) - SCSS variables and mixins.
  - [web-sass](../formats/web/sass.md) - Sass variables and mixins.
  - [web-less](../formats/web/less.md) - Less variables and mixins.

## Resources

- [What are design tokens?](https://css-tricks.com/what-are-design-tokens/)
- [Design tokens for dummies](https://uxdesign.cc/design-tokens-for-dummies-8acebf010d71)
