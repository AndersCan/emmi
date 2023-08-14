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
});

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function identity<T>(id: T) {
  return id;
}
