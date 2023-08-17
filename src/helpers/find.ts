import { iterate, type MaybePromise } from "./iterate.js";

type NotBoolean<S> = S extends boolean ? never : S;

/**
 * find element that matches a predicate
 *
 * Can alter return type by returning a non-boolean value
 * @example
 * const foo: "foo" = find(arr, (item) => item === 'foo' ? item : foo)
 */
export function find<T, S>(
  arr: MaybePromise<T>[],
  predicate: ( t: T ) => NotBoolean<S> | undefined,
): Promise<NotBoolean<S> | undefined>;
export function find<T>(
  arr: MaybePromise<T>[],
  predicate: ( t: T ) => boolean,
): Promise<T | undefined>;
export function find<T>(
  arr: MaybePromise<T>[],
  predicate: ( t: T ) => boolean,
): Promise<T | undefined> {
  let done = false;
  return new Promise( ( resolve, reject ) => {
    return iterate( arr, ( element, itemsLeft ) => {
      if ( !done && predicate( element ) ) {
        done = true;
        resolve( element );
      }

      if ( itemsLeft === 0 ) resolve( undefined );
    } ).catch( reject );
  } );
}
