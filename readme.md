# emmi

> WIP

Inspired by [mitt](https://github.com/developit/mitt/tree/main), but with a large modification: listeners return a response to the `emit` caller.

When defining an event i `emmi`, you need to type it with an `input` and `output` field. Calling `emit` will return an `Output[]` value. `Output` can be anything you want.

Also added an `onReply` listener that receives the `Input` and `Output[]` result of an `emit`.

This enables some interesting patterns not possible with most event emitters.

## Listeners

Listeners can return the `Output` type, or simply omit returning anything. For convenience, listeners that return `undefined`/`void` will not be added to the `Output[]` result of an `emit`.

Note that async functions that return `undefined` (`Promise<undefined>`) **will** be returned
