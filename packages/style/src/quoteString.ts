export default function quoteString(value: string): string {
  const char = value.charAt(0);

  if (char === '"' || char === "'") {
    return value;
  }

  return `"${value}"`;
}
