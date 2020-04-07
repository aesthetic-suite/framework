/* eslint-disable @typescript-eslint/no-misused-promises */

import fs from 'fs-extra';
import path from 'path';
import { Compiler, PlatformType, FormatType } from '../../src';

export default function runTargetTests(
  platform: PlatformType,
  format: FormatType,
  // Alternate testing fixed and scaled configs
  fixed: boolean = false,
) {
  describe(`Format ${format}`, () => {
    let compiler: Compiler;

    beforeEach(() => {
      compiler = new Compiler(
        path.join(__dirname, `../../templates/${fixed ? 'config-fixed' : 'config'}.yaml`),
        __dirname,
        {
          format,
          platform,
        },
      );
    });

    it('compiles and writes files', async () => {
      const mkdirSpy = jest.spyOn(fs, 'ensureDir').mockImplementation(() => Promise.resolve());

      const writeSpy = jest.spyOn(fs, 'writeFile').mockImplementation((filePath, contents) => {
        expect(contents).toMatchSnapshot();

        return Promise.resolve();
      });

      await compiler.compile();

      if (format === 'web-cjs' || format === 'web-js' || format === 'web-ts') {
        expect(writeSpy).toHaveBeenCalledTimes(2);
      } else {
        expect(writeSpy).toHaveBeenCalledTimes(3);
      }

      mkdirSpy.mockRestore();
      writeSpy.mockRestore();
    });
  });
}
