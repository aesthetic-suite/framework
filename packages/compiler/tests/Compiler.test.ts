/* eslint-disable @typescript-eslint/no-misused-promises, jest/expect-expect */

import fs from 'fs-extra';
import path from 'path';
import { Compiler } from '../src';

const CONFIG_PATH = path.join(__dirname, './__fixtures__/system-scaled');

async function runCompilerSnapshot(filePath: string) {
  const mkdirSpy = jest.spyOn(fs, 'ensureDir').mockImplementation(() => Promise.resolve());

  const writeSpy = jest.spyOn(fs, 'writeFile').mockImplementation((fp, contents) => {
    expect(contents).toMatchSnapshot();

    return Promise.resolve();
  });

  const compiler = new Compiler(filePath, __dirname, {
    format: 'web-css-in-ts',
    platform: 'web',
  });

  await compiler.compile();

  mkdirSpy.mockRestore();
  writeSpy.mockRestore();
}

describe('Compiler', () => {
  describe('constructor()', () => {
    it('errors if no config path', () => {
      expect(() => new Compiler('', '', { platform: 'web', format: 'web-css-in-js' })).toThrow(
        'A configuration folder path is required.',
      );
    });

    it('errors if config file is missing', () => {
      expect(
        () => new Compiler('./foo.yaml', '', { platform: 'web', format: 'web-css-in-js' }),
      ).toThrow('File path "foo.yaml" does not exist.');
    });

    it('errors if no target path', () => {
      expect(
        () => new Compiler(CONFIG_PATH, '', { platform: 'web', format: 'web-css-in-js' }),
      ).toThrow('A target destination file path is required.');
    });

    it('does not error if target path is missing', () => {
      expect(
        () =>
          new Compiler(CONFIG_PATH, './unknown-target', {
            platform: 'web',
            format: 'web-css-in-js',
          }),
      ).not.toThrow();
    });

    it('errors for unknown platform', () => {
      expect(
        () =>
          new Compiler(CONFIG_PATH, './unknown-target', {
            // @ts-expect-error
            platform: 'osx',
            format: 'web-css-in-js',
          }),
      ).toThrow('Invalid field "platform". String must be one of: android, ios, web');
    });

    it('errors for unknown target', () => {
      expect(
        () =>
          new Compiler(CONFIG_PATH, './unknown-target', {
            platform: 'web',
            // @ts-expect-error
            format: 'web-tsx',
          }),
      ).toThrow(
        'Invalid field "format". String must be one of: android, ios, web-css, web-css-in-js, web-css-in-ts, web-less, web-sass, web-scss, web-js, web-ts',
      );
    });
  });

  describe('compile()', () => {
    it('compiles all configs', async () => {
      await runCompilerSnapshot(CONFIG_PATH);
    });
  });
});
