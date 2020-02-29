# Unified syntax -> SSS

## New

- `@import` supports an object form.
- `@page` now supports type selectors.

## Breaking

- Removed `@charset`.
- `@import` is only an array now, no string.
- Stylis (raw CSS) support has been removed.

# React

## New

- `createComponentStyles`
- `useDirection`

## Breaking

- HOCs are no longer factories with options.
- Styles must now be created with `createComponentStyles`.
- `useTheme` returns the new theme object.
- `withTheme` no longer accepts options (removed `themePropName`).
