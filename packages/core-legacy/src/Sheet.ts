import { toObjectRecursive } from 'aesthetic-utils';
import Ruleset from './Ruleset';
import { ClassName, SheetMap, TransformOptions } from './types';

type AtRuleType<Block extends object> =
  | string
  | string[]
  | Ruleset<Block>
  | Ruleset<Block>[]
  | Sheet<Block>;

export default class Sheet<Block extends object> {
  atRules: { [rule: string]: AtRuleType<Block> } = {};

  classNames: { [selector: string]: ClassName } = {};

  options: TransformOptions;

  ruleSets: { [selector: string]: Ruleset<Block> } = {};

  constructor(options: TransformOptions = {}) {
    this.options = options;
  }

  addAtRule(rule: string, value: AtRuleType<Block>): this {
    this.atRules[rule] = value;

    return this;
  }

  addClassName(selector: string, value: ClassName): this {
    this.classNames[selector] = value;

    return this;
  }

  addRuleset(set: Ruleset<Block>): this {
    this.ruleSets[set.selector] = set;

    return this;
  }

  createRuleset(selector: string): Ruleset<Block> {
    return new Ruleset(selector, this);
  }

  createSheet(options?: TransformOptions): Sheet<Block> {
    return new Sheet(options || this.options);
  }

  toObject(): SheetMap<Block> {
    const block: { [key: string]: unknown } = {};

    Object.keys(this.atRules).forEach(key => {
      const value = this.atRules[key];

      if (value instanceof Sheet || value instanceof Ruleset) {
        block[key] = value.toObject();
      } else if (Array.isArray(value)) {
        // @ts-ignore This type is resolving weird
        block[key] = value.map(item => (item instanceof Ruleset ? item.toObject() : item));
      } else {
        block[key] = value;
      }
    });

    toObjectRecursive(this.ruleSets, (key, value) => {
      block[key] = value;
    });

    return block as SheetMap<Block>;
  }
}
