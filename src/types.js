/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable */

export type PrimitiveType = string | number | boolean;

export type CSSStyleValue = PrimitiveType | CSSStyle;

export type CSSStyle = { [propName: string]: CSSStyleValue | CSSStyleValue[] };

export type AtRuleMap = { [ruleName: string]: CSSStyle };

export type AtRuleSet = { [setName: string]: AtRuleMap };

export type AtRuleCache = { [ruleName: string]: string };

export type StyleDeclaration = string | CSSStyle;

export type StyleDeclarationMap = { [setName: string]: StyleDeclaration };

export type StyleCallback = (theme: CSSStyle, prevStyles: StyleDeclarationMap) => StyleDeclarationMap;

export type StyleDeclarationOrCallback = StyleDeclarationMap | StyleCallback;

export type MaybeClassName = string | number | { [key: string]: boolean } | MaybeClassName[];

export type ClassNameMap = { [setName: string]: string };

export type WrappedComponent = ReactClass<*>;

export type HOCComponent = ReactClass<*>;

export type HOCOptions = {
 extendable?: boolean,
 extendFrom?: string,
 styleName?: string,
 classNamesPropName?: string,
 themePropName?: string,
};

export type EventCallback = (() => void) |
 ((setName: string, properties: CSSStyle) => void) |
 ((setName: string, atRuleName: string, properties: CSSStyle) => void);

export type FallbackMap = { [setName: string]: CSSStyle };
