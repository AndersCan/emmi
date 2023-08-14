import { iterate, type MaybePromise } from "./iterate.js";

export function find<T, S extends T>(
  arr: MaybePromise<T>[],
  predicate: (t: T) => t is S,
): Promise<S | undefined>;
export function find<T>(
  arr: MaybePromise<T>[],
  predicate: (t: T) => boolean,
): Promise<T | undefined>;
export function find<T>(
  arr: MaybePromise<T>[],
  predicate: (t: T) => boolean,
): Promise<T | undefined> {
  let done = false;
  return new Promise((resolve, reject) => {
    return iterate(arr, (element, itemsLeft) => {
      if (!done && predicate(element)) {
        done = true;
        resolve(element);
      }

      if (itemsLeft === 0) resolve(undefined);
    }).catch(reject);
  });
}
