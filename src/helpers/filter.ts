import { iterate, type MaybePromise } from "./iterate.js";

type NotBoolean<S> = S extends boolean ? never : S;

export function filter<T, S>(
  arr: MaybePromise<T>[],
  predicate: (t: T) => NotBoolean<S> | undefined,
): Promise<Array<NotBoolean<S>>>;
export function filter<T>(
  arr: MaybePromise<T>[],
  predicate: (t: T) => boolean,
): Promise<Array<T>>;
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
