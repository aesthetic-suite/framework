# Unified syntax -> SSS

## New

- `@import` supports an object form.
- `@page` now supports type selectors.
- `@variables` for both local and global.

## Breaking

- Removed `@charset`.
- `@import` is only an array now, no string.
- Stylis (raw CSS) support has been removed.

# Core

EVERYTHING!

# React

## New

- `createComponentStyles`
- `useDirection`

## Breaking

- Styles must now be created with `createComponentStyles`.
- Style factory tokens are now strict via a design system.
- `DirectionProvider` prop `dir` is now `direction`.
- `useStyles` only returns the `cx` function.
- `useTheme` returns the new theme object.
- `withStyles` and `withTheme` no longer accepts options.