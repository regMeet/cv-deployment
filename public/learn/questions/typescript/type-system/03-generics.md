# Generics — reusable typed code

> Generics let you write code that works with any type while preserving type information through the call.

## Basic syntax

```ts
function identity<T>(value: T): T {
  return value;
}

identity(42);        // T inferred as number → returns number
identity('hello');   // T inferred as string → returns string
identity<boolean>(true); // explicit
```

Without generics, you'd use `any` — and lose type safety. With generics, the return type mirrors the input type.

## Generic interfaces and types

```ts
interface Box<T> {
  value: T;
  transform<U>(fn: (v: T) => U): Box<U>;
}

type Pair<A, B> = { first: A; second: B };

type Maybe<T> = T | null | undefined;
```

## Constraints — `extends`

Restrict what T can be:

```ts
function getLength<T extends { length: number }>(value: T): number {
  return value.length; // safe — T is guaranteed to have `.length`
}

getLength('hello'); // 5
getLength([1, 2]);  // 2
getLength(42);      // Error — number has no .length
```

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Ana', age: 30 };
getProperty(user, 'name'); // string
getProperty(user, 'age');  // number
getProperty(user, 'x');    // Error — 'x' is not a key of user
```

## Default type parameters

```ts
interface Response<T = unknown> {
  data: T;
  status: number;
}

const r: Response = { data: 'hello', status: 200 }; // T defaults to unknown
const r2: Response<User> = { data: user, status: 200 };
```

## Generic functions in practice

```ts
async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as T;
}

const user = await fetchData<User>('/api/user/1');
// user is typed as User
```

## Multiple type parameters

```ts
function zip<A, B>(as: A[], bs: B[]): [A, B][] {
  return as.map((a, i) => [a, bs[i]]);
}

zip([1, 2], ['a', 'b']); // [number, string][]
```

## Common pitfall — inferring too broadly

```ts
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

first([1, 2, 3]);    // number | undefined ✓
first(['a', 'b']);   // string | undefined ✓
first([]);           // unknown[] → T is unknown — use a constraint if needed
```

## Senior follow-ups

- **"What's the difference between `<T>` and `<T extends object>`?"** The second constrains T to non-primitive types. Useful when you need to use `keyof T` or spread `T`.
- **"What's variance in generics?"** Whether `Box<Dog>` is assignable to `Box<Animal>`. TypeScript uses **structural** variance — it checks the actual shape. `readonly` arrays are covariant; mutable arrays are invariant in strict mode.
- **"When would you use `infer` inside a generic?"** To extract a type from a structure in a conditional type, e.g., `type Awaited<T> = T extends Promise<infer U> ? U : T`.
