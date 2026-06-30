# Mapped types & template literal types

> Mapped types let you transform every property of an existing type. Template literal types let you build string types programmatically.

## Mapped types — iterate over keys

Basic syntax: `{ [K in KeyUnion]: ValueType }`

```ts
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Optional<T> = {
  [K in keyof T]?: T[K];
};

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};
```

These are exactly how the built-in utility types are implemented.

## Adding and removing modifiers

Use `+` / `-` to add or remove `readonly` and `?`:

```ts
// Remove readonly from all properties
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Remove optional from all properties (same as Required<T>)
type Required<T> = {
  [K in keyof T]-?: T[K];
};
```

## Remapping keys with `as`

Transform key names inside the mapped type:

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface User { name: string; age: number; }
type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }
```

## Filtering keys with `as` + `never`

```ts
// Keep only string-valued properties
type StringProps<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type User = { id: number; name: string; email: string; active: boolean };
type StringUser = StringProps<User>; // { name: string; email: string }
```

## Template literal types

Build string union types using template syntax:

```ts
type Direction = 'top' | 'right' | 'bottom' | 'left';
type CSSProp = `margin-${Direction}`;
// 'margin-top' | 'margin-right' | 'margin-bottom' | 'margin-left'

type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<'click'>; // 'onClick'
```

TypeScript includes helper literal types: `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`.

## Combining mapped + template literal types

```ts
type EventHandlers<T extends string> = {
  [K in T as `on${Capitalize<K>}`]?: (event: Event) => void;
};

type DOMEvents = EventHandlers<'click' | 'focus' | 'blur'>;
// { onClick?: ...; onFocus?: ...; onBlur?: ... }
```

## Real-world example — deep readonly

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type Config = DeepReadonly<{ db: { host: string; port: number } }>;
// config.db.host is readonly at any depth
```

## Senior follow-ups

- **"How is `Partial<T>` different from `{ [K in keyof T]?: T[K] }`?"** They're identical — `Partial` is defined exactly that way internally.
- **"Can you map over a union that isn't `keyof T`?"** Yes — `{ [K in 'a' | 'b' | 'c']: number }` works. You can iterate over any string/number/symbol union.
- **"What's the difference between a homomorphic and non-homomorphic mapped type?"** A homomorphic mapped type (using `keyof T`) preserves `readonly` and `?` modifiers from the original. Non-homomorphic (using an independent union) does not.
