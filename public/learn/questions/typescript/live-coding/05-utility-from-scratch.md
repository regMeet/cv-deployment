# Implement Partial<T> and Pick<T,K> from scratch

> Understanding how utility types are built solidifies your mental model of mapped types, keyof, and indexed access.

## Exercise 1 — Implement `MyPartial<T>`

Make all properties of `T` optional.

```ts
type MyPartial<T> = // your implementation
```

<details>
<summary><strong>Solution</strong></summary>

```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// Test
interface User { id: number; name: string; email: string; }
type PartialUser = MyPartial<User>;
// { id?: number; name?: string; email?: string; }
```

`[K in keyof T]` iterates over every key of `T`. Adding `?` makes each optional. `T[K]` preserves the original value type.

</details>

---

## Exercise 2 — Implement `MyRequired<T>`

Remove the optional modifier from all properties.

```ts
type MyRequired<T> = // your implementation
```

<details>
<summary><strong>Solution</strong></summary>

```ts
type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};
```

`-?` removes the optional modifier. The `-` prefix removes a modifier; `+?` (or just `?`) adds it.

</details>

---

## Exercise 3 — Implement `MyPick<T, K>`

Keep only the keys listed in `K`.

```ts
type MyPick<T, K extends keyof T> = // your implementation
```

<details>
<summary><strong>Solution</strong></summary>

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Test
type UserPreview = MyPick<User, 'id' | 'name'>;
// { id: number; name: string; }
```

`K extends keyof T` constrains K to valid keys of T. `[P in K]` iterates only those keys. `T[P]` gets the value type for each.

</details>

---

## Exercise 4 — Implement `MyOmit<T, K>`

Remove the keys listed in `K`.

```ts
type MyOmit<T, K extends keyof T> = // your implementation
```

<details>
<summary><strong>Solution</strong></summary>

```ts
type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

// Alternatively, using Pick + Exclude:
type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;

// Test
type PublicUser = MyOmit<User, 'email'>;
// { id: number; name: string; }
```

The `as` clause remaps (or filters) keys. `P extends K ? never : P` returns `never` for keys to omit — TypeScript drops `never` keys from mapped types.

</details>

---

## Exercise 5 — Implement `MyRecord<K, V>`

Create an object type with keys `K` and values `V`.

```ts
type MyRecord<K extends keyof any, V> = // your implementation
```

<details>
<summary><strong>Solution</strong></summary>

```ts
type MyRecord<K extends keyof any, V> = {
  [P in K]: V;
};

// Test
type RoleMap = MyRecord<'admin' | 'editor' | 'viewer', string[]>;
// { admin: string[]; editor: string[]; viewer: string[]; }
```

`K extends keyof any` allows `string | number | symbol` as keys (any valid JS object key).

</details>

---

## Bonus — Implement `MyReadonly<T>`

```ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};
```

And its inverse:

```ts
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};
```

## Senior follow-ups

- **"What's the difference between `Omit<T, K>` and `Pick<T, Exclude<keyof T, K>>`?"** Identical result when `K extends keyof T`. The built-in `Omit` actually accepts `K extends PropertyKey` (not restricted to keys of `T`) — this is a known design choice in the stdlib to be more permissive.
- **"Why does `never` disappear from mapped types?"** By spec — a key mapped to `never` is dropped from the resulting object type. This is how conditional key filtering works.
- **"Can you make a deep version of `Partial`?"** Yes: `type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }`. Handle arrays and primitives carefully to avoid over-applying.
