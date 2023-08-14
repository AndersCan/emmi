# emmi

> WIP

Inspired by [mitt](https://github.com/developit/mitt/tree/main), but with a few modifications. Main change is that events are typed with an `input` and `output` field.

This enables:

- `emit` returns an `Output[]` type when emitting an event.
- You can listen to event replies with `onReply`
