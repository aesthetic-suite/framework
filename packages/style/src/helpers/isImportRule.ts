export default function isImportRule(value: string): boolean {
  // eslint-disable-next-line no-magic-numbers
  return value.slice(0, 7) === '@import' && value[7] === ' ';
}
