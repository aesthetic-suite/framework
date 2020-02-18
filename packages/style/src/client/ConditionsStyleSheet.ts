import sortMediaQueries from 'sort-css-media-queries';
import BaseStyleSheet from './BaseStyleSheet';
import isSupportsCondition from '../helpers/isSupportsCondition';
import isMediaQueryCondition from '../helpers/isMediaQueryCondition';
import { Condition } from '../types';

const canInsertNestedRules =
  window.CSSGroupingRule !== undefined && CSSGroupingRule.prototype.insertRule !== undefined;

export default class ConditionsStyleSheet extends BaseStyleSheet {
  protected desktopFirst: boolean;

  protected featureQueries: { [query: string]: CSSSupportsRule } = {};

  protected mediaQueries: { [query: string]: CSSMediaRule } = {};

  constructor(desktopFirst: boolean = false) {
    super('conditions');

    this.desktopFirst = desktopFirst;
  }

  /**
   * Attempt to find a child rule within the parent rule that matches the defined query and type.
   */
  // istanbul ignore next
  findNestedRule(rule: CSSConditionRule, query: string, type: number): CSSConditionRule | null {
    for (let i = 0; i < rule.cssRules.length; i += 1) {
      const child = rule.cssRules[i] as CSSConditionRule | null;

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
  insertRule(conditions: Condition[], rule: string): number {
    const size = conditions.length;

    if (!canInsertNestedRules || size === 1) {
      const outerCondition = conditions[0];
      const finalRule = conditions
        .reverse()
        .reduce(
          (tempRule, condition) =>
            `@${condition.type === CSSRule.MEDIA_RULE ? 'media' : 'supports'} ${
              condition.query
            } { ${tempRule} }`,
          rule,
        );

      if (outerCondition.type === CSSRule.MEDIA_RULE) {
        this.insertMediaRule(outerCondition.query, finalRule);
      } else {
        this.insertFeatureRule(outerCondition.query, finalRule);
      }

      return -1;
    }

    let instance: CSSConditionRule | null = null;

    // istanbul ignore next
    for (let i = 0; i < size; i += 1) {
      const { query, type } = conditions[i];
      const bodyContent = i === size - 1 ? rule : '';

      // Insert a new condition at the root
      if (i === 0) {
        instance =
          type === CSSRule.MEDIA_RULE
            ? this.insertMediaRule(query, bodyContent)
            : this.insertFeatureRule(query, bodyContent);

        // Recursively insert nested rules
      } else if (instance) {
        instance = this.findNestedRule(instance, query, type) || instance;

        // Insert the rule and return a new instance
        instance = instance.cssRules[
          instance.insertRule(bodyContent, instance.cssRules.length)
        ] as CSSConditionRule;
      }
    }

    return -1;
  }

  /**
   * Insert an `@supports` rule into the root for the defined query.
   */
  insertFeatureRule(query: string, rule: string): CSSSupportsRule {
    const featureRule = this.featureQueries[query];

    // Already exists so append a new rule
    // istanbul ignore next
    if (canInsertNestedRules && featureRule) {
      const index = featureRule.insertRule(rule, featureRule.cssRules.length);

      return featureRule.cssRules[index] as CSSSupportsRule;
    }

    // Insert the rule and capture the instance
    const index = this.sheet.insertRule(
      isSupportsCondition(rule) ? rule : `@supports ${query} { ${rule} }`,
      this.sheet.cssRules.length,
    );

    this.featureQueries[query] = this.sheet.cssRules[index] as CSSSupportsRule;

    return this.featureQueries[query];
  }

  /**
   * Insert a `@media` rule for into the root for the defined query,
   * while keeping a mobile/desktop-first sort order.
   */
  insertMediaRule(query: string, rule: string): CSSMediaRule {
    const mediaRule = this.mediaQueries[query];

    // Already exists so append a new rule
    // istanbul ignore next
    if (canInsertNestedRules && mediaRule) {
      const index = mediaRule.insertRule(rule, mediaRule.cssRules.length);

      return mediaRule.cssRules[index] as CSSMediaRule;
    }

    // Sort and determine the index in which to insert a new query
    const sortedQueries = Object.keys(this.mediaQueries)
      .concat(query)
      .sort(this.desktopFirst ? sortMediaQueries.desktopFirst : sortMediaQueries);
    const index = sortedQueries.indexOf(query);

    // Insert the rule and capture the instance
    this.sheet.insertRule(
      isMediaQueryCondition(rule) ? rule : `@media ${query} { ${rule} }`,
      index,
    );

    this.mediaQueries[query] = this.sheet.cssRules[index] as CSSMediaRule;

    return this.mediaQueries[query];
  }
}
