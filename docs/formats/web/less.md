# Less format

The following format is provided when [compiling design tokens](../../compile-tokens.md) to
[Less](http://lesscss.org/).

## File structure

During compilation, an `index.less` file will be created based on the design system YAML
configuration file. Additional `themes/<name>.less` files will be created for each theme configured
in the YAML file. And lastly, a `mixins.less` file will also be created.

This would look something like the following:

```
styles/<target>/
├── themes/
│   ├── day.less
│   └── night.less
├── index.less
└── mixins.less
```

## Tokens

As mentioned above, a design system and multiple theme files are created. The design system file
defines [aspect tokens](../../create-system.md#aspects), while each theme file defines
[color and palette tokens](#todo), both of which rely on Less variables.

The compiled design system file looks something like the following:

```less
@border-sm-radius: 0.11rem; // 1.50px
@border-sm-width: 0rem; // 0px
@border-df-radius: 0.21rem; // 3px
@border-df-width: 0.07rem; // 1px
@border-lg-radius: 0.32rem; // 4.50px
@border-lg-width: 0.14rem; // 2px

@breakpoint-xs-query: '(min-width: 45.71em)';
@breakpoint-xs-query-size: 640;
@breakpoint-xs-root-line-height: 1.33;
@breakpoint-xs-root-text-size: 14.94px;
@breakpoint-sm-query: '(min-width: 68.57em)';
@breakpoint-sm-query-size: 960;
@breakpoint-sm-root-line-height: 1.42;
@breakpoint-sm-root-text-size: 15.94px;
@breakpoint-md-query: '(min-width: 91.43em)';
@breakpoint-md-query-size: 1280;
@breakpoint-md-root-line-height: 1.52;
@breakpoint-md-root-text-size: 17.01px;
@breakpoint-lg-query: '(min-width: 114.29em)';
@breakpoint-lg-query-size: 1600;
@breakpoint-lg-root-line-height: 1.62;
@breakpoint-lg-root-text-size: 18.15px;
@breakpoint-xl-query: '(min-width: 137.14em)';
@breakpoint-xl-query-size: 1920;
@breakpoint-xl-root-line-height: 1.73;
@breakpoint-xl-root-text-size: 19.36px;

@depth-content: 100;
@depth-navigation: 1000;
@depth-sheet: 1100;
@depth-overlay: 1200;
@depth-modal: 1300;
@depth-toast: 1400;
@depth-dialog: 1500;
@depth-menu: 1600;
@depth-tooltip: 1700;

@heading-l1-letter-spacing: 0.25px;
@heading-l1-line-height: 1.5;
@heading-l1-size: 1.14rem; // 16px
@heading-l2-letter-spacing: 0.33px;
@heading-l2-line-height: 1.69;
@heading-l2-size: 1.43rem; // 20px
@heading-l3-letter-spacing: 0.44px;
@heading-l3-line-height: 1.9;
@heading-l3-size: 1.79rem; // 25px
@heading-l4-letter-spacing: 0.59px;
@heading-l4-line-height: 2.14;
@heading-l4-size: 2.23rem; // 31.25px
@heading-l5-letter-spacing: 0.79px;
@heading-l5-line-height: 2.4;
@heading-l5-size: 2.79rem; // 39px
@heading-l6-letter-spacing: 1.05px;
@heading-l6-line-height: 2.7;
@heading-l6-size: 3.49rem; // 48.80px

@shadow-xs-x: 0rem; // 0px
@shadow-xs-y: 0.14rem; // 2px
@shadow-xs-blur: 0.14rem; // 2px
@shadow-xs-spread: 0rem; // 0px
@shadow-sm-x: 0rem; // 0px
@shadow-sm-y: 0.23rem; // 3.24px
@shadow-sm-blur: 0.27rem; // 3.75px
@shadow-sm-spread: 0rem; // 0px
@shadow-md-x: 0rem; // 0px
@shadow-md-y: 0.37rem; // 5.24px
@shadow-md-blur: 0.39rem; // 5.50px
@shadow-md-spread: 0rem; // 0px
@shadow-lg-x: 0rem; // 0px
@shadow-lg-y: 0.61rem; // 8.47px
@shadow-lg-blur: 0.52rem; // 7.25px
@shadow-lg-spread: 0rem; // 0px
@shadow-xl-x: 0rem; // 0px
@shadow-xl-y: 0.98rem; // 13.71px
@shadow-xl-blur: 0.64rem; // 9px
@shadow-xl-spread: 0rem; // 0px

@spacing-xs: 0.31rem; // 4.38px
@spacing-sm: 0.63rem; // 8.75px
@spacing-df: 1.25rem; // 17.50px
@spacing-md: 2.5rem; // 35px
@spacing-lg: 3.75rem; // 52.50px
@spacing-xl: 5rem; // 70px
@spacing-unit: 17.5;

@text-sm-line-height: 1.25;
@text-sm-size: 0.89rem; // 12.45px
@text-df-line-height: 1.25;
@text-df-size: 1rem; // 14px
@text-lg-line-height: 1.25;
@text-lg-size: 1.13rem; // 15.75px

@typography-font-heading: 'Roboto';
@typography-font-monospace: '"Lucida Console", Monaco, monospace';
@typography-font-text: 'Roboto';
@typography-font-system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
@typography-root-line-height: 1.25;
@typography-root-text-size: 14px;
```

While the compiled theme files look loosely like the below (removed some repetition for brevity).

```less
@import '..';

@palette-brand-color-00: #eceff1;
@palette-brand-color-10: #cfd8dc;
@palette-brand-color-20: #b0bec5;
@palette-brand-color-30: #90a4ae;
@palette-brand-color-40: #78909c;
@palette-brand-color-50: #607d8b;
@palette-brand-color-60: #546e7a;
@palette-brand-color-70: #455a64;
@palette-brand-color-80: #37474f;
@palette-brand-color-90: #263238;
@palette-brand-bg-base: #78909c;
@palette-brand-bg-disabled: #90a4ae;
@palette-brand-bg-focused: #607d8b;
@palette-brand-bg-hovered: #546e7a;
@palette-brand-bg-selected: #607d8b;
@palette-brand-fg-base: #546e7a;
@palette-brand-fg-disabled: #607d8b;
@palette-brand-fg-focused: #455a64;
@palette-brand-fg-hovered: #37474f;
@palette-brand-fg-selected: #455a64;

// @palette-primary-...
// @palette-secondary-...
// @palette-tertiary-...
// @palette-neutral-...
// @palette-muted-...
// @palette-danger-...
// @palette-warning-...
// @palette-success-...
// @palette-info-...
```

## Mixins

TODO

## Integration

The compiled Less variables and mixins can be imported with the
[@import](http://lesscss.org/features/#import-atrules-feature) at-rule. Only the theme files need to
be imported, as the design system file is pre-imported within each theme.

```less
@import (once, reference) 'styles/<target>/themes/day.less';

.button {
  font-size: @text-df-size;
}
```

## Usage

We can utilize the compiled Less variables for reusability.

```less
.button {
  display: inline-block;
  text-align: center;
  font-size: @text-df-size;
  line-height: @text-df-line-height;
  padding: @spacing-sm @spacing-df;
  color: @palette-neutral-color-00;
  background-color: @palette-brand-bg-base;

  &:hover {
    background-color: @palette-brand-bg-hovered;
  }
}
```

And apply the classes to HTML as normal.

```html
<button type="button" class="button">Continue</button>
```
