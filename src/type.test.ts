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
});
