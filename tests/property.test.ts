import { markForSpread } from "#src/helpers";
import { emmi, Event } from "#src/index";
import * as fc from "fast-check";
import { describe, expect, test } from "vitest";

describe("property", () => {
  test("can return anything (non-undefined)", () => {
    const m = emmi<{
      test: Event<unknown, unknown>;
    }>();

    m.on( "test", ( input ) => {
      return input;
    } );

    m.onReply( "test", ( input, output ) => {
      expect( [ input ] ).toEqual( output );
    } );

    fc.assert(
      fc.property( fc.anything().filter(a => a !== undefined), ( a ) => {
        const result = m.emit( "test", a );
        expect( result ).toEqual( [ a ] );
      } ),
    );
  });

  test("can spread any array", () => {
    const m = emmi<{
      test: Event<unknown[], unknown>;
    }>();

    m.on( "test", ( input ) => {
      return markForSpread( input );
    } );

    m.onReply( "test", ( input, output ) => {
      expect( [ ...input ] ).toEqual( output );
    } );

    fc.assert(
      fc.property(
        fc.array( fc.anything().filter(a => a !== undefined) ),
        ( a ) => {
          const result = m.emit( "test", a );
          expect( result ).toEqual( [ ...a ] );
        },
      ),
    );
  });
});
