# emmi

> WIP

Inspired by [mitt](https://github.com/developit/mitt/tree/main), but with a few modifications. Main difference is that events are typed with an `input` and `output` field.

This enables:

- calling `emit` returns an `Output[]` value.
  - listeners can directly respond to your events
- You can listen to event replies with `onReply`

Other that that, should be similar to other event emitter libraries.

## Listeners

Listeners can return the `Output` type, or simply omit returning anything. For convenience, listeners that return `undefined`/`void` will not be added to the `Output[]` result of an `emit`.

Note that async functions that return `undefined` (`Promise<undefined>`) **will** be returned
