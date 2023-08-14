type MaybePromise<T> = T | Promise<T>;

export function filter<T>(
  arr: MaybePromise<T>[],
  predicate: (t: T) => boolean,
): Promise<Array<T>> {
  return new Promise((resolve, reject) => {
    const allResults: T[] = [];

    let itemsLeft = arr.length;
    const length = arr.length;
    let i = -1;
    while (length > ++i) {
      const maybePromise = arr[i];
      if (isPromise(maybePromise)) {
        maybePromise
          .then((result) => {
            if (predicate(result)) {
              allResults.push(result);
            }
          })
          .catch((err) => reject(err))
          .finally(() => {
            itemsLeft--;
            if (itemsLeft === 0) {
              resolve(allResults);
            }
          });
      } else {
        const isMatch = predicate(maybePromise);
        if (isMatch) allResults.push(maybePromise);
        itemsLeft--;
        if (itemsLeft === 0) {
          resolve(allResults);
        }
      }
    }
  });
}

function isPromise<T>(maybe: MaybePromise<T>): maybe is Promise<T> {
  return maybe instanceof Promise;
}
