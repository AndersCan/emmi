import { expect, test, describe } from "vitest";
import { emmi } from "./index";

describe("emmi", () => {
  test("fires on", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    m.on("test", (input) => {
      expect(input).toEqual("input");
      return "output";
    });

    expect(m.emit("test", "input")).toEqual(["output"]);
  });

  test("fires onReply", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    m.on("test", (input) => {
      expect(input).toEqual("input");
      return "output";
    });

    m.onReply("test", (output) => {
      console.log("onReply", output);
      expect(output).toEqual(["output"]);
    });

    expect(m.emit("test", "input")).toEqual(["output"]);
  });
});
