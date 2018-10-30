import React from 'react';
import Aesthetic from '../src/Aesthetic';
import ClassNameAdapter from '../src/ClassNameAdapter';
import { WithStylesProps } from '../src/withStyles';
import { ComponentRuleset } from '../src/types';

type Theme = {
  unit: number;
};

type Props = { foo: string; bar?: number };

const aesthetic = new Aesthetic<Theme, string, string>(new ClassNameAdapter());

const Comp: React.SFC<Props & WithStylesProps<Theme, string>> = props => {
  return <div className={aesthetic.transformStyles(props.styles.button)} />;
};

const ruleset: ComponentRuleset = {
  display: 'block',
  backgroundColor: 'white',

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

const NullStyles = aesthetic.withStyles(null)(Comp);

<NullStyles foo="foo" />;

const ObjectStyles = aesthetic.withStyles({
  button: {
    color: 'red',
    xxx: 123,
  },
})(Comp);

<ObjectStyles foo={123} />;

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
