---
title: Project goals
description: Goals wished to be achieved
---

The main goal is simple: Enable splitting logic into smaller, more manageable pieces.

Below are some trivial examples, that I would not necessarily recommend need an event emitter. They are just meant to to showcase some ideas.

## Replacing specific imports

```ts
import { metrics } from "./metrics.js";

function add( a: number, b: number ) {
  metrics.increment( "add called" );
  return a + b;
}
```

In the above code, `add` needs to know where to import metrics from, either `./browser` or `./server` depending on the current context.

:::note
This could be further complicated if `metrics` should be imported from a different path if the current environment is a browser or a server (`./browser/metrics.js` or `./server/metrics.js`).
:::

We can remove the `import` requirement of metrics here, by instead emitting an event (that has been defined elsewhere).

```ts
import { emitter } from "./my-emitter.js";

function add( a: number, b: number ) {
  emitter.emit( "metrics", { type: "increase", label: "add called" } );
  return a + b;
}
```

Now `add` does not need to know how, or where to import metrics from, just that it needs to emit an event for metrics. Somewhere else in the app, a listener should be registered that takes care of handling the event.

## Everything is an event

We could take this one step further (for no other reason than just to show it's possible)

```ts
import { emitter } from "./my-emitter.js";

function add( a: number, b: number ) {
  const [ result ] = emitter.emit( "add", { a, b } );
  return result;
}

// elsewhere in the app

emitter.on( "add", ( { a, b } ) => a + b );
emitter.on( "add", () => {
  emitter.emit( "metrics", { type: "increase", label: "add called" } );
  return;
} );
```

Now `add` itself is really just an event. The function `add` no longer even knows its own implementation. Metrics are also handled elsewhere, without `add` needing to handle it.

:::tip
If `metrics` needed to also know the result of add, you could use `onReply`

```ts
emitter.onReply( "add", ( { a, b }, [ result ] ) => {
  emitter.emit( "metrics", {
    type: "increase",
    label: `add(${a}, ${b}) equals ${result}`,
  } );
  return;
} );
```

:::
