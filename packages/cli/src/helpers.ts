import { Path } from '@boost/common';
import { CWD, CONFIG_FOLDER } from './constants';

export function getConfigFolderPath(name: string): Path {
  return new Path(CWD, CONFIG_FOLDER, name);
}

export function validateSystemName(value: string) {
  if (value && !value.match(/^[-a-z0-9]+$/giu)) {
    throw new Error('Name may only contain numbers, letters, and dashes.');
  }
}
