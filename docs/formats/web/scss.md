# SCSS format

The following format is provided when [compiling design tokens](../../compile-tokens.md) to
[SCSS](https://sass-lang.com/documentation/syntax).

## File structure

During compilation, an `_index.scss` file will be created based on the design system YAML
configuration file. Additional `themes/_<name>.scss` files will be created for each theme configured
in the YAML file. And lastly, a `_mixins.scss` file will also be created.

This would look something like the following:

```
styles/<target>/
├── themes/
│   ├── _day.scss
│   └── _night.scss
├── _index.scss
└── _mixins.scss
```

## Tokens

As mentioned above, a design system and multiple theme files are created. The design system file
defines aspect tokens, while each theme file defines color and palette tokens, both of which rely on
SCSS variables.

The compiled design system file looks something like the following:

```scss
$border-sm-radius: 0.11rem !default; // 1.50px
$border-sm-width: 0rem !default; // 0px
$border-df-radius: 0.21rem !default; // 3px
$border-df-width: 0.07rem !default; // 1px
$border-lg-radius: 0.32rem !default; // 4.50px
$border-lg-width: 0.14rem !default; // 2px

$breakpoint-xs-query: '(min-width: 45.71em)' !default;
$breakpoint-xs-query-size: 640 !default;
$breakpoint-xs-root-line-height: 1.33 !default;
$breakpoint-xs-root-text-size: 14.94px !default;
$breakpoint-sm-query: '(min-width: 68.57em)' !default;
$breakpoint-sm-query-size: 960 !default;
$breakpoint-sm-root-line-height: 1.42 !default;
$breakpoint-sm-root-text-size: 15.94px !default;
$breakpoint-md-query: '(min-width: 91.43em)' !default;
$breakpoint-md-query-size: 1280 !default;
$breakpoint-md-root-line-height: 1.52 !default;
$breakpoint-md-root-text-size: 17.01px !default;
$breakpoint-lg-query: '(min-width: 114.29em)' !default;
$breakpoint-lg-query-size: 1600 !default;
$breakpoint-lg-root-line-height: 1.62 !default;
$breakpoint-lg-root-text-size: 18.15px !default;
$breakpoint-xl-query: '(min-width: 137.14em)' !default;
$breakpoint-xl-query-size: 1920 !default;
$breakpoint-xl-root-line-height: 1.73 !default;
$breakpoint-xl-root-text-size: 19.36px !default;

$depth-content: 100 !default;
$depth-navigation: 1000 !default;
$depth-sheet: 1100 !default;
$depth-overlay: 1200 !default;
$depth-modal: 1300 !default;
$depth-toast: 1400 !default;
$depth-dialog: 1500 !default;
$depth-menu: 1600 !default;
$depth-tooltip: 1700 !default;

$heading-l1-letter-spacing: 0.25px !default;
$heading-l1-line-height: 1.5 !default;
$heading-l1-size: 1.14rem !default; // 16px
$heading-l2-letter-spacing: 0.33px !default;
$heading-l2-line-height: 1.69 !default;
$heading-l2-size: 1.43rem !default; // 20px
$heading-l3-letter-spacing: 0.44px !default;
$heading-l3-line-height: 1.9 !default;
$heading-l3-size: 1.79rem !default; // 25px
$heading-l4-letter-spacing: 0.59px !default;
$heading-l4-line-height: 2.14 !default;
$heading-l4-size: 2.23rem !default; // 31.25px
$heading-l5-letter-spacing: 0.79px !default;
$heading-l5-line-height: 2.4 !default;
$heading-l5-size: 2.79rem !default; // 39px
$heading-l6-letter-spacing: 1.05px !default;
$heading-l6-line-height: 2.7 !default;
$heading-l6-size: 3.49rem !default; // 48.80px

$shadow-xs-x: 0rem !default; // 0px
$shadow-xs-y: 0.14rem !default; // 2px
$shadow-xs-blur: 0.14rem !default; // 2px
$shadow-xs-spread: 0rem !default; // 0px
$shadow-sm-x: 0rem !default; // 0px
$shadow-sm-y: 0.23rem !default; // 3.24px
$shadow-sm-blur: 0.27rem !default; // 3.75px
$shadow-sm-spread: 0rem !default; // 0px
$shadow-md-x: 0rem !default; // 0px
$shadow-md-y: 0.37rem !default; // 5.24px
$shadow-md-blur: 0.39rem !default; // 5.50px
$shadow-md-spread: 0rem !default; // 0px
$shadow-lg-x: 0rem !default; // 0px
$shadow-lg-y: 0.61rem !default; // 8.47px
$shadow-lg-blur: 0.52rem !default; // 7.25px
$shadow-lg-spread: 0rem !default; // 0px
$shadow-xl-x: 0rem !default; // 0px
$shadow-xl-y: 0.98rem !default; // 13.71px
$shadow-xl-blur: 0.64rem !default; // 9px
$shadow-xl-spread: 0rem !default; // 0px

$spacing-xs: 0.31rem !default; // 4.38px
$spacing-sm: 0.63rem !default; // 8.75px
$spacing-df: 1.25rem !default; // 17.50px
$spacing-md: 2.5rem !default; // 35px
$spacing-lg: 3.75rem !default; // 52.50px
$spacing-xl: 5rem !default; // 70px
$spacing-unit: 17.5 !default;

$text-sm-line-height: 1.25 !default;
$text-sm-size: 0.89rem !default; // 12.45px
$text-df-line-height: 1.25 !default;
$text-df-size: 1rem !default; // 14px
$text-lg-line-height: 1.25 !default;
$text-lg-size: 1.13rem !default; // 15.75px

$typography-font-heading: 'Roboto' !default;
$typography-font-monospace: '"Lucida Console", Monaco, monospace' !default;
$typography-font-text: 'Roboto' !default;
$typography-font-system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' !default;
$typography-root-line-height: 1.25 !default;
$typography-root-text-size: 14px !default;
```

While the compiled theme files look loosely like the below (removed some repetition for brevity).

```scss
@import '..';

$palette-brand-color-00: #eceff1 !default;
$palette-brand-color-10: #cfd8dc !default;
$palette-brand-color-20: #b0bec5 !default;
$palette-brand-color-30: #90a4ae !default;
$palette-brand-color-40: #78909c !default;
$palette-brand-color-50: #607d8b !default;
$palette-brand-color-60: #546e7a !default;
$palette-brand-color-70: #455a64 !default;
$palette-brand-color-80: #37474f !default;
$palette-brand-color-90: #263238 !default;
$palette-brand-bg-base: #78909c !default;
$palette-brand-bg-disabled: #90a4ae !default;
$palette-brand-bg-focused: #607d8b !default;
$palette-brand-bg-hovered: #546e7a !default;
$palette-brand-bg-selected: #607d8b !default;
$palette-brand-fg-base: #546e7a !default;
$palette-brand-fg-disabled: #607d8b !default;
$palette-brand-fg-focused: #455a64 !default;
$palette-brand-fg-hovered: #37474f !default;
$palette-brand-fg-selected: #455a64 !default;

// $palette-primary-...
// $palette-secondary-...
// $palette-tertiary-...
// $palette-neutral-...
// $palette-muted-...
// $palette-danger-...
// $palette-warning-...
// $palette-success-...
// $palette-info-...
```

## Mixins

Coming soon...

## Integration

The compiled SCSS variables and mixins can be imported with the
[@use](https://sass-lang.com/documentation/at-rules/use) at-rule. Only the theme files need to be
imported, as the design system file is pre-imported within each theme.

Begin by importing the theme into scope using a namespace.

```scss
@use "styles/<target>/themes/day" as token;

.button {
  font-size: token.$text-df-size;
}
```

While namespacing is great to avoid collision, it can be a bit verbose. If you prefer to import into
the global scope, use `*`.

```scss
@use "styles/<target>/themes/day" as *;

.button {
  font-size: $text-df-size;
}
```

Tokens support [!default](https://sass-lang.com/documentation/variables) so that their value may be
customized during import -- outside the context of the compiler. This is useful for migration
purposes, but we suggest the patterns above and using the variables as-is.

```scss
@use "styles/<target>/themes/day" with (
  $text-df-size: 16px,
);
```

## Usage

We can utilize the compiled SCSS variables for reusability.

```scss
.button {
  display: inline-block;
  text-align: center;
  font-size: $text-df-size;
  line-height: $text-df-line-height;
  padding: $spacing-sm $spacing-df;
  color: $palette-neutral-color-00;
  background-color: $palette-brand-bg-base;

  &:hover {
    background-color: $palette-brand-bg-hovered;
  }
}
```

And apply the classes to HTML as normal.

```html
<button type="button" class="button">Continue</button>
```
