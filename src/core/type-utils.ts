export function nullableToNull<T>(value: T | undefined | null): T | null {
  return value === undefined ? null : value;
}

export function nullableToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}
