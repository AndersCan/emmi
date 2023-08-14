type Event<Input, Output> = {
  input: Input;
  output: Output;
};

type EventMap = Record<string, Event<unknown, unknown>>;

export function emmi<EMap extends EventMap>() {
  const listeners = new Map<
    keyof EMap,
    Array<(args: EMap[string]["input"]) => EMap[string]["output"]>
  >();

  const replyListeners = new Map<
    keyof EMap,
    Array<(input: EMap[string]["output"]) => void>
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
    listener: (args: EMap[Key]["output"]) => void,
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
  ): EMap[Key]["output"][] {
    const replies = (listeners.get(key) || []).map((fn) => fn(data));
    (replyListeners.get(key) || []).forEach((fn) => fn(replies));
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
    listener?: (args: EMap[Key]["input"]) => EMap[Key]["output"],
  ) {
    if (listener === undefined) {
      replyListeners.set(key, []);
      return;
    }

    const handlers = replyListeners.get(key);
    if (handlers) {
      handlers.splice(handlers.indexOf(listener) >>> 0, 1);
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
