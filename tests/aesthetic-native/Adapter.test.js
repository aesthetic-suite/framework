import ReactNativeAdapter from '../../packages/aesthetic-native/src/Adapter';
import { SYNTAX_NATIVE_PARTIAL } from '../mocks';

describe('aesthetic-native/Adapter', () => {
  let instance = null;

  beforeEach(() => {
    instance = new ReactNativeAdapter();
  });

  it('returns the style declarations as-is', () => {
    expect(instance.transform('component', SYNTAX_NATIVE_PARTIAL)).toEqual(SYNTAX_NATIVE_PARTIAL);
  });
});
