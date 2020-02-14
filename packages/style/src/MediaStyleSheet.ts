import sortMediaQueries from 'sort-css-media-queries';
import BaseStyleSheet from './BaseStyleSheet';

export default class MediaStyleSheet extends BaseStyleSheet {
  desktopFirst: boolean;

  rules: { [query: string]: CSSMediaRule } = {};

  constructor(desktopFirst: boolean = false) {
    super('media');

    this.desktopFirst = desktopFirst;
  }

  /**
   * Insert a rule for the defined query while keeping a mobile/desktop-first sort order.
   */
  insertRule(query: string, rule: string): number {
    const mediaRule = this.rules[query];

    // Already exists so append a new rule
    if (mediaRule) {
      return mediaRule.insertRule(rule, mediaRule.cssRules.length);
    }

    // Determine the index in which to insert a new query
    const sortedQueries = Object.keys(this.rules)
      .concat(query)
      .sort(this.desktopFirst ? sortMediaQueries.desktopFirst : sortMediaQueries);
    const index = sortedQueries.indexOf(query);

    // Insert the rule and capture the instance
    this.sheet.insertRule(`@media ${query} { ${rule} }`, index);
    this.rules[query] = this.sheet.cssRules.item(index) as CSSMediaRule;

    return index;
  }
}
