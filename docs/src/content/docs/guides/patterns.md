---
title: Patterns
description: Patterns that emmi enables
---

> WIP

In no particular order, some patterns that emmi enables. Please note that some of these are valid for most event emitter libraries.

## Isomorphic apps

If you are running your application in both a browser and on the server (node). You will need someway of handling _server_ and _browser_ only code. For example, on the server you most likely want to use a logger like [`pino`](https://github.com/pinojs/pino), but in the browser you don't want any logging or just `console.log`.

```ts
const emitter = emmi<{
  log: {
    input: {
      level: "error" | "warn" | "info";
      message: unknown[];
    };
    output: void;
  };
}>();

// node
import pino from "pino";
const logger = pino();
emitter.on( log, ( { level, message } ) => logger[level]( ...message ) );

// browser (or just don't add a listener to ignore)
emitter.on( log, ( { level, message } ) => console.log( ...message ) );
```
