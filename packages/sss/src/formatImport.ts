import { Import } from './types';

export default function formatImport(value: string | Import): string {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  let path = `"${value.path}"`;

  if (value.url) {
    path = `url(${path})`;
  }

  if (value.query) {
    path += ` ${value.query}`;
  }

  return path;
}
