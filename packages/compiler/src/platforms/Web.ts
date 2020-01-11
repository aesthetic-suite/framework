import fs from 'fs';
import path from 'path';
import ejs, { AsyncTemplateFunction } from 'ejs';
import {
  BORDER_SIZES,
  BREAKPOINT_SIZES,
  HEADING_LEVELS,
  LAYER_LEVELS,
  SHADOW_SIZES,
  SPACING_SIZES,
  TEXT_SIZES,
} from '../constants';
import Compiler from '../Compiler';

const TEST_COMPILE_PATH = path.join(process.cwd(), 'build');
const TEMPLATES_FOLDER = path.join(__dirname, '../templates');

export default class WebPlatform {
  compiler: Compiler;

  constructor(compiler: Compiler) {
    this.compiler = compiler;
  }

  getExtensionForTarget(): string {
    switch (this.compiler.options.target) {
      case 'android':
        return 'java';
      case 'ios':
        return 'swift';
      case 'web-css':
        return 'css';
      case 'web-less':
        return 'less';
      case 'web-sass':
        return 'sass';
      case 'web-scss':
        return 'scss';
      case 'web-js':
        return 'js';
      case 'web-ts':
        return 'ts';
      default:
        return '';
    }
  }

  getTargetFilePath(name: string): string {
    return path.join(
      TEST_COMPILE_PATH,
      this.compiler.options.target,
      `${name}.${this.getExtensionForTarget()}`,
    );
  }

  async loadTemplate(name: string): Promise<AsyncTemplateFunction> {
    const templatePath = path.join(TEMPLATES_FOLDER, this.compiler.options.target, `${name}.ejs`);

    return ejs.compile(await fs.promises.readFile(templatePath, 'utf8'), { async: true });
  }

  async writeDesignSystemFile() {
    const template = await this.loadTemplate('system');

    return fs.promises.writeFile(
      this.getTargetFilePath('system'),
      await template({
        borderSizes: BORDER_SIZES,
        breakpointSizes: BREAKPOINT_SIZES,
        headingLevels: HEADING_LEVELS,
        layerLevels: LAYER_LEVELS,
        shadowSizes: SHADOW_SIZES,
        spacingSizes: SPACING_SIZES,
        textSizes: TEXT_SIZES,
      }),
      'utf8',
    );
  }

  // async writeMixinsFile() {}

  // async writeThemeFile() {}
}
