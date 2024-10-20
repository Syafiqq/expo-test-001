export function nullableToNull<T>(value: T | undefined | null): T | null {
  return value === undefined ? null : value;
}
