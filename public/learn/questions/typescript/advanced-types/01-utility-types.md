# Utility types — Partial, Pick, Omit, Record…

> TypeScript ships with built-in type transformers. Knowing them saves you from writing equivalent mapped types by hand.

## `Partial<T>` — all properties optional

```ts
interface User { id: number; name: string; email: string; }

function updateUser(id: number, patch: Partial<User>) { /* ... */ }

updateUser(1, { name: 'Ana' }); // only update name — valid
```

## `Required<T>` — all properties required

Opposite of Partial. Removes `?` from every property.

```ts
type Config = { host?: string; port?: number; };
type StrictConfig = Required<Config>; // { host: string; port: number; }
```

## `Pick<T, K>` — keep only listed keys

```ts
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string }

function renderCard(user: UserPreview) { /* doesn't need email */ }
```

## `Omit<T, K>` — remove listed keys

```ts
type PublicUser = Omit<User, 'email'>;
// { id: number; name: string }
```

## `Record<K, V>` — map keys to values

```ts
type Role = 'admin' | 'editor' | 'viewer';
type Permissions = Record<Role, string[]>;

const perms: Permissions = {
  admin:  ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read'],
};
```

## `Readonly<T>` — prevent mutation

```ts
function processConfig(config: Readonly<Config>) {
  config.host = 'x'; // Error — cannot assign to readonly property
}
```

## `ReturnType<T>` and `Parameters<T>`

```ts
function createUser(name: string, age: number) {
  return { id: Math.random(), name, age };
}

type NewUser    = ReturnType<typeof createUser>;   // { id: number; name: string; age: number }
type CreateArgs = Parameters<typeof createUser>;   // [name: string, age: number]
```

## `NonNullable<T>`

```ts
type MaybeString = string | null | undefined;
type StringOnly  = NonNullable<MaybeString>; // string
```

## `Awaited<T>` — unwrap Promise

```ts
type Result = Awaited<Promise<Promise<string>>>; // string
```

## Combining utility types

```ts
// A partial update payload that excludes the id
type UpdatePayload = Partial<Omit<User, 'id'>>;

// A Record where values are optional user previews
type UserMap = Record<string, Partial<UserPreview>>;
```

## Senior follow-ups

- **"How is `Omit` implemented under the hood?"** `type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>`. It uses `Exclude` (which filters a union) and `Pick`.
- **"What's `Extract` and `Exclude`?"** They operate on union types: `Exclude<'a'|'b'|'c', 'a'>` → `'b'|'c'`. `Extract<'a'|'b', 'a'|'d'>` → `'a'`. Used as building blocks for other utility types.
- **"When would you use `ReturnType` over writing the type manually?"** When the return type is complex and you don't own the function (e.g., a library function). It stays in sync automatically if the library updates.
