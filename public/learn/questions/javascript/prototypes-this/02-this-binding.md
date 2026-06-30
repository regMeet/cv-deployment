# this — the 4 binding rules

> `this` is determined at **call time**, not at definition time (except for arrow functions). There are exactly four rules, applied in priority order.

## Rule 1 — `new` binding (highest priority)

`new` creates a new object and binds `this` to it.

```js
function Person(name) {
  this.name = name; // `this` is the new object
}
const p = new Person('Ana');
p.name; // 'Ana'
```

## Rule 2 — Explicit binding (`call` / `apply` / `bind`)

```js
function greet() { return `Hi, ${this.name}`; }

const user = { name: 'Ana' };

greet.call(user);          // 'Hi, Ana' — temporary binding
greet.apply(user);         // 'Hi, Ana' — same, but args as array
const greetAna = greet.bind(user);
greetAna();                // 'Hi, Ana' — permanent binding
```

`bind` returns a new function with `this` permanently fixed.

## Rule 3 — Implicit binding (method call)

`this` is the object to the left of the dot at call time.

```js
const obj = {
  name: 'Ana',
  greet() { return `Hi, ${this.name}`; },
};

obj.greet(); // 'Hi, Ana'

const fn = obj.greet;
fn(); // 'Hi, undefined' — lost implicit binding!
```

The **lost binding** trap: storing a method reference drops the object context.

## Rule 4 — Default binding (lowest priority)

In non-strict mode, `this` defaults to the global object. In strict mode, it's `undefined`.

```js
function show() { console.log(this); }
show(); // window (non-strict) / undefined (strict)
```

## Arrow functions — no own `this`

Arrow functions don't have their own `this`. They inherit it from the **enclosing lexical scope** at definition time. `call`/`apply`/`bind` have no effect on them.

```js
const obj = {
  name: 'Ana',
  greet: () => `Hi, ${this.name}`, // `this` is the outer scope, NOT obj
};
obj.greet(); // 'Hi, undefined'

// Common correct pattern — arrow inside method:
const obj2 = {
  name: 'Ana',
  greetLater() {
    setTimeout(() => console.log(this.name), 100); // `this` = obj2
  },
};
```

## Priority order

```
new  >  explicit (call/apply/bind)  >  implicit (obj.fn())  >  default
```

## Senior follow-ups

- **"Why does `setTimeout(obj.method, 0)` lose `this`?"** The callback is stored as a plain reference — no object to its left when called. Use `.bind(obj)` or an arrow wrapper.
- **"Can you bind an arrow function?"** You can call `.bind` on it syntactically, but it has no effect — the arrow's `this` is already fixed.
- **"What is `this` inside a class?"** The instance. Class bodies are implicitly in strict mode, so default binding gives `undefined`, not `window`.
