import { expect, test, describe } from "vitest";
import { emmi } from "./index";
import { find } from "./helpers";

/**
 * sanity checks usability
 */
describe("promise", () => {
  test("can return promise", async () => {
    const m = emmi<{
      test: {
        input: "input";
        output: Promise<"output">;
      };
    }>();

    m.on("test", (input) => {
      expect(input).toEqual("input");
      return Promise.resolve("output");
    });
    expect(await Promise.all(m.emit("test", "input"))).toEqual(["output"]);
  });

  test("can return first promise by order", async () => {
    const m = emmi<{
      test: {
        input: "input";
        output: Promise<`output-${number}`>;
      };
    }>();

    m.on("test", (input) => {
      expect(input).toEqual("input");
      return Promise.resolve("output-1");
    });
    m.on("test", (input) => {
      expect(input).toEqual("input");
      return Promise.resolve("output-2");
    });
    const replies = m.emit("test", "input");
    expect(await Promise.any(replies)).toEqual("output-1");
  });

  test("can return first resolving promise", async () => {
    const m = emmi<{
      test: {
        input: "input";
        output: Promise<`output-${number}`>;
      };
    }>();

    m.on("test", (input) => {
      expect(input).toEqual("input");
      return sleep(5).then(() => "output-1");
    });
    m.on("test", (input) => {
      expect(input).toEqual("input");
      return Promise.resolve("output-2");
    });
    const replies = m.emit("test", "input");
    expect(await Promise.any(replies)).toEqual("output-2");
  });

  test("can return find result resolving promise", async () => {
    const m = emmi<{
      test: {
        input: "input";
        output: Promise<`output-${number}`>;
      };
    }>();

    m.on("test", (input) => {
      expect(input).toEqual("input");
      return sleep(5).then(() => "output-1");
    });
    m.on("test", (input) => {
      expect(input).toEqual("input");
      return Promise.resolve("output-2");
    });
    {
      const replies = find(m.emit("test", "input"), (t) => t === `output-1`);
      expect(await replies).toEqual("output-1");
    }

    {
      const replies = find(m.emit("test", "input"), (t) => t === `output-3`);
      expect(await replies).toEqual(undefined);
    }

    {
      try {
        await find(m.emit("test", "input"), (t) => {
          if (t === "output-1") throw new Error("ops!");
          return t === `output-3`;
        });
        expect(false).ok;
      } catch (err) {
        expect(err).toEqual(new Error("ops!"));
      }
    }
  });
});

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
