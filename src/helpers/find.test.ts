import { expect, test, describe } from "vitest";
import { find } from "./index";

/**
 * sanity checks usability
 */
describe("find", () => {
  test("has expected behavior", async () => {
    {
      const arr = [identity(1), identity(2), identity(3)];
      const actual = await find(arr, (value) => value === -1);
      expect(actual).toEqual(undefined);
    }

    {
      const arr = [identity(1), identity(2), identity(3)];
      const actual = await find(arr, (value) => value === 3);
      expect(actual).toEqual(3);
    }

    {
      const arr = [identity(1), identity(2), sleep(5).then(() => identity(3))];
      const actual = await find(arr, (value) => value === 3);
      expect(actual).toEqual(3);
    }

    {
      const arr = [identity(1), identity(2), identity(3), 10];
      const actual = await find(arr, (value) => value % 2 === 0);
      expect(actual).toEqual(10);
    }
  });

  test("searches left to right", async () => {
    const arr = [identity(1), identity(2), identity(4)];
    const actual = await find(arr, (value) => value % 2 === 0);
    expect(actual).toEqual(2);
  });

  test("can return different type", async () => {
    const arr = [identity(1), identity(2), identity(4)];
    const fn = (value: number) => (value === 2 ? value : undefined);
    const actual: 2 | undefined = await find(arr, fn);
    expect(actual).toEqual(2);
  });
});

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function identity<T>(id: T) {
  return id;
}
