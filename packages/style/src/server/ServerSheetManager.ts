/* eslint-disable no-magic-numbers */

import { CSS } from '@aesthetic/types';
import { arrayLoop } from '@aesthetic/utils';
import sortMediaQueries from 'sort-css-media-queries';
import { MEDIA_RULE, SUPPORTS_RULE } from '../constants';
import { isMediaRule, isSupportsRule } from '../helpers';
import SheetManager from '../SheetManager';
import { Condition, StyleRule } from '../types';

function extractQueryAndType(condition: Condition) {
  if (isMediaRule(condition)) {
    return {
      query: condition.slice(6).trim(),
      type: MEDIA_RULE,
    };
  }

  return {
    query: condition.slice(9).trim(),
    type: SUPPORTS_RULE,
  };
}

export default class ServerSheetManager extends SheetManager {
  protected featureQueries: Record<string, StyleRule> = {};

  protected mediaQueries: Record<string, StyleRule> = {};

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
  insertConditionRule(rule: CSS, conditions: Condition[]): number {
    let parent: StyleRule = this.getSheet('conditions');

    arrayLoop(conditions, (condition) => {
      const { query, type } = extractQueryAndType(condition);
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

  /**
   * Insert an `@supports` rule into the root for the defined query.
   */
  insertFeatureRule(query: string, rule: CSS, parentRule?: StyleRule): number {
    const formattedRule = isSupportsRule(rule) ? rule : `@supports ${query} { ${rule} }`;

    // Already exists so append a new rule
    if (parentRule) {
      return parentRule.insertRule(formattedRule, parentRule.cssRules.length);
    }

    // Insert the rule and capture the instance
    const index = this.enqueueRule('conditions', formattedRule);

    this.featureQueries[query] = this.getSheet('conditions').cssRules[index];

    return index;
  }

  /**
   * Insert a `@media` rule for into the root for the defined query,
   * while keeping a mobile/desktop-first sort order.
   */
  insertMediaRule(query: string, rule: CSS, parentRule?: StyleRule): number {
    const formattedRule = isMediaRule(rule) ? rule : `@media ${query} { ${rule} }`;
    const sheet = this.getSheet('conditions');

    // Already exists so append a new rule (except for root sorting)
    if (parentRule && parentRule !== sheet) {
      return parentRule.insertRule(formattedRule, parentRule.cssRules.length);
    }

    // Sort and determine the index in which to insert a new query
    const sortedQueries = Object.keys(this.mediaQueries).concat(query).sort(sortMediaQueries);
    const index = sortedQueries.indexOf(query);

    // NOTE: We must inject instead of enqueue, otherwise the sort order is ruined!
    this.injectRule('conditions', formattedRule, index);

    this.mediaQueries[query] = sheet.cssRules[index];

    return index;
  }
}
