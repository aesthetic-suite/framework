export default function isFontFaceFule(value: string): boolean {
  // eslint-disable-next-line no-magic-numbers
  return value.slice(0, 10) === '@font-face';
}
