export default function joinQueries(prev: string | undefined, next: string): string {
  if (prev) {
    return `${prev} and ${next}`;
  }

  return next;
}
