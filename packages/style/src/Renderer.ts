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
   * Render an object of property value pairs into the defined style sheet as multiple class names,
   * with each declaration resulting in a unique class name.
   */
  renderRule = (properties: Rule, options: RenderOptions = {}): ClassName => {
    return this.processRule(properties, options, this.renderRule, true);
  };

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

  /**
   * Process a rule block with the defined options and processors.
   */
  protected processRule(
    rule: Rule,
    options: RenderOptions,
    onNestedRule: (properties: Rule, options: RenderOptions) => ClassName,
    processProperty: boolean = false,
  ) {
    const classNames = new Set<string>();

    objectLoop<Rule, Property>(rule, (value, prop) => {
      // Skip invalid values
      if (isInvalidValue(value)) {
        if (__DEV__) {
          console.warn(`Invalid value "${value}" for property "${prop}".`);
        }

        // Handle nested selectors and objects
      } else if (isObject<Rule>(value)) {
        const { conditions = [] } = options;

        // Media condition
        if (isMediaRule(prop)) {
          conditions.push(prop);
          classNames.add(onNestedRule(value, { ...options, conditions }));

          // Supports condition
        } else if (isSupportsRule(prop)) {
          conditions.push(prop);
          classNames.add(onNestedRule(value, { ...options, conditions }));

          // Selectors
        } else if (isNestedSelector(prop)) {
          classNames.add(onNestedRule(value, { ...options, selector: prop }));

          // Unknown
        } else if (__DEV__) {
          console.warn(`Unknown property selector or nested block "${prop}".`);
        }

        // CSS variables
      } else if (isVariable(prop)) {
        classNames.add(this.renderVariable(prop, value!, options));

        // Property value pair
      } else if (processProperty) {
        classNames.add(this.renderDeclaration(prop, value, options));
      }
    });

    return Array.from(classNames).join(' ');
  }
}
