import { expect, test, describe } from "vitest";
import { mitti } from "./index";

describe("mitti", () => {
  test("fires on", () => {
    const m = mitti<{
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
    const m = mitti<{
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
