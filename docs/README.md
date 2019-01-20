# Aesthetic

Aesthetic is a powerful type-safe React library for styling components, whether it be CSS-in-JS
using style objects, importing stylesheets, or simply referencing external class names. Simply put,
Aesthetic is an abstraction layer that utilizes higher-order-components for the compilation of
styles via third-party libraries, all the while providing customizability, theming, and a unified
syntax.

Aesthetic was built for the sole purpose of solving the following scenarios, most of which competing
styling libraries fail to solve.

**Multiple styling patterns**

Want to use external CSS or Sass files? Or maybe CSS modules? Or perhaps CSS-in-JS? What about JSS
instead of Aphrodite? All of these patterns and choices are supported through the use of
[adapters](./adapters/README.md). However, inline styles _are not supported_ as we prefer the more
performant option of compiling styles and attaching them to the DOM.

**Styling third-party libraries**

Using a third-party provided UI component library has the unintended side-effect of hard-coded and
non-customizable styles, and unwanted files within your bundle. Aesthetic solves this by allowing
consumers to [extend and inherit styles](./usage.md) from the provided base component.

```tsx
import React from 'react';
import withStyles, { WithStylesProps, css } from '../path/to/aesthetic';

type Props = {
  children: NonNullable<React.ReactNode>;
};

class Carousel extends React.Component<Props & WithStylesProps> {
  // ...

  render() {
    const { children, styles } = this.props;
    const { animating } = this.state;

    return (
      <div role="tablist" className={css(styles.carousel, animating && styles.carousel__animating)}>
        <ul className={css(styles.list)}>{children}</ul>

        <button type="button" onClick={this.handlePrev} className={css(styles.button, styles.prev)}>
          ←
        </button>

        <button type="button" onClick={this.handleNext} className={css(styles.button, styles.next)}>
          →
        </button>
      </div>
    );
  }
}

export default withStyles(theme => ({
  carousel: {
    position: 'relative',
    maxWidth: '100%',
    padding: theme.unit,
    // ...
  },
  carousel__animating: {},
  list: {},
  button: {},
  prev: {},
  next: {},
}))(Carousel);
```
