import hash from 'string-hash';
import { isObject } from 'aesthetic-utils';
import { hyphenateProperty } from 'css-in-js-utils';
import AtomicCache from './AtomicCache';
import { ClassName, Properties, StyleParams, Property, Value, FontFace, Keyframes } from './types';
import getDocumentStyleSheet from './getDocumentStyleSheet';
import isMediaQueryCondition from './isMediaQueryCondition';
import isSupportsCondition from './isSupportsCondition';
import isNestedSelector from './isNestedSelector';
import quoteString from './quoteString';

export default class Renderer {
  protected atRuleCache = new Set();

  protected classNameCache = new AtomicCache();

  protected keyframesIndex = 0;

  constructor() {
    // Create the elements in a strict order
    getDocumentStyleSheet('global');
    getDocumentStyleSheet('low-pri');
    getDocumentStyleSheet('high-pri');
  }

  render(properties: Properties, params: StyleParams): ClassName {
    return Object.entries(properties)
      .map(([key, value]) => {
        if (value === null || value === undefined) {
          return '';
        }

        if (isObject(value)) {
          if (isMediaQueryCondition(key) || isSupportsCondition(key)) {
            return this.render(value, { ...params, condition: key });
          } else if (isNestedSelector(key)) {
            return this.render(value, { ...params, selector: key });
          } else if (__DEV__) {
            console.warn(`Unknown property "${key}" with value "${value}".`);
          }

          return '';
        }

        return this.renderDeclaration(key as Property, value, params);
      })
      .join(' ');
  }

  renderDeclaration<K extends Property>(property: K, value: Properties[K], params: StyleParams) {
    const key = hyphenateProperty(property);
    const item = this.classNameCache.read(key, value, params);

    if (item) {
      return item.className;
    }

    const sheet = getDocumentStyleSheet(params.type);
    const rank = sheet.cssRules.length;
    const className = this.createUniqueHash(property, value, params);

    sheet.insertRule(this.createRule(className, key, value, params), rank);

    this.classNameCache.write(key, value, {
      condition: '',
      selector: '',
      type: 'low-pri',
      ...params,
      className,
      rank,
    });

    return className;
  }

  renderFontFace(fontFace: FontFace): string {
    if (__DEV__) {
      if (!fontFace.fontFamily) {
        throw new Error('TODO');
      }
    }

    const fontFamily = fontFace.fontFamily
      .split(',')
      .map(family => quoteString(family.trim()))
      .join(', ');

    // Format font family so its deterministic
    fontFace.fontFamily = fontFamily;

    this.injectAtRule(`@font-face { ${this.createDeclarationBlock(fontFace)} }`);

    return fontFamily;
  }

  renderKeyframes(keyframes: Keyframes, name: string = ''): string {
    const animationName = name || `k${(this.keyframesIndex += 1)}`;
    const frames = Object.entries(keyframes)
      .map(([frame, props]) => `${frame} { ${this.createDeclarationBlock(props)} }`)
      .join(' ');

    this.injectAtRule(`@keyframes ${animationName} { ${frames} }`);

    return animationName;
  }

  protected createDeclaration(property: string, value: Value): string {
    return `${property}: ${value}`;
  }

  protected createDeclarationBlock(properties: Properties): string {
    return Object.entries(properties)
      .map(([prop, value]) => this.createDeclaration(prop, value))
      .join(';');
  }

  protected createRule(
    className: ClassName,
    property: string,
    value: Value,
    params: StyleParams,
  ): string {
    let rule = `.${className}`;

    if (params.selector) {
      rule += params.selector;
    }

    rule += `{ ${this.createDeclaration(property, value)} }`;

    if (params.condition) {
      rule = `${params.condition} { ${rule} }`;
    }

    return rule;
  }

  protected createUniqueHash(property: string, value: Value, params: StyleParams): string {
    return hash(`${params.condition || ''}${params.selector || ''}${property}${value}`);
  }

  protected injectAtRule(rule: string): string {
    const cacheKey = hash(rule);

    if (this.atRuleCache.has(cacheKey)) {
      return cacheKey;
    }

    const sheet = getDocumentStyleSheet('global');

    sheet.insertRule(rule, sheet.cssRules.length);

    this.atRuleCache.add(cacheKey);

    return cacheKey;
  }
}
