# class syntax vs prototype

> `class` is syntactic sugar over prototypes. Understanding what it compiles to avoids surprises.

## What `class` desugars to

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound.`;
  }
}
```

Is roughly equivalent to:

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound.`;
};
```

Methods defined in the class body go on `Animal.prototype`, not on each instance.

## Inheritance

```js
class Dog extends Animal {
  constructor(name) {
    super(name); // must call before using `this`
  }
  bark() { return 'woof'; }
}

const d = new Dog('Rex');
d.speak(); // 'Rex makes a sound.' — from Animal.prototype
d.bark();  // 'woof' — from Dog.prototype
```

`extends` sets up `Dog.prototype.__proto__ === Animal.prototype`.

## Key differences from plain functions

| | `class` | Constructor function |
|---|---|---|
| Callable without `new` | TypeError | Returns `undefined` (or wrong object) |
| `prototype.constructor` | Set automatically | Must set manually |
| `super` keyword | Available | Manual `ParentFn.call(this, ...)` |
| Hoisted | No (TDZ) | Yes |
| Strict mode | Always | Only if declared |

## Private fields (ES2022)

Real privacy, not convention:

```js
class BankAccount {
  #balance = 0; // truly private

  deposit(amount) { this.#balance += amount; }
  get balance()  { return this.#balance; }
}

const acc = new BankAccount();
acc.deposit(100);
acc.balance;   // 100
acc.#balance;  // SyntaxError — not accessible outside
```

## Static methods and fields

```js
class MathHelper {
  static PI = 3.14159;
  static circle(r) { return MathHelper.PI * r * r; }
}

MathHelper.circle(5); // called on the class, not an instance
```

## Senior follow-ups

- **"Is `class` truly syntax sugar?"** Mostly, but with differences: classes are not hoisted, always strict, and `super` has no equivalent with raw prototypes. Private fields (`#`) have no prototype equivalent at all.
- **"When would you use composition over inheritance?"** When a class would inherit behavior it doesn't need (violates Liskov), when the hierarchy is deep and brittle, or when you need to mix behaviors from multiple sources (JS has no multiple inheritance).
- **"What does `Object.getOwnPropertyNames(Dog.prototype)` return?"** `['constructor', 'bark']` — only methods defined directly on `Dog.prototype`, not inherited ones.
