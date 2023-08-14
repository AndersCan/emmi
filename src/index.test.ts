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

    m.onReply("test", (input, output) => {
      expect(input).toEqual("input");
      expect(output).toEqual(["output"]);
    });

    expect(m.emit("test", "input")).toEqual(["output"]);
  });

  test("fires onReply - 2 listeners", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    let i = 0;

    m.onReply("test", (input, output) => {
      i++;
      expect(input).toEqual("input");
      expect(output).toEqual([]);
    });

    m.onReply("test", (input, output) => {
      i++;
      expect(input).toEqual("input");
      expect(output).toEqual([]);
    });

    expect(m.emit("test", "input")).toEqual([]);
    expect(i).toEqual(2);
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

  test("offReply", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output" | undefined;
      };
    }>();

    const handler = (input: "input", output: "output"[]) => {
      expect(input).toEqual("input");
      expect(output).toEqual([]);
    };
    m.onReply("test", handler);
    expect(m.emit("test", "input")).toEqual([]);
    m.offReply("test", handler);
    expect(m.emit("test", "input")).toEqual([]);
  });

  test("offReply - undefined", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    const handler = (input: "input", output: "output"[]) => {
      expect(input).toEqual("input");
      expect(output).toEqual([]);
    };
    m.onReply("test", handler);
    expect(m.emit("test", "input")).toEqual([]);
    m.offReply("test", handler);
    expect(m.emit("test", "input")).toEqual([]);
  });

  test("offReply all", () => {
    const m = emmi<{
      test: {
        input: "input";
        output: "output";
      };
    }>();

    let i = 0;

    m.onReply("test", (input, output) => {
      i++;
      expect(input).toEqual("input");
      expect(output).toEqual([]);
    });

    expect(m.emit("test", "input")).toEqual([]);
    expect(i).toEqual(1);

    m.offReply("test");

    expect(m.emit("test", "input")).toEqual([]);
    expect(i).toEqual(1);
  });
});
