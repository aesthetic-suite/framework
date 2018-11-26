import Ruleset from '../packages/core/src/Ruleset';
import Sheet from '../packages/core/src/Sheet';

export function cleanStyles(source: string): string {
  return source.replace(/\n/gu, '').replace(/\s{2,}/gu, '');
}

export function createTestRulesets(selector: string, data: any[]): Ruleset<any>[] {
  return data.map(item => {
    const ruleset = new Ruleset(selector, new Sheet());
    ruleset.properties = item as any;

    return ruleset;
  });
}

export function createTestKeyframes(selector: string, data: any): Ruleset<any> {
  const ruleset = new Ruleset(selector, new Sheet());

  Object.keys(data).forEach(key => {
    const nested = new Ruleset(key, ruleset.root, ruleset);
    nested.properties = data[key] as any;
    nested.parent = ruleset;

    ruleset.addNested(key, nested);
  });

  return ruleset;
}
