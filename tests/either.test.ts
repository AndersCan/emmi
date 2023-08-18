import { emmi } from "#src/index";
import { describe, expect, test } from "vitest";

type Either<L, R> = [ L, undefined ] | [ undefined, R ];

/**
 * sanity checks usability
 */
describe("either", () => {
  test("can return promise", () => {
    const m = emmi<{
      test: {
        input: number;
        output: Either<"ODD", "EVEN">;
      };
    }>();

    m.on( "test", ( input ) => {
      return input % 2 !== 0 ? [ "ODD", undefined ] : [ undefined, "EVEN" ];
    } );

    {
      const [ [ odd, even ] ] = m.emit( "test", 1 );
      expect( odd ).toEqual( "ODD" );
      expect( even ).toEqual( undefined );
    }
    {
      const [ [ odd, even ] ] = m.emit( "test", 2 );
      expect( odd ).toEqual( undefined );
      expect( even ).toEqual( "EVEN" );
    }
  });
});
