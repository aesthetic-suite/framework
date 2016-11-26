/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';

export type CSSStyle = { [key: string]: string | number | boolean | CSSStyle | CSSStyle[] };

export type StyleDeclaration = string | CSSStyle;

export type StyleDeclarationMap = string | { [key: string]: StyleDeclaration };

export type ClassNameMap = { [key: string]: string };

export type WrappedComponent = React.Component<*, *, *>;

export type HOCComponent = React.Component<*, *, *>;

export type HOCOptions = {
  styleName?: string,
  stylesPropName?: string,
  themePropName?: string,
  allowStyling?: boolean,
  clearOnUnmount?: boolean,
};
