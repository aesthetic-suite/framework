import { Import } from '../types';

export default function formatImport(value: Import | string): string {
  if (typeof value === 'string') {
    return value;
  }

  let path = `"${value.path}"`;

  if (value.url) {
    path = `url(${path})`;
  }

  if (value.media) {
    path += ` ${value.media}`;
  }

  return path;
}
