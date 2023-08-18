---
title: Getting started
description: Getting started with emmi
---

**Emmi** is an event emitter made to enable splitting larger tasks into more manageable pieces. This is explained in the example below

## Emmi basics

Creating an event emitter

```js
import { emmi } from "emmi";

const emitter = emmi();
```

In order for it to be type safe, you have define the events that the event emitter will handle.

```js
const emitter = emmi<{
  my_event_name: {
    input: "my_event_input";
    output: "my_event_output";
  };
}>();

// now we can listen to type safe events
emitter.on("my_event_name", (input: "my_event_input") => {
  return "my_event_output";
});

// and emit them
emitter.emit( "test", "my_event_input" );
```

Unlike most event emitters (that I have seen), emmi actually returns a value on `emit`. The value is all the results returned from the registered listeners.

```js
const result = emitter.emit( "test", "my_event_input" ); // ["my_event_output"]
```

:::note
The result will always be an array, as there can be multiple listeners registered to the same event.
:::

:::tip
If you are already using an event emitter, you could achieved the same effect by emitting a callback function that you listeners will call.
:::
