/* eslint-disable no-magic-numbers */

import { CSS, Variables } from '@aesthetic/types';
import { arrayLoop, arrayReduce } from '@aesthetic/utils';
import sortMediaQueries from 'sort-css-media-queries';
// Rollup compatibility
import {
  Condition,
  FONT_FACE_RULE,
  IMPORT_RULE,
  insertImportRule,
  insertRule,
  isAtRule,
  isImportRule,
  isMediaRule,
  KEYFRAMES_RULE,
  MEDIA_RULE,
  SheetManager,
  SheetMap,
  STYLE_RULE,
  StyleRule,
  SUPPORTS_RULE,
} from '../index';

export interface ServerSheetManager extends SheetManager {
  featureQueries: Record<string, StyleRule>;
  mediaQueries: Record<string, StyleRule>;
}

export class TransientSheet implements StyleRule {
  conditionText: string = '';

  cssRules: StyleRule[] = [];

  cssVariables: Variables<string> = {};

  textContent: string = '';

  type: number;

  protected rule: string;

  constructor(type: number = STYLE_RULE, rule: string = '') {
    this.rule = rule;
    this.type = type;

    if (type === MEDIA_RULE || type === SUPPORTS_RULE) {
      this.rule = '';
      this.conditionText = rule
        .slice(0, rule.indexOf('{') - 1)
        .replace(this.conditionAtRule, '')
        .trim();
    }
  }

  get cssText() {
    const css = arrayReduce(this.cssRules, (rule) => rule.cssText, this.rule);

    if (this.type === MEDIA_RULE || this.type === SUPPORTS_RULE) {
      return `${this.conditionAtRule} ${this.conditionText} { ${css} }`;
    }

    return css;
  }

  insertRule(rule: string, index: number): number {
    this.cssRules.splice(index, 0, new TransientSheet(this.determineType(rule), rule));

    return index;
  }

  protected get conditionAtRule() {
    return this.type === MEDIA_RULE ? '@media' : '@supports';
  }

  protected determineType(rule: string): number {
    if (rule[0] !== '@') {
      return STYLE_RULE;
    }

    if (rule.startsWith('@media')) {
      return MEDIA_RULE;
    } else if (rule.startsWith('@supports')) {
      return SUPPORTS_RULE;
    } else if (rule.startsWith('@font-face')) {
      return FONT_FACE_RULE;
    } else if (rule.startsWith('@keyframes')) {
      return KEYFRAMES_RULE;
    } else if (rule.startsWith('@import')) {
      return IMPORT_RULE;
    }

    return STYLE_RULE;
  }
}

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

function findNestedRule(sheet: StyleRule, query: string, type: number): StyleRule | null {
  for (let i = 0; i < sheet.cssRules.length; i += 1) {
    const child = sheet.cssRules[i];

    if (child && child.type === type && child.conditionText === query) {
      return child;
    }
  }

  return null;
}

function insertFeatureRule(
  sheet: StyleRule,
  query: string,
  rule: CSS,
  manager: ServerSheetManager,
  parentRule?: StyleRule,
): number {
  const formattedRule = `@supports ${query} { ${rule} }`;

  // Already exists so append a new rule
  if (parentRule && parentRule !== sheet) {
    return parentRule.insertRule(formattedRule, parentRule.cssRules.length);
  }

  // Insert the rule and capture the instance
  const index = insertRule(sheet, formattedRule);

  manager.featureQueries[query] = sheet.cssRules[index];

  return index;
}

function insertMediaRule(
  sheet: StyleRule,
  query: string,
  rule: CSS,
  manager: ServerSheetManager,
  parentRule?: StyleRule,
): number {
  const formattedRule = `@media ${query} { ${rule} }`;

  // Already exists so append a new rule (except for root sorting)
  if (parentRule && parentRule !== sheet) {
    return parentRule.insertRule(formattedRule, parentRule.cssRules.length);
  }

  // Sort and determine the index in which to insert a new query
  const sortedQueries = Object.keys(manager.mediaQueries).concat(query).sort(sortMediaQueries);
  const index = sortedQueries.indexOf(query);

  insertRule(sheet, formattedRule, index);

  manager.mediaQueries[query] = sheet.cssRules[index];

  return index;
}

function insertConditionRule(
  sheet: StyleRule,
  rule: CSS,
  conditions: Condition[],
  manager: ServerSheetManager,
): number {
  let parent = sheet;

  arrayLoop(conditions, (condition) => {
    const { query, type } = extractQueryAndType(condition);
    const instance = findNestedRule(parent, query, type);

    // Nested found, so continue without inserting a new rule
    if (instance) {
      parent = instance;

      return;
    }

    const index =
      type === MEDIA_RULE
        ? insertMediaRule(sheet, query, '', manager, parent)
        : insertFeatureRule(sheet, query, '', manager, parent);

    parent = parent.cssRules[index];
  });

  return parent.insertRule(rule, parent.cssRules.length);
}

export function createSheetManager(sheets: SheetMap): ServerSheetManager {
  const manager: ServerSheetManager = {
    featureQueries: {},
    insertRule(rule, options, index) {
      const sheet = sheets[options.type || (options.conditions ? 'conditions' : 'standard')];

      if (isImportRule(rule)) {
        return insertImportRule(sheet, rule);
      } else if (isAtRule(rule)) {
        return insertConditionRule(sheet, rule, options.conditions || [], manager);
      }

      return insertRule(sheet, rule, index);
    },
    mediaQueries: {},
    sheets,
  };

  return manager;
}
