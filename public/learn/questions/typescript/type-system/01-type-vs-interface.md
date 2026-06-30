# type vs interface — when to use each

> Both describe object shapes. The differences are small but matter in specific situations.

## Core difference — declaration merging

`interface` supports **declaration merging**; `type` does not.

```ts
interface User { name: string; }
interface User { age: number; }
// Result: { name: string; age: number } — merged automatically

type User = { name: string; };
type User = { age: number; }; // Error: Duplicate identifier 'User'
```

This is why library authors use `interface` — consumers can augment them.

## Extending

Both can extend, with different syntax:

```ts
// interface
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }

// type (uses intersection)
type Animal = { name: string; };
type Dog = Animal & { breed: string; };
```

`interface` can also extend `type`, and vice versa with `implements`:

```ts
type Serializable = { serialize(): string; };
interface JsonNode extends Serializable { value: unknown; }
```

## What only `type` can do

```ts
// Union types
type ID = string | number;
type Status = 'active' | 'inactive' | 'pending';

// Intersection (though interface can extend, it can't union)
type AdminUser = User & Admin;

// Tuple types
type Point = [number, number];

// Primitive aliases
type Milliseconds = number;

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

// Mapped types
type Readonly<T> = { readonly [K in keyof T]: T[K] };
```

## What only `interface` can do

- Declaration merging (as shown above)
- `implements` in classes feels more natural (though `type` works too)

## Quick decision guide

| Use `interface` when | Use `type` when |
|---|---|
| Defining object/class shapes | You need a union, tuple, or primitive alias |
| Writing a library others will consume (merging) | You need conditional or mapped types |
| Extending with `extends` chains | Composing with intersections |
| Default in most teams | Complex type algebra |

## The practical answer in interviews

> "I use `interface` for object shapes and public API contracts, and `type` for unions, intersections, utility compositions, and anything that isn't a plain object shape. The main real-world difference is that `interface` supports declaration merging, which matters for library code."

## Senior follow-ups

- **"Can you `implement` a `type` in a class?"** Yes — a class can `implement` both `interface` and object `type`. TS just checks structural compatibility.
- **"Which is more performant at type-check time?"** `interface` is slightly faster for simple shapes because TypeScript caches named interfaces. For large codebases with complex types, this can matter.
- **"What's an open vs closed type?"** `interface` is open (can be merged). `type` is closed (fixed after declaration). This matters when designing SDKs.
