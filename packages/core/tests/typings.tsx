/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import ClassNameAesthetic from '../src/ClassNameAesthetic';
import { ComponentBlock, WithStylesProps } from '../src/types';

type Theme = {
  unit: number;
  color: string;
};

type Props = {
  foo: string;
  bar?: number;
};

const aesthetic = new ClassNameAesthetic<Theme>();

aesthetic.registerTheme('default', {
  unit: 8,
  color: 'black',
});

aesthetic.extendTheme('classic', 'default', {
  color: 'white',
});

const Comp: React.SFC<Props & WithStylesProps<Theme, string>> = props => {
  return <div className={aesthetic.transformStyles(props.styles.button)} />;
};

const ruleset: ComponentBlock = {
  display: 'block',
  backgroundColor: 'white',
  invalid: 'property',

  animationName: {
    from: { color: 'red' },
    to: { color: 'blue' },
  },

  ':hover': {
    color: 'red',

    '[disabled]': {
      color: 'black',
    },
  },

  '[disabled]': {
    color: 'gray',
  },

  '@media': {
    '(max-width: 300)': {
      display: 'inline',

      ':hover': {
        color: 'blue',
      },
    },
  },

  '@selectors': {
    '> [data-attr="foo"]': {
      position: 'absolute',
    },
  },

  '@supports': {
    '(display: flex)': {
      display: 'flex',
    },
  },

  '@fallbacks': {
    backgroundColor: ['black', 'white'],
  },
};

// VALID
const NullStyles = aesthetic.withStyles(null, {
  extendable: true,
})(Comp);

<NullStyles foo="foo" bar={123} />;
<NullStyles foo="foo" wrappedRef={() => {}} />;

// INVALID
const ObjectStyles = aesthetic.withStyles(
  () => ({
    button: {
      color: 'red',
      invalid: 'property',
    },
  }),
  {
    // invalid: 'option',
  },
)(Comp);

<ObjectStyles foo={123} />;
<ObjectStyles foo="foo" bar="bar" />;
<ObjectStyles foo="foo" wrappedRef={true} />;
<ObjectStyles foo="foo" unknown={123} />;
<ObjectStyles foo="foo" styles={{}} />;
<ObjectStyles foo="foo" theme={{}} />;

const FuncStyles = aesthetic.withStyles(theme => {
  const { unit, unknown } = theme;

  return {
    button: {
      display: 'block',
      xxx: 12345,
    },
  };
})(Comp);

<FuncStyles foo={123} />;

// EXTENDING
const ExtendedStyles = NullStyles.extendStyles(() => ({
  button: {
    color: 'blue',
  },
}));

<ExtendedStyles foo="foo" />;
<ExtendedStyles foo={123} />;

ExtendedStyles.displayName;
ExtendedStyles.WrappedComponent;

// PROP TYPES
function childrenOf<T>(...types: React.ComponentType<any>[]): PropTypes.Requireable<T> {
  return null;
}

childrenOf(Comp, NullStyles, ObjectStyles, FuncStyles, ExtendedStyles);
