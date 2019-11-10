export default function stripClassPrefix(name: string): string {
  return name.charAt(0) === '.' ? name.slice(1) : name;
}
