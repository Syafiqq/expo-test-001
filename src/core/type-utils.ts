import _ from 'lodash';

export function nullableToNull<T>(value: T | undefined | null): T | null {
  return value === undefined ? null : value;
}

export function nullableToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

export const compactMap = <T, U>(
  array: T[],
  callback: (item: T, index: number, array: T[]) => U | undefined,
): U[] => {
  return _.compact(array.map(callback));
};
