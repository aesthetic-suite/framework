# Aesthetic

Aesthetic is a powerful type-safe, framework agnostic, CSS-in-JS library for styling components,
whether it be with plain objects, importing style sheets, or simply referencing external class
names. Simply put, Aesthetic is an abstraction layer for the compilation of styles via third-party
libraries, all the while providing customizability, theming, and a unified syntax.

Aesthetic was built for the sole purpose of solving the following scenarios, most of which competing
styling libraries fail to solve.

**Framework agnostic integration**

Do you use React? Or Vue? Did you migrate between the two, or another framework? Aesthetic aims to
support all frameworks, so the same concepts and styling guarantees are provided throughout.

**Multiple styling patterns**

Want to use external CSS or Sass files? Or maybe CSS modules? Or perhaps CSS-in-JS? What about JSS
instead of Aphrodite? All of these patterns and choices are supported through the use of
[adapters](./adapters/README.md). However, inline styles _are not supported_ as we prefer the more
performant option of compiling styles and attaching them to the DOM.

**Styling third-party libraries**

Using a third-party provided UI component library has the unintended side-effect of hard-coded and
non-customizable styles, and unwanted files within your bundle. Aesthetic solves this by allowing
consumers to [extend and inherit styles](./style.md#extending-styles) from the provided base
component.

```tsx
import React from 'react';
import { withStyles, WithStylesWrappedProps } from 'aesthetic-react';
import { Theme } from './types';

export type Props = {
  children: NonNullable<React.ReactNode>;
};

export type State = {
  animating: boolean;
};

class Carousel extends React.Component<Props & WithStylesWrappedProps<Theme>, State> {
  // ...

  render() {
    const { children, cx, styles } = this.props;
    const { animating } = this.state;

    return (
      <div role="tablist" className={cx(styles.carousel, animating && styles.carousel__animating)}>
        <ul className={cx(styles.list)}>{children}</ul>

        <button type="button" onClick={this.handlePrev} className={cx(styles.button, styles.prev)}>
          ←
        </button>

        <button type="button" onClick={this.handleNext} className={cx(styles.button, styles.next)}>
          →
        </button>
      </div>
    );
  }
}

export default withStyles<Theme>(theme => ({
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
