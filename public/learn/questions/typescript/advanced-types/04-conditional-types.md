# Conditional types & infer

> The most powerful (and confusing) feature in TypeScript's type system. Used to build utility types and extract types from structures.

## Basic conditional types

Syntax: `T extends U ? TrueType : FalseType`

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
type C = IsString<'hello'>; // true — 'hello' extends string
```

## Distributive conditional types

When `T` is a naked type parameter in a conditional, it **distributes** over unions:

```ts
type ToArray<T> = T extends any ? T[] : never;

type A = ToArray<string | number>;
// Distributes: (string extends any ? string[] : never) | (number extends any ? number[] : never)
// Result: string[] | number[]
```

To disable distribution, wrap in a tuple:

```ts
type ToArrayNoDistribute<T> = [T] extends [any] ? T[] : never;
type B = ToArrayNoDistribute<string | number>; // (string | number)[]
```

## `infer` — extract types from within a type

`infer R` creates a new type variable that TypeScript infers from the matched structure:

```ts
// Extract the return type of a function
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type R = ReturnType<() => string>;     // string
type R2 = ReturnType<(n: number) => boolean[]>; // boolean[]
```

```ts
// Extract the element type of an array
type ElementOf<T> = T extends (infer E)[] ? E : never;

type E = ElementOf<string[]>; // string
type E2 = ElementOf<number[]>; // number
```

```ts
// Extract the first argument of a function
type FirstArg<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never;

type F = FirstArg<(x: number, y: string) => void>; // number
```

## `Awaited<T>` — the canonical infer example

```ts
type Awaited<T> =
  T extends Promise<infer U>
    ? Awaited<U>  // recursive — handles Promise<Promise<string>>
    : T;

type A = Awaited<Promise<string>>;          // string
type B = Awaited<Promise<Promise<number>>>; // number
```

## Practical utility types using conditionals

```ts
// Remove null and undefined
type NonNullable<T> = T extends null | undefined ? never : T;

// Extract only function properties from an object
type FunctionProps<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type M = FunctionProps<{ a: string; b: () => void; c: number; d: () => string }>;
// 'b' | 'd'
```

## Senior follow-ups

- **"When does TypeScript defer evaluation of a conditional type?"** When `T` is still a generic — it stays unevaluated until the type parameter is substituted. This is why some complex types show `T extends X ? A : B` in hover tooltips.
- **"What's the difference between `infer` in a return position vs argument position?"** In return position, `infer` captures the return type. In argument position, it captures the parameter type. Multiple `infer` in the same type are each their own fresh variable.
- **"What are recursive conditional types good for?"** Deep operations like `DeepReadonly`, `DeepPartial`, `Awaited`, flattening nested types. They have a recursion depth limit in the compiler.
