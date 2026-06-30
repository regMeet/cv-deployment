# Union & intersection types

> Union = "either A or B". Intersection = "both A and B at once". Simple concept, powerful in practice.

## Union types (`|`)

A value that can be one of several types.

```ts
type ID = string | number;

function getUser(id: ID) {
  if (typeof id === 'string') {
    // TypeScript knows id is string here
    return id.toUpperCase();
  }
  return id.toFixed(0);
}
```

TypeScript **narrows** the type inside each branch automatically.

### Discriminated union (the most useful pattern)

Add a literal type field that identifies the variant:

```ts
type Shape =
  | { kind: 'circle';    radius: number }
  | { kind: 'rect';      width: number; height: number }
  | { kind: 'triangle';  base: number;  height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':   return Math.PI * shape.radius ** 2;
    case 'rect':     return shape.width * shape.height;
    case 'triangle': return 0.5 * shape.base * shape.height;
  }
}
```

TypeScript knows exactly which variant you're in inside each `case`.

## Intersection types (`&`)

Combines multiple types — the value must satisfy **all** of them.

```ts
type Timestamped = { createdAt: Date; updatedAt: Date };
type WithId      = { id: string };

type Entity = WithId & Timestamped;
// { id: string; createdAt: Date; updatedAt: Date }

function saveEntity(e: Entity) { /* has all three fields */ }
```

### Intersection vs `extends`

```ts
// Equivalent results (usually):
interface Dog extends Animal { breed: string; }
type Dog = Animal & { breed: string; };

// Difference: interface extends gives a compile error on conflicting properties
// type intersection silently produces `never` for conflicting primitive types
interface A { x: number; }
interface B extends A { x: string; } // Error: incompatible

type C = { x: number } & { x: string };
type X = C['x']; // never — impossible type
```

## `never` in unions

`never` is the empty type — a value that can never exist. It disappears from unions:

```ts
type T = string | never; // string
```

Useful for exhaustiveness checking:

```ts
function assertNever(x: never): never {
  throw new Error('Unhandled case: ' + x);
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return /* ... */;
    case 'rect':   return /* ... */;
    // If you add a new Shape variant and forget to handle it here,
    // TypeScript will complain that `shape` is not assignable to `never`
    default: return assertNever(shape);
  }
}
```

## Senior follow-ups

- **"What's the difference between `A | B` and `A & B` for object types?"** Union: a value that satisfies one. Intersection: a value that satisfies both — has all properties of A and all properties of B. For objects, intersection is essentially "merge the shapes".
- **"When does intersection produce `never`?"** When you intersect incompatible primitive types: `string & number` is `never`. For objects, properties with incompatible types produce `never` for that key.
- **"What's a tagged union / discriminated union?"** A union where each variant has a shared literal-typed field (the tag) that TypeScript can use to narrow without a type assertion.
