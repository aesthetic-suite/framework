export function divide(...props: unknown[]): string {
  return props.filter(Boolean).join(' / ');
}

export function join(...props: unknown[]): string {
  return props.filter(Boolean).join(' ');
}
