/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable */

import React from 'react';

export type PrimitiveType = string | number | boolean;

export type CSSStyleValue = PrimitiveType | PrimitiveType[] | CSSStyle;

export type CSSStyle = { [propName: string]: CSSStyleValue };

export type AtRules = { [setName: string]: CSSStyle };

export type StyleDeclaration = string | CSSStyle;

export type StyleDeclarations = { [setName: string]: StyleDeclaration };

export type StyleOrCallback = StyleDeclarations | ThemeCallback;

export type ThemeCallback = (theme: CSSStyle, prevStyles: StyleDeclarations) => StyleDeclarations;

export type MaybeClassName = string | number | { [key: string]: boolean } | MaybeClassName[];

export type ClassNames = { [setName: string]: string };

export type WrappedComponent = ReactClass<*>;

export type HOCComponent = ReactClass<*>;

export type HOCOptions = {
  lockStyling?: boolean,
  styleName?: string,
  classNamesPropName?: string,
  themePropName?: string,
};
