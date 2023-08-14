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

  test("on replies removes undefined", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: undefined;
      };
    }>();

    m.on("test", (input) => {
      expect(input).toEqual("input");
      return undefined;
    });

    expect(m.emit("test", "input")).toEqual([]);
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
      expect(output).toEqual(["output"]);
    });

    expect(m.emit("test", "input")).toEqual(["output"]);
  });

  test("off", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    const handler = (input: "input"): "output" => {
      expect(input).toEqual("input");
      return "output";
    };
    m.on("test", handler);
    expect(m.emit("test", "input")).toEqual(["output"]);
    m.off("test", handler);
    expect(m.emit("test", "input")).toEqual([]);
  });

  test("off all", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    const handler = (input: "input"): "output" => {
      expect(input).toEqual("input");
      return "output";
    };
    m.on("test", handler);
    m.on("test", () => "output");
    m.off("test");
    expect(m.emit("test", "input")).toEqual([]);
  });
});
