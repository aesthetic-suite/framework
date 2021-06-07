import doParse from '../src/parse';
import { GlobalStyleSheet, ParserOptions } from '../src/types';
import { SYNTAX_ROOT } from './__mocks__/global';
import { SYNTAX_VARIABLES } from './__mocks__/local';
import { createBlock } from './helpers';

function parse(styleSheet: GlobalStyleSheet, options: Partial<ParserOptions<object>>) {
  doParse('global', styleSheet, options);
}

describe('GlobalParser', () => {
  let spy: jest.Mock;

  beforeEach(() => {
    spy = jest.fn();
  });

  describe('@root', () => {
    it('errors if root is not an object', () => {
      expect(() => {
        parse(
          {
            // @ts-expect-error
            '@root': 123,
          },
          {},
        );
      }).toThrow('"@root" must be a declaration object of CSS properties.');
    });

    it('does not emit if no goot', () => {
      parse(
        {},
        {
          onRoot: spy,
        },
      );

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits a local block for root', () => {
      parse(
        {
          '@root': SYNTAX_ROOT,
        },
        {
          onRoot: spy,
          onMedia(block, query, value) {
            block.nest(value);
          },
        },
      );

      expect(spy).toHaveBeenCalledWith(
        createBlock('@root', {
          height: '100%',
          margin: 0,
          fontSize: 16,
          lineHeight: 1.5,
          backgroundColor: 'white',
          '@media (prefers-color-scheme: dark)': {
            backgroundColor: 'black',
          },
        }),
      );
    });
  });

  describe('@variables', () => {
    it('errors if variables are not an object', () => {
      expect(() => {
        parse(
          {
            // @ts-expect-error
            '@variables': 123,
          },
          {},
        );
      }).toThrow('@variables must be a mapping of CSS variables.');
    });

    it('does not emit `block:variable` listener', () => {
      parse(
        {
          '@variables': {
            color: 'red',
          },
        },
        {
          onVariable: spy,
        },
      );

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits for each variable', () => {
      parse(
        {
          '@variables': SYNTAX_VARIABLES['@variables'],
        },
        {
          onRootVariables: spy,
        },
      );

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        '--font-size': '14px',
        '--color': 'red',
        '--line-height': 1.5,
      });
    });
  });
});
