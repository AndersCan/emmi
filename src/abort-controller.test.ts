import { expect, test, describe } from "vitest";
import { emmi } from "./index";

/**
 * sanity checks usability
 */
describe("abort-controller", () => {
  test("can send signal and abort", async () => {
    const m = emmi<{
      test: {
        input: AbortSignal;
        output: Promise<"ok" | "abort">;
      };
    }>();

    m.on("test", (signal) => {
      return sleep(50, signal).then((result) => result);
    });

    {
      const controller = new AbortController();
      const reply = Promise.all(m.emit("test", controller.signal));
      expect(await reply).toEqual(["ok"]);
    }
    {
      const controller = new AbortController();
      const reply = Promise.all(m.emit("test", controller.signal));
      controller.abort();
      expect(await reply).toEqual(["abort"]);
    }
  });

  test("can send abort", async () => {
    const m = emmi<{
      test: {
        input: AbortController;
        output: Promise<"ok" | "abort" | "override">;
      };
    }>();

    m.on("test", (signal) => {
      return sleep(10, signal.signal).then((result) => result);
    });

    {
      const controller = new AbortController();
      const reply = Promise.all(m.emit("test", controller));
      expect(await reply).toEqual(["ok"]);
    }

    m.on("test", async (signal) => {
      await sleep(10);
      signal.abort();
      return sleep(10).then(() => "override");
    });

    {
      const controller = new AbortController();
      const reply = Promise.all(m.emit("test", controller));
      controller.abort();
      expect(await reply).toEqual(["abort", "override"]);
    }
  });
});

function sleep(ms: number, signal?: AbortSignal): Promise<"ok" | "abort"> {
  if (signal && signal.aborted) {
    return Promise.resolve("abort");
  }
  return new Promise((resolve) => {
    let it = setTimeout(resolve, ms, "ok");
    signal &&
      signal.addEventListener("abort", () => {
        clearTimeout(it);
        resolve("abort");
      });
  });
}
