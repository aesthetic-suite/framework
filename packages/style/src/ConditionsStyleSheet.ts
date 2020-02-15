import sortMediaQueries from 'sort-css-media-queries';
import BaseStyleSheet from './BaseStyleSheet';
import { Condition } from './types';

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
   */
  insertRule(conditions: Condition[], rule: string): number {
    const rootCondition = conditions[0];
    const finalRule = conditions.reduce(
      (tempRule, condition) =>
        `@${condition.type === CSSRule.MEDIA_RULE ? 'media' : 'supports'} ${
          condition.query
        } { ${tempRule} }`,
      rule,
    );

    if (rootCondition.type === CSSRule.MEDIA_RULE) {
      this.insertMediaRule(rootCondition.query, finalRule);
    } else {
      this.insertFeatureRule(rootCondition.query, finalRule);
    }

    // This is not possible at this time. Rules can only be inserted at the root.
    // const size = conditions.length;
    // let instance: CSSConditionRule | null = null;

    // for (let i = 0; i < size; i += 1) {
    //   const { query, type } = conditions[i];
    //   const bodyContent = i === size - 1 ? rule : '';

    //   // Insert a new condition at the root
    //   if (i === 0) {
    //     instance =
    //       type === CSSRule.MEDIA_RULE
    //         ? this.insertMediaRule(query, bodyContent)
    //         : this.insertFeatureRule(query, bodyContent);

    //     // Recursively insert nested rules
    //   } else if (instance) {
    //     instance = this.findNestedRule(instance, query, type) || instance;

    //     // Insert the rule and return a new instance
    //     instance = instance.cssRules[
    //       instance.insertRule(bodyContent, instance.cssRules.length)
    //     ] as CSSConditionRule;
    //   }
    // }

    return -1;
  }

  /**
   * Insert an `@supports` rule into the root for the defined query.
   */
  insertFeatureRule(query: string, rule: string): CSSSupportsRule {
    // const featureRule = this.featureQueries[query];

    // // Already exists so append a new rule
    // if (featureRule) {
    //   const index = featureRule.insertRule(rule, featureRule.cssRules.length);

    //   return featureRule.cssRules[index] as CSSSupportsRule;
    // }

    // Insert the rule and capture the instance
    const index = this.sheet.insertRule(
      `@supports ${query} { ${rule} }`,
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
    // const mediaRule = this.mediaQueries[query];

    // // Already exists so append a new rule
    // if (mediaRule) {
    //   const index = mediaRule.insertRule(rule, mediaRule.cssRules.length);

    //   return mediaRule.cssRules[index] as CSSMediaRule;
    // }

    // Sort and determine the index in which to insert a new query
    const sortedQueries = Object.keys(this.mediaQueries)
      .concat(query)
      .sort(this.desktopFirst ? sortMediaQueries.desktopFirst : sortMediaQueries);
    const index = sortedQueries.indexOf(query);

    // Insert the rule and capture the instance
    this.sheet.insertRule(`@media ${query} { ${rule} }`, index);

    this.mediaQueries[query] = this.sheet.cssRules[index] as CSSMediaRule;

    return this.mediaQueries[query];
  }
}
