export default function isMediaQueryCondition(value: string): boolean {
  return value.startsWith('@media');
}
