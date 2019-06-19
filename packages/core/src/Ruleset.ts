import convertRTL from 'rtl-css-js';
import { isRTL, toObjectRecursive } from 'aesthetic-utils';
import Sheet from './Sheet';
import { CompoundProperties } from './types';

export default class Ruleset<Block extends object> {
  compoundProperties: Map<CompoundProperties, (string | Block)[]> = new Map();

  nested: Map<string, Ruleset<Block>> = new Map();

  parent: Ruleset<Block> | null = null;

  properties: Partial<Block> = {};

  root: Sheet<Block>;

  selector: string;

  constructor(selector: string, root: Sheet<Block>, parent: Ruleset<Block> | null = null) {
    this.selector = selector;
    this.root = root;
    this.parent = parent;
  }

  addCompoundProperty(key: CompoundProperties, value: (string | Block)[]): this {
    this.compoundProperties.set(key, value);

    return this;
  }

  addNested(selector: string, ruleset: Ruleset<Block>, merge: boolean = true): this {
    if (merge && this.nested.has(selector)) {
      this.nested.get(selector)!.merge(ruleset);
    } else {
      this.nested.set(selector, ruleset);
    }

    return this;
  }

  addProperty(key: keyof Block, value: any): this {
    this.properties[key] = value;

    return this;
  }

  addProperties(properties: Partial<Block>): this {
    Object.assign(this.properties, properties);

    return this;
  }

  createRuleset(selector: string): Ruleset<Block> {
    return new Ruleset(selector, this.root, this);
  }

  merge(ruleset: Ruleset<Block>): this {
    Object.assign(this.properties, ruleset.properties);

    ruleset.nested.forEach((nested, selector) => {
      this.addNested(selector, nested);
    });

    return this;
  }

  toObject(): Block {
    const props = isRTL(this.root.options.dir) ? convertRTL(this.properties) : this.properties;
    const compounds: any = {};

    // Compound properties are a list of rulesets that have already been cast to block objects.
    // We shouldn't convert to RTL, otherwise it would flip back to the original state.
    this.compoundProperties.forEach((compound, key) => {
      compounds[key] = compound;
    });

    return {
      ...props,
      ...compounds,
      ...toObjectRecursive(this.nested),
    } as Block;
  }
}
