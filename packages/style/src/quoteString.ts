export default function quoteString(value: string): string {
  if (value.charAt(0) === '"') {
    return value;
  }

  return `"${value}"`;
}
