import { expect, test, describe } from "vitest";
import { emmi, Event } from "./index";

type MaybePromise<T> = T | Promise<T>;

describe("types", () => {
  test("can use async functions", async () => {
    const m = emmi<{
      test: Event<"input", MaybePromise<"output">>;
    }>();

    m.on("test", (input) => {
      expect(input).toEqual("input");
      return "output";
    });

    m.on("test", (input) => {
      expect(input).toEqual("input");
      return Promise.resolve("output");
    });

    m.on("test", async (input) => {
      expect(input).toEqual("input");
      return "output" as const;
    });

    expect(await Promise.all(m.emit("test", "input"))).toEqual([
      "output",
      "output",
      "output",
    ]);
  });
  test("void and undefined are allowed as return type", async () => {
    const m = emmi<{
      test: Event<"input", "output">;
    }>();

    m.on("test", (input) => {
      expect(input).toEqual("input");
      return "output";
    });

    m.on("test", (input) => {
      expect(input).toEqual("input");
      return undefined;
    });

    m.on("test", (input) => {
      expect(input).toEqual("input");
    });
    const result: "output"[] = m.emit("test", "input");
    expect(result, "undefined values are removed").toEqual(["output"]);
  });
});
