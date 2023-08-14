type MaybePromise<T> = T | Promise<T>;

export function find<T>(
  arr: MaybePromise<T>[],
  predicate: (t: T) => boolean,
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    let done = false;

    let itemsLeft = arr.length;
    const length = arr.length;
    let i = -1;
    while (done === false && length > ++i) {
      const maybePromise = arr[i];
      if (isPromise(maybePromise)) {
        maybePromise
          .then((result) => {
            if (done) return;
            if (predicate(result)) {
              done = true;
              resolve(result);
            }
          })
          .catch((err) => reject(err))
          .finally(() => {
            itemsLeft--;
            if (itemsLeft === 0) {
              resolve(undefined);
            }
          });
      } else {
        const r = predicate(maybePromise);
        if (r) resolve(maybePromise);
        itemsLeft--;
        if (itemsLeft === 0) {
          resolve(undefined);
        }
      }
    }
  });
}

function isPromise<T>(maybe: MaybePromise<T>): maybe is Promise<T> {
  return maybe instanceof Promise;
}
