export default function isAtRule(value: string): boolean {
  return value[0] === '@';
}
