export type Event<Input, Output> = {
  input: Input;
  output: Output | undefined | void;
};

type EventMap = Record<string, Event<unknown, unknown>>;
type NonUndefined<T> = T extends undefined | void ? never : T;

export function emmi<EMap extends EventMap>() {
  const listeners = new Map<
    keyof EMap,
    Array<(args: EMap[keyof EMap]["input"]) => EMap[keyof EMap]["output"]>
  >();

  const replyListeners = new Map<
    keyof EMap,
    Array<
      (
        input: EMap[keyof EMap]["input"],
        output: NonUndefined<EMap[keyof EMap]["output"]>[],
      ) => void
    >
  >();

  /**
   * Fired when the provided `key` is emitted
   */
  function on<Key extends keyof EMap>(
    key: Key,
    listener: (args: EMap[Key]["input"]) => EMap[Key]["output"],
  ) {
    const handlers = listeners.get(key);
    if (handlers) {
      handlers.push(listener);
    } else {
      listeners.set(key, [listener]);
    }
  }

  /**
   * Fired when the provided `key` generates a reply from within an `on` listener.
   */
  function onReply<Key extends keyof EMap>(
    key: Key,
    listener: (
      input: EMap[Key]["input"],
      output: NonUndefined<EMap[Key]["output"]>[],
    ) => void,
  ) {
    const handlers = replyListeners.get(key);
    if (handlers) {
      handlers.push(listener);
    } else {
      replyListeners.set(key, [listener]);
    }
  }

  /**
   * Emits an event and return the replies, if any.
   */
  function emit<Key extends keyof EMap>(
    key: Key,
    data: EMap[Key]["input"],
  ): NonUndefined<EMap[Key]["output"]>[] {
    let replies: NonUndefined<EMap[keyof EMap]["output"]>[] = [];

    const l = listeners.get(key) || [];
    let i = -1;
    while (l.length > ++i) {
      const fn = l[i];
      const res = fn(data);
      isDefined(res) && replies.push(res);
    }

    const rl = replyListeners.get(key) || [];
    i = -1;
    while (rl.length > ++i) {
      const fn = rl[i];
      fn(data, replies);
    }
    return replies;
  }

  /**
   * Remove listener. If listener is undefined, removes all listeners for that type
   */
  function off<Key extends keyof EMap>(
    key: Key,
    listener?: (args: EMap[Key]["input"]) => EMap[Key]["output"],
  ) {
    if (listener === undefined) {
      listeners.set(key, []);
      return;
    }

    const handlers = listeners.get(key);
    if (handlers) {
      handlers.splice(handlers.indexOf(listener) >>> 0, 1);
    }
  }

  /**
   * Remove reply listener. If listener is undefined, removes all listeners for that type
   */
  function offReply<Key extends keyof EMap>(
    key: Key,
    listener?: (
      input: EMap[Key]["input"],
      output: EMap[Key]["output"][],
    ) => void,
  ) {
    if (listener === undefined) {
      replyListeners.set(key, []);
      return;
    }

    const handlers = replyListeners.get(key);
    if (handlers) {
      const index = handlers.indexOf(listener);
      index !== -1 && handlers.splice(index, 1);
    }
  }

  return {
    on,
    emit,
    onReply,
    off,
    offReply,
  };
}

function isDefined<T>(t: T): t is NonUndefined<T> {
  return t !== undefined;
}
