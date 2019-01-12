/* eslint-disable */

import React from 'react';
import ClassNameAesthetic from '../src/ClassNameAesthetic';
import { ComponentBlock, StyleSheet } from '../src/types';

type Theme = { unit: number };

const aesthetic = new ClassNameAesthetic<Theme>();

type Props = { foo?: string };

function Comp(props: Props) {
  return <div />;
}

// Direct object
const ruleset: ComponentBlock = {
  display: 'block',
  invalid: 'property',

  ':hover': {
    color: 'red',
  },

  '> invalid': {
    color: 'blue',
  },
};

const stylesheet: StyleSheet = {
  foo: {
    display: 'block',
    invalid: 'property',
  },
  bar: {
    another: 'invalid',
  },
  baz: 'direct-css-class-name',
};

// Styled component using arrow function
const CompA = aesthetic.withStyles(() => ({
  display: 'block',
  invalid: 'property',

  ':hover': {
    color: 'red',
  },
}))(Comp);

// Styled component using arrow function with body
const CompB = aesthetic.withStyles(() => {
  return {
    display: 'block',
    invalid: 'property',

    ':hover': {
      color: 'red',
    },
  };
})(Comp);

// Styled component using regular function
const CompC = aesthetic.withStyles(function() {
  return {
    display: 'block',
    invalid: 'property',

    ':hover': {
      color: 'red',
    },
  };
})(Comp);

// Styled component with no styles
const CompD = aesthetic.withStyles(null)(Comp);
