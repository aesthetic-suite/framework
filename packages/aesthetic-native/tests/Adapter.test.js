import ReactNativeAdapter from '../src/Adapter';
import { SYNTAX_NATIVE_PARTIAL } from '../../../tests/mocks';

describe('aesthetic-native/Adapter', () => {
  let instance = null;

  beforeEach(() => {
    instance = new ReactNativeAdapter();
  });

  it('returns the style declarations as-is', () => {
    expect(instance.transform('component', SYNTAX_NATIVE_PARTIAL)).toEqual(SYNTAX_NATIVE_PARTIAL);
  });
});
