export default function isSupportsCondition(value: string): boolean {
  return value.startsWith('@supports');
}
