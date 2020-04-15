import hash from 'string-hash';

const cache: { [key: string]: string } = {};

export default function generateHash(value: string): string {
  if (!cache[value]) {
    // eslint-disable-next-line no-magic-numbers
    cache[value] = hash(value).toString(36);
  }

  return cache[value];
}
