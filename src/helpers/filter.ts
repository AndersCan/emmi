import { iterate, type MaybePromise } from "./iterate.js";

export function filter<T>(
  arr: MaybePromise<T>[],
  predicate: (t: T) => boolean,
): Promise<Array<T>> {
  return new Promise((resolve, reject) => {
    const allResults: T[] = [];
    iterate(arr, (item) => {
      predicate(item) && allResults.push(item);
    })
      .then(() => resolve(allResults))
      .catch(reject);
  });
}
