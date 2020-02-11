import hash from 'string-hash';
import { isObject } from 'aesthetic-utils';
import { hyphenateProperty } from 'css-in-js-utils';
import AtomicCache from './AtomicCache';
import { ClassName, Properties, StyleParams, Property, Value } from './types';
import getDocumentStyleSheet from './getDocumentStyleSheet';
import isMediaQueryCondition from './isMediaQueryCondition';
import isSupportsCondition from './isSupportsCondition';
import isNestedSelector from './isNestedSelector';

export default class Renderer {
  protected atRuleCache = new Map();

  protected classNameCache = new AtomicCache();

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

  renderFontFace() {}

  renderKeyframes() {}

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
}
