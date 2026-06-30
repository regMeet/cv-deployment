# Type guards — narrowing safely

> TypeScript narrows the type of a variable inside a branch based on checks you perform. Type guards are how you tell TypeScript which branch handles which type.

## Built-in narrowing

TypeScript understands these automatically:

```ts
function process(value: string | number) {
  if (typeof value === 'string') {
    value.toUpperCase(); // TypeScript knows: string
  } else {
    value.toFixed(2);   // TypeScript knows: number
  }
}
```

### `typeof` — for primitives

```ts
typeof x === 'string' | 'number' | 'boolean' | 'bigint' | 'symbol' | 'undefined' | 'function'
```

### `instanceof` — for class instances

```ts
function handleError(err: Error | string) {
  if (err instanceof TypeError) {
    console.log('Type error:', err.message);
  } else if (err instanceof Error) {
    console.log('Error:', err.message);
  } else {
    console.log('String:', err);
  }
}
```

### `in` — for object properties

```ts
type Dog = { bark(): void };
type Cat = { meow(): void };

function speak(animal: Dog | Cat) {
  if ('bark' in animal) {
    animal.bark(); // Dog
  } else {
    animal.meow(); // Cat
  }
}
```

### Truthiness narrowing

```ts
function greet(name: string | null) {
  if (name) {
    name.toUpperCase(); // string (null excluded)
  }
}
```

## Custom type predicates — `x is T`

When built-ins aren't enough, write a function that returns a type predicate:

```ts
interface Fish { swim(): void; }
interface Bird { fly(): void; }

function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined;
}

function move(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim(); // Fish
  } else {
    animal.fly();  // Bird
  }
}
```

The return type `animal is Fish` is the predicate — TypeScript trusts this and narrows inside the `if`.

## Assertion functions

Similar to predicates, but they throw instead of returning boolean:

```ts
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') throw new TypeError('Expected string');
}

function process(value: unknown) {
  assertIsString(value);
  value.toUpperCase(); // narrowed to string after the assertion
}
```

## The `unknown` type + narrowing

`unknown` is the type-safe alternative to `any`. You must narrow before using it:

```ts
function parseJSON(raw: string): unknown {
  return JSON.parse(raw);
}

const data = parseJSON('{"name":"Ana"}');
// data.name → Error — can't access property on unknown

if (typeof data === 'object' && data !== null && 'name' in data) {
  console.log((data as { name: string }).name); // safe
}
```

## Discriminated union narrowing (the cleanest pattern)

```ts
type Result<T> =
  | { ok: true;  value: T }
  | { ok: false; error: string };

function handle<T>(result: Result<T>) {
  if (result.ok) {
    console.log(result.value); // T — no error property
  } else {
    console.log(result.error); // string — no value property
  }
}
```

## Senior follow-ups

- **"What's the risk of a custom type predicate that lies?"** TypeScript trusts the predicate completely. If `isFish` returns `true` for a `Bird`, TypeScript will happily call `.swim()` on it — a runtime error. The predicate must be correct.
- **"What's the difference between `as` (type assertion) and a type guard?"** `as` overrides the type silently — no runtime check. A type guard performs an actual runtime check and lets TypeScript narrow. Prefer guards; use `as` only when you're certain the type is correct.
- **"When would you use `asserts` vs returning a boolean predicate?"** `asserts` for validation functions that should throw (e.g., `assertNonNull`). Predicate for conditional logic (`if (isX(v))`).
