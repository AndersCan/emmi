type NonUndefined<T> = T extends undefined | void ? never : T;

const kMarkForSpread = Symbol( "kSpread" );
export type MarkedForSpread<T> = T & {
  [kMarkForSpread]: true;
};
/**
 * Mark that an array of `Output` should be spread.
 * This enables a single listener to return multiple replies
 */
export function markForSpread<T>(
  outputArray: Array<T>,
): Array<T> & { [kMarkForSpread]: true } {
  // @ts-expect-error
  outputArray[kMarkForSpread] = true;
  // @ts-expect-error
  return outputArray;
}
/**
 * Is the array marked for spreading by `markForSpread`
 */
export function isMarkedForSpread<T>(
  arr: T[],
): arr is MarkedForSpread<T[]> {
  return (arr as Array<NonUndefined<T>> & { [kMarkForSpread]: true })[
    kMarkForSpread
  ] === true;
}
