import BaseStyleSheet from '../src/BaseStyleSheet';
import TransientStyleRule from '../src/server/TransientStyleRule';
import { STYLE_RULE } from '../src/constants';

describe('Conditions', () => {
  class BufferSheet extends BaseStyleSheet {
    buffer() {
      return this.ruleBuffer;
    }

    enqueue(rule: string, customIndex?: number): number {
      return this.enqueueRule(rule, customIndex);
    }

    flush() {
      this.flushRules();
    }
  }

  let sheet: BufferSheet;
  let nativeSheet: TransientStyleRule;
  let rafSpy: jest.SpyInstance;

  beforeEach(() => {
    nativeSheet = new TransientStyleRule(STYLE_RULE);
    sheet = new BufferSheet(nativeSheet);
    rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);

    process.env.NODE_ENV = 'test-buffer';
  });

  afterEach(() => {
    process.env.NODE_ENV = 'test';

    rafSpy.mockRestore();
  });

  it('increments the index when enqueueing', () => {
    sheet.enqueue('.foo {}');
    sheet.enqueue('.bar {}');

    expect(sheet.buffer()).toEqual([
      { rule: '.foo {}', index: 0 },
      { rule: '.bar {}', index: 1 },
    ]);
  });

  it('can set a custom index when enqueueing', () => {
    sheet.enqueue('.foo {}');
    sheet.enqueue('.bar {}', 10);

    expect(sheet.buffer()).toEqual([
      { rule: '.foo {}', index: 0 },
      { rule: '.bar {}', index: 10 },
    ]);
  });

  it('requests an animation frame only once', () => {
    sheet.enqueue('.foo {}');
    sheet.enqueue('.bar {}');
    sheet.enqueue('.baz {}');

    expect(rafSpy).toHaveBeenCalledTimes(1);
  });

  it('injects rules and resets buffer when flushing', () => {
    sheet.enqueue('.foo {}');
    sheet.enqueue('.bar {}', 10);
    sheet.enqueue('.baz {}');

    expect(sheet.buffer()).toEqual([
      { rule: '.foo {}', index: 0 },
      { rule: '.bar {}', index: 10 },
      { rule: '.baz {}', index: 1 },
    ]);

    sheet.flush();

    expect(sheet.buffer()).toEqual([]);
    expect(sheet.lastIndex).toBe(2);
    // @ts-ignore Allow access
    expect(sheet.rafHandle).toBe(0);
    expect(nativeSheet.cssRules).toHaveLength(3);
  });
});
