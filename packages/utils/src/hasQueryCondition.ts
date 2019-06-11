const QUERY_GROUP = /\([-a-z]+:/giu;

export default function hasQueryCondition(value: string): boolean {
  return !!value.match(QUERY_GROUP);
}
