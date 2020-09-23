export default function attempt<T>(callback: () => T): T | null {
  try {
    return callback();
  } catch {
    return null;
  }
}
