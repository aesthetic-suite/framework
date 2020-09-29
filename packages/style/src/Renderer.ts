/* eslint-disable no-console */

import { ClassName, Property, GenericProperties, Variables, Rule } from '@aesthetic/types';
import { isObject, objectLoop } from '@aesthetic/utils';
import isMediaRule from './helpers/isMediaRule';
import isSupportsRule from './helpers/isSupportsRule';
import isNestedSelector from './helpers/isNestedSelector';
import isInvalidValue from './helpers/isInvalidValue';
import isVariable from './helpers/isVariable';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      AESTHETIC_CUSTOM_RENDERER?: Renderer;
    }
  }
}

export default abstract class Renderer {
  /**
   * Render an object of property value pairs into the defined style sheet as a single class name,
   * with all properties grouped within.
   */
  renderRuleGrouped = (properties: Rule, options: RenderOptions = {}): ClassName => {
    const nestedRules: Record<string, Rule> = {};
    const cssVariables: Variables = {};
    const nextProperties: GenericProperties = {};

    // Extract all nested rules first as we need to process them *after* properties
    objectLoop<Rule, Property>(properties, (value, prop) => {
      if (isInvalidValue(value)) {
        // Skip
      } else if (isObject<Rule>(value)) {
        nestedRules[prop] = value;
      } else if (isVariable(prop)) {
        cssVariables[prop] = value!;
      } else {
        nextProperties[prop] = value!;
      }
    });

    // Always use deterministic classes for grouped rules so we avoid subsequent renders
    options.deterministic = true;

    // Insert rule styles only once
    const { className } = this.doRender(nextProperties, cssVariables, options);

    // Render all nested rules with the parent class name
    this.processRule(nestedRules, { ...options, className }, this.renderRuleGrouped);

    return className;
  };
}
