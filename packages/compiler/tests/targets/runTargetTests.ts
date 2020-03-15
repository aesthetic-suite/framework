import fs from 'fs';
import path from 'path';
import { Compiler, PlatformType, TargetType } from '../../src';

export default function runTargetTests(platform: PlatformType, target: TargetType) {
  describe(`Target ${target}`, () => {
    let compiler: Compiler;

    beforeEach(() => {
      compiler = new Compiler(path.join(__dirname, '../../templates/config.yaml'), __dirname, {
        platform,
        target,
      });
    });

    it('compiles and writes files', async () => {
      const mkdirSpy = jest.spyOn(fs.promises, 'mkdir').mockImplementation(() => Promise.resolve());

      const writeSpy = jest
        .spyOn(fs.promises, 'writeFile')
        .mockImplementation((filePath, contents) => {
          expect(contents).toMatchSnapshot();

          return Promise.resolve();
        });

      await compiler.compile();

      if (target === 'web-cjs' || target === 'web-js' || target === 'web-ts') {
        expect(writeSpy).toHaveBeenCalledTimes(2);
      } else {
        expect(writeSpy).toHaveBeenCalledTimes(3);
      }

      mkdirSpy.mockRestore();
      writeSpy.mockRestore();
    });
  });
}
