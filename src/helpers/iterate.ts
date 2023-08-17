export type MaybePromise<T> = T | Promise<T>;

/**
 * Iterate over an array containing `MaybePromise`s
 */
export function iterate<T>(
  arr: MaybePromise<T>[],
  callback: ( value: T, itemsLeft: number ) => void | Promise<void>,
): Promise<void> {
  return new Promise( ( resolve, reject ) => {
    let itemsLeft = arr.length;
    const length = arr.length;
    let i = -1;
    while ( length > ++i ) {
      const maybePromise = arr[i];
      if ( isPromise( maybePromise ) ) {
        maybePromise
          .then( ( result ) => {
            itemsLeft--;
            callback( result, itemsLeft );
          } )
          .catch(( err ) => reject( err ))
          .finally( () => {
            if ( itemsLeft === 0 ) {
              resolve();
            }
          } );
      } else {
        itemsLeft--;
        callback( maybePromise, itemsLeft );
        if ( itemsLeft === 0 ) {
          resolve();
        }
      }
    }
  } );
}

function isPromise<T>( maybe: MaybePromise<T> ): maybe is Promise<T> {
  return maybe instanceof Promise;
}
