import SheetManager from '../src/SheetManager';
import TransientStyleRule from '../src/server/TransientStyleRule';
import { STYLE_RULE } from '../src/constants';

describe('Buffering', () => {
  class BufferSheet extends SheetManager {
    buffer() {
      return this.ruleBuffer;
    }

    enqueue(rule: string, customIndex?: number): number {
      return this.enqueueRule('standard', rule, customIndex);
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
    sheet = new BufferSheet({
      global: nativeSheet,
      standard: nativeSheet,
      conditions: nativeSheet,
    });
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
      { rule: '.foo {}', index: 0, type: 'standard' },
      { rule: '.bar {}', index: 1, type: 'standard' },
    ]);
  });

  it('can set a custom index when enqueueing', () => {
    sheet.enqueue('.foo {}');
    sheet.enqueue('.bar {}', 10);

    expect(sheet.buffer()).toEqual([
      { rule: '.foo {}', index: 0, type: 'standard' },
      { rule: '.bar {}', index: 10, type: 'standard' },
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
      { rule: '.foo {}', index: 0, type: 'standard' },
      { rule: '.bar {}', index: 10, type: 'standard' },
      { rule: '.baz {}', index: 1, type: 'standard' },
    ]);

    sheet.flush();

    expect(sheet.buffer()).toEqual([]);
    expect(sheet.getSheet('standard').lastIndex).toBe(2);
    // @ts-expect-error
    expect(sheet.rafHandle).toBe(0);
    expect(nativeSheet.cssRules).toHaveLength(3);
  });
});
