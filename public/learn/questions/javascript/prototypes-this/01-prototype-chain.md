# Prototype chain and inheritance

> JavaScript's inheritance model is prototype-based, not class-based. The `class` syntax is sugar over the same mechanism.

## How property lookup works

Every object has an internal `[[Prototype]]` link (accessible via `Object.getPrototypeOf(obj)` or `.__proto__`). When you access a property, the engine walks the chain:

```
obj → obj.__proto__ → obj.__proto__.__proto__ → … → null
```

First match wins. If nothing is found, `undefined` is returned.

```js
const animal = { breathes: true };
const dog = Object.create(animal);
dog.bark = function () { return 'woof'; };

console.log(dog.bark());     // 'woof' — own property
console.log(dog.breathes);   // true — found on prototype
console.log(dog.hasOwnProperty('breathes')); // false
```

## Constructor functions

Before `class`, this was the pattern:

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound.`;
};

function Dog(name) {
  Animal.call(this, name); // inherit properties
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function () { return 'woof'; };

const d = new Dog('Rex');
d.speak(); // 'Rex makes a sound.'
d.bark();  // 'woof'
```

## `Object.create` vs `new`

```js
const proto = { greet() { return 'hi'; } };

const a = Object.create(proto); // proto is a's [[Prototype]]
const b = new Object();         // Object.prototype is b's [[Prototype]]
```

`Object.create(null)` creates an object with **no prototype** — useful for pure dictionaries.

## Checking the chain

```js
d instanceof Dog;    // true — Dog.prototype is in d's chain
d instanceof Animal; // true — Animal.prototype is also in the chain

Object.getPrototypeOf(d) === Dog.prototype;     // true
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // true
```

## Senior follow-ups

- **"What's the difference between own and inherited properties?"** `hasOwnProperty` / `Object.hasOwn` checks only own properties. `in` checks the full chain. `for...in` iterates the full chain (including inherited enumerable properties).
- **"Why should you avoid `__proto__`?"** It's a deprecated accessor. Use `Object.getPrototypeOf` / `Object.setPrototypeOf` instead.
- **"What happens if you mutate a prototype after instances are created?"** Instances pick up the change immediately, since lookup is live. This is both powerful and dangerous.
