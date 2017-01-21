import ReactNativeAdapter from '../../../src/adapters/react-native/NativeAdapter';
import { SYNTAX_NATIVE_PARTIAL } from '../../mocks';

describe('adapters/react-native/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new ReactNativeAdapter();
  });

  it('returns the style declarations as-is', () => {
    expect(instance.transform('component', SYNTAX_NATIVE_PARTIAL)).toEqual(SYNTAX_NATIVE_PARTIAL);
  });
});
