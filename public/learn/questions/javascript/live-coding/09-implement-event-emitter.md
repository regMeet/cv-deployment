# Implement EventEmitter (on / off / emit)

> Tests object design, closures, and event-driven architecture. Common in Node.js-flavored interviews.

## Problem

Implement an `EventEmitter` class with:
- `on(event, listener)` — subscribe
- `off(event, listener)` — unsubscribe
- `emit(event, ...args)` — call all listeners for the event
- `once(event, listener)` — subscribe for one invocation only

```js
const emitter = new EventEmitter();

function onData(data) { console.log('received:', data); }

emitter.on('data', onData);
emitter.emit('data', 42);    // 'received: 42'
emitter.off('data', onData);
emitter.emit('data', 99);    // (nothing)
```

## Solution

```js
class EventEmitter {
  #listeners = new Map(); // event → Set of listeners

  on(event, listener) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, new Set());
    }
    this.#listeners.get(event).add(listener);
    return this; // allow chaining
  }

  off(event, listener) {
    this.#listeners.get(event)?.delete(listener);
    return this;
  }

  emit(event, ...args) {
    const listeners = this.#listeners.get(event);
    if (!listeners) return false;
    listeners.forEach(fn => fn(...args));
    return true;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }
}
```

**Design notes:**
- `Set` over `Array` for listeners: O(1) delete, natural deduplication.
- Private `#listeners` prevents external mutation.
- `emit` returns `true` if there were listeners (same as Node.js).
- `once` wraps the listener in a self-removing wrapper.

## Usage

```js
const emitter = new EventEmitter();

emitter
  .on('connect', () => console.log('connected'))
  .on('data', (d) => console.log('data:', d))
  .once('close', () => console.log('closed once'));

emitter.emit('connect');   // 'connected'
emitter.emit('data', 123); // 'data: 123'
emitter.emit('close');     // 'closed once'
emitter.emit('close');     // (nothing — once removed itself)
```

## Edge cases to mention

```js
// Emitting an event with no listeners — doesn't throw
emitter.emit('unknown'); // returns false

// off() on a non-existent event — doesn't throw
emitter.off('unknown', fn); // safe (optional chaining)

// Mutating listeners inside emit — can cause bugs
// Safe version: copy listeners before iterating
emit(event, ...args) {
  const listeners = this.#listeners.get(event);
  if (!listeners) return false;
  [...listeners].forEach(fn => fn(...args)); // copy first
  return true;
}
```

## Senior follow-ups

- **"Why `Set` instead of `Array` for listeners?"** Deduplication is automatic and `delete` is O(1). Downside: insertion order is preserved in `Set`, which is fine here.
- **"How would you add a `removeAllListeners(event)` method?"** `this.#listeners.delete(event)` — removes the entire Set for that event.
- **"How does Node.js warn about memory leaks?"** Node's `EventEmitter` warns if more than 10 listeners are added to a single event (configurable with `setMaxListeners`). This catches the common bug of calling `on` in a loop without `off`.
