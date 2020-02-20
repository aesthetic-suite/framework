import hash from 'string-hash';

export default function generateHash(value: string): string {
  // eslint-disable-next-line no-magic-numbers
  return hash(value).toString(36);
}
