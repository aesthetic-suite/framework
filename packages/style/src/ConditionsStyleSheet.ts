import { arrayLoop, isSSR } from '@aesthetic/utils';
import sortMediaQueries from 'sort-css-media-queries';
import BaseStyleSheet from './BaseStyleSheet';
import formatConditions from './helpers/formatConditions';
import isSupportsRule from './helpers/isSupportsRule';
import isMediaRule from './helpers/isMediaRule';
import { MEDIA_RULE } from './constants';
import { Condition, StyleRule } from './types';

let canInsert: boolean | null = null;

function canInsertNestedRules(): boolean {
  if (global.AESTHETIC_SSR_CLIENT) {
    return true;
  }

  if (canInsert === null) {
    canInsert =
      !isSSR() &&
      typeof window.CSSGroupingRule !== 'undefined' &&
      typeof CSSGroupingRule.prototype.insertRule !== 'undefined';
  }

  return canInsert;
}

export default class ConditionsStyleSheet extends BaseStyleSheet {
  desktopFirst: boolean = false;

  protected featureQueries: { [query: string]: StyleRule } = {};

  protected mediaQueries: { [query: string]: StyleRule } = {};

  /**
   * Attempt to find a child rule within the parent rule that matches the defined query and type.
   */
  findNestedRule(rule: StyleRule, query: string, type: number): StyleRule | null {
    for (let i = 0; i < rule.cssRules.length; i += 1) {
      const child = rule.cssRules[i];

      if (child && child.type === type && child.conditionText === query) {
        return child;
      }
    }

    return null;
  }

  /**
   * Recursively insert the rule based on the list of conditions.
   * If the browser does not support nested rule insertion,
   * simply insert it into the root of the style sheet.
   */
  insertRule(rule: string, conditions: Condition[]): number {
    if (canInsertNestedRules()) {
      let parent: StyleRule = this.sheet;

      arrayLoop(conditions, ({ query, type }) => {
        const instance = this.findNestedRule(parent, query, type);

        // Nested found, so continue without inserting a new rule
        if (instance) {
          parent = instance;

          return;
        }

        const index =
          type === MEDIA_RULE
            ? this.insertMediaRule(query, '', parent)
            : this.insertFeatureRule(query, '', parent);

        parent = parent.cssRules[index];
      });

      return parent.insertRule(rule, parent.cssRules.length);
    }

    const outerCondition = conditions[0];
    const finalRule = formatConditions(rule, conditions);

    return outerCondition.type === MEDIA_RULE
      ? this.insertMediaRule(outerCondition.query, finalRule)
      : this.insertFeatureRule(outerCondition.query, finalRule);
  }

  /**
   * Insert an `@supports` rule into the root for the defined query.
   */
  insertFeatureRule(query: string, rule: string, parentRule?: StyleRule): number {
    const formattedRule = isSupportsRule(rule) ? rule : `@supports ${query} { ${rule} }`;

    // Already exists so append a new rule
    if (canInsertNestedRules() && parentRule) {
      return parentRule.insertRule(formattedRule, parentRule.cssRules.length);
    }

    // Insert the rule and capture the instance
    const index = this.enqueueRule(formattedRule);

    this.featureQueries[query] = this.sheet.cssRules[index];

    return index;
  }

  /**
   * Insert a `@media` rule for into the root for the defined query,
   * while keeping a mobile/desktop-first sort order.
   */
  insertMediaRule(query: string, rule: string, parentRule?: StyleRule): number {
    const formattedRule = isMediaRule(rule) ? rule : `@media ${query} { ${rule} }`;

    // Already exists so append a new rule
    if (canInsertNestedRules() && parentRule) {
      return parentRule.insertRule(formattedRule, parentRule.cssRules.length);
    }

    // Sort and determine the index in which to insert a new query
    const sortedQueries = Object.keys(this.mediaQueries)
      .concat(query)
      .sort(this.desktopFirst ? sortMediaQueries.desktopFirst : sortMediaQueries);
    const index = sortedQueries.indexOf(query);

    // NOTE: We must inject instead of enqueue, otherwise the sort order is ruined!
    this.injectRule(formattedRule, index);

    this.mediaQueries[query] = this.sheet.cssRules[index];

    return index;
  }
}
