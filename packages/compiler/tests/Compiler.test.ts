/* eslint-disable jest/expect-expect */

import fs from 'fs';
import path from 'path';
import { Compiler } from '../src';

const CONFIG_PATH = path.join(__dirname, '../templates/config.yaml');

async function runCompilerSnapshot(filePath: string) {
  const mkdirSpy = jest.spyOn(fs.promises, 'mkdir').mockImplementation(() => Promise.resolve());

  const writeSpy = jest.spyOn(fs.promises, 'writeFile').mockImplementation((fp, contents) => {
    expect(contents).toMatchSnapshot();

    return Promise.resolve();
  });

  const compiler = new Compiler(filePath, __dirname, {
    platform: 'web',
    target: 'web-ts',
  });

  await compiler.compile();

  mkdirSpy.mockRestore();
  writeSpy.mockRestore();
}

describe('Compiler', () => {
  describe('constructor()', () => {
    it('errors if no config path', () => {
      expect(() => new Compiler('', '', { platform: 'web', target: 'web-js' })).toThrow(
        'A configuration file path is required.',
      );
    });

    it('errors if config file is missing', () => {
      expect(() => new Compiler('./foo.yaml', '', { platform: 'web', target: 'web-js' })).toThrow(
        'File path "foo.yaml" does not exist.',
      );
    });

    it('errors if no target path', () => {
      expect(() => new Compiler(CONFIG_PATH, '', { platform: 'web', target: 'web-js' })).toThrow(
        'A target destination file path is required.',
      );
    });

    it('does not error if target path is missing', () => {
      expect(
        () => new Compiler(CONFIG_PATH, './unknown-target', { platform: 'web', target: 'web-js' }),
      ).not.toThrow();
    });

    it('errors for unknown platform', () => {
      expect(
        () =>
          new Compiler(CONFIG_PATH, './unknown-target', {
            // @ts-ignore Allow
            platform: 'osx',
            target: 'web-js',
          }),
      ).toThrow('Invalid field "platform". String must be one of: android, ios, web');
    });

    it('errors for unknown target', () => {
      expect(
        () =>
          new Compiler(CONFIG_PATH, './unknown-target', {
            platform: 'web',
            // @ts-ignore Allow
            target: 'web-tsx',
          }),
      ).toThrow(
        'Invalid field "target". String must be one of: android, ios, web-cjs, web-css, web-less, web-sass, web-scss, web-js, web-ts',
      );
    });
  });

  describe('compile()', () => {
    it('compiles base config', async () => {
      await runCompilerSnapshot(CONFIG_PATH);
    });

    it('compiles fonts', async () => {
      await runCompilerSnapshot(path.join(__dirname, `./__fixtures__/fonts.yaml`));
    });

    it('compiles multiple themes', async () => {
      await runCompilerSnapshot(path.join(__dirname, `./__fixtures__/themes.yaml`));
    });
  });
});
