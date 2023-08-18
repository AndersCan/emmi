import { describe, expect, test } from "vitest";
import { markForSpread } from "./helpers";
import { emmi } from "./index";

describe("basic tests", () => {
  test("fires on", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    m.on( "test", ( input ) => {
      expect( input ).toEqual( "input" );
      return "output";
    } );

    expect( m.emit( "test", "input" ) ).toEqual( [ "output" ] );
  });

  test("on replies removes undefined", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: undefined;
      };
    }>();

    m.on( "test", ( input ) => {
      expect( input ).toEqual( "input" );
      return undefined;
    } );

    expect( m.emit( "test", "input" ) ).toEqual( [] );
  });

  test("fires onReply", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    m.on( "test", ( input ) => {
      expect( input ).toEqual( "input" );
      return "output";
    } );

    m.onReply( "test", ( input, output ) => {
      expect( input ).toEqual( "input" );
      expect( output ).toEqual( [ "output" ] );
    } );

    expect( m.emit( "test", "input" ) ).toEqual( [ "output" ] );
  });

  test("fires onReply - 2 listeners", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    let i = 0;

    m.onReply( "test", ( input, output ) => {
      i++;
      expect( input ).toEqual( "input" );
      expect( output ).toEqual( [] );
    } );

    m.onReply( "test", ( input, output ) => {
      i++;
      expect( input ).toEqual( "input" );
      expect( output ).toEqual( [] );
    } );

    expect( m.emit( "test", "input" ) ).toEqual( [] );
    expect( i ).toEqual( 2 );
  });

  test("off", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    const handler = ( input: "input" ): "output" => {
      expect( input ).toEqual( "input" );
      return "output";
    };
    m.on( "test", handler );
    expect( m.emit( "test", "input" ) ).toEqual( [ "output" ] );
    m.off( "test", handler );
    expect( m.emit( "test", "input" ) ).toEqual( [] );
  });

  test("off all", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    const handler = ( input: "input" ): "output" => {
      expect( input ).toEqual( "input" );
      return "output";
    };
    m.on( "test", handler );
    m.on( "test", () => {
      const x = "output" as const;
      return x;
    } );
    m.off( "test" );
    expect( m.emit( "test", "input" ) ).toEqual( [] );
  });

  test("offReply", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output" | undefined;
      };
    }>();

    const handler = ( input: "input", output: "output"[] ) => {
      expect( input ).toEqual( "input" );
      expect( output ).toEqual( [] );
    };
    m.onReply( "test", handler );
    expect( m.emit( "test", "input" ) ).toEqual( [] );
    m.offReply( "test", handler );
    expect( m.emit( "test", "input" ) ).toEqual( [] );
  });

  test("offReply - undefined", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    const handler = ( input: "input", output: "output"[] ) => {
      expect( input ).toEqual( "input" );
      expect( output ).toEqual( [] );
    };
    m.onReply( "test", handler );
    expect( m.emit( "test", "input" ) ).toEqual( [] );
    m.offReply( "test", handler );
    expect( m.emit( "test", "input" ) ).toEqual( [] );
  });

  test("offReply all", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    let i = 0;

    m.onReply( "test", ( input, output ) => {
      i++;
      expect( input ).toEqual( "input" );
      expect( output ).toEqual( [] );
    } );

    expect( m.emit( "test", "input" ) ).toEqual( [] );
    expect( i ).toEqual( 1 );

    m.offReply( "test" );

    expect( m.emit( "test", "input" ) ).toEqual( [] );
    expect( i ).toEqual( 1 );
  });
});
describe("can mark with custom metadata", () => {
  const meta = Symbol( "meta" );
  test("can mark emitted responses", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: {
          id: string;
        };
      };
    }>();

    m.on( "test", ( input ) => {
      return { id: input };
    } );

    const id = Math.random();
    m.onReply( "test", ( _input, output ) => {
      // @ts-expect-error
      output[meta] = id;
    } );

    const data = m.emit( "test", "input" );

    // Not completely equal as we have added a `symbol`
    expect( data[0] ).toEqual( { id: "input" } );
    // @ts-expect-error
    expect( data[meta] ).toEqual( id );
  });
});

describe("options - spread", () => {
  test("on can spread array with options", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    m.on( "test", ( input ) => {
      expect( input ).toEqual( "input" );
      return markForSpread( [ "output", "output", "output" ] );
    } );

    expect( m.emit( "test", "input" ) ).toEqual( [
      "output",
      "output",
      "output",
    ] );
  });

  test("on - spreadFalse", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    m.on( "test", ( input ) => {
      expect( input ).toEqual( "input" );
      return "output";
    } );

    expect( m.emit( "test", "input" ) ).toEqual( [ "output" ] );
  });
});

describe("wildcard", () => {
  test("fires on", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    m.on( "test", ( input ) => {
      expect( input ).toEqual( "input" );
      return "output";
    } );

    let key = "";
    let input = "";
    m.on("*", (_key, _input) => {
      console.log({_key,_input})
      key = _key, input = _input;
    } );

    expect( m.emit( "test", "input" ) ).toEqual( [ "output" ] );
    expect( key ).toEqual( "test" );
    expect( input ).toEqual( "input" );
  });
});
