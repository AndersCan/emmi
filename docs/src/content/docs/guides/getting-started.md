---
title: Getting started
description: Getting started with emmi
---

**Emmi** is an event emitter made to enable splitting larger tasks into more manageable pieces.

## Creating an event emitter

Creating an event emitter is just a function call.

```js
import { emmi } from "emmi";

const emitter = emmi();
```

In order for it to be fully typesafe, you have define the events that the event emitter will handle

```js
const emitter = emmi<{
  my_event_name: {
    input: "my_event_input";
    output: "my_event_output";
  };
}>();

// now we can emit typesafe events
emitter.on("my_event_name", (input: "my_event_input") => {
  return "my_event_output";
});
```

Unlike most event emitters (that I have seen), emmi actually returns a value on `emit`. The value is all the results returned from listeners.

```js
const result = emitter.emit( "test", "my_event_input" ); // ["my_event_output"]
```

Note: The result is within an array as there can be multiple listeners registered to the same event.
