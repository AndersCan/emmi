import { expect, test, describe } from "vitest";
import { filter } from "./index";

/**
 * sanity checks usability
 */
describe("filter", () => {
  test("has expected behavior", async () => {
    {
      const arr = [identity(1), identity(2), identity(3), identity(4)];
      const actual = await filter(arr, (value) => value % 2 === 0);
      expect(actual).toEqual([2, 4]);
    }

    {
      const arr = [identity(1), identity(2), sleep(5).then(() => identity(4))];
      const actual = await filter(arr, (value) => value % 2 === 0);
      expect(actual).toEqual([2, 4]);
    }
    {
      const arr = [
        sleep(5).then(() => identity(1)),
        sleep(5).then(() => identity(2)),
        sleep(5).then(() => identity(3)),
        sleep(5).then(() => sleep(5).then(() => identity(4))),
      ];
      const actual = await filter(arr, () => true);
      expect(actual).toEqual([1, 2, 3, 4]);
    }
  });

  test("sync values come first", async () => {
    const arr = [8, identity(1), identity(2), identity(3), identity(4), 6];
    const actual = await filter(arr, (value) => value % 2 === 0);
    expect(actual).toEqual([8, 6, 2, 4]);
  });

  test("searches left to right", async () => {
    const arr = [identity(1), identity(2), identity(4)];
    const actual = await filter(arr, (value) => value % 2 === 0);
    expect(actual).toEqual([2, 4]);
  });
  test("handles exception", async () => {
    const arr = [identity(1), identity(2), identity(3)];

    const actual = await filter(arr, () => {
      throw new Error("ops");
    }).catch(() => 1337);

    expect(actual).toEqual(1337);
  });
  test("can narrow type", async () => {
    const arr = [identity(1), identity(2), identity(3), identity(2)];
    const fn = (value: number) => (value === 2 ? value : undefined);
    const actual: 2[] = await filter(arr, fn);
    expect(actual).toEqual([2, 2]);
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
