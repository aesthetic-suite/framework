import React from 'react';
import ClassNameAesthetic from '../src/ClassNameAesthetic';
import { WithStylesProps } from '../src/withStyles';
import { ComponentRuleset } from '../src/types';

type Theme = {
  unit: number;
};

type Props = {
  foo: string;
  bar?: number;
};

const aesthetic = new ClassNameAesthetic<Theme>();

const Comp: React.SFC<Props & WithStylesProps<Theme, string>> = props => {
  return <div className={aesthetic.transformStyles(props.styles.button)} />;
};

const ruleset: ComponentRuleset = {
  display: 'block',
  backgroundColor: 'white',
  invalid: 'property',

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

<NullStyles foo="foo" themeName="default" />;
<NullStyles foo="foo" bar={123} />;
<NullStyles foo="foo" wrappedRef={() => {}} />;

// INVALID
const ObjectStyles = aesthetic.withStyles(
  {
    button: {
      color: 'red',
      invalid: 'property',
    },
  },
  {
    // invalid: 'option',
  },
)(Comp);

<ObjectStyles foo={123} />;
<ObjectStyles foo="foo" bar="bar" />;
<ObjectStyles foo="foo" themeName={123} />;
<ObjectStyles foo="foo" wrappedRef={true} />;
<ObjectStyles foo="foo" unknown={123} />;
<ObjectStyles foo="foo" styles={{}} />;
<ObjectStyles foo="foo" theme={{}} />;

const FuncStyles = aesthetic.withStyles<Props>((theme, { foo, baz }) => {
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
const ExtendedStyles = NullStyles.extendStyles({
  button: {
    color: 'blue',
  },
});

<ExtendedStyles foo="foo" />;
<ExtendedStyles foo={123} />;

ExtendedStyles.displayName;
ExtendedStyles.styleName;
ExtendedStyles.WrappedComponent;
