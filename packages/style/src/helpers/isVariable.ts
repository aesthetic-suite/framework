export default function isVariable(value: string): boolean {
  return value.slice(0, 2) === '--';
}
