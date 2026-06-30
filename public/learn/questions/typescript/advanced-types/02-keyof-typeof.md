# keyof, typeof & indexed access types

> Three operators that let you derive types from existing code instead of writing them by hand.

## `keyof T` — union of an object's keys

```ts
interface User { id: number; name: string; email: string; }

type UserKeys = keyof User; // 'id' | 'name' | 'email'
```

Classic use — type-safe property access:

```ts
function getField<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: 'Ana', email: 'a@a.com' };
getField(user, 'name');  // string ✓
getField(user, 'score'); // Error — 'score' not in User ✓
```

## `typeof` — capture the type of a value

In a type position, `typeof` extracts the TypeScript type of a variable or expression:

```ts
const config = {
  host: 'localhost',
  port: 3000,
  debug: true,
};

type Config = typeof config;
// { host: string; port: number; debug: boolean }

function applyConfig(c: typeof config) { /* ... */ }
```

Useful when you have a value (e.g., from a factory or const) and want its type without writing it twice.

```ts
// Common pattern: derive enum-like types from const objects
const ROLES = {
  admin:  'admin',
  editor: 'editor',
  viewer: 'viewer',
} as const;

type Role = keyof typeof ROLES;          // 'admin' | 'editor' | 'viewer'
type RoleValue = typeof ROLES[Role];     // 'admin' | 'editor' | 'viewer'
```

## Indexed access types — `T[K]`

Look up the type of a specific property:

```ts
type UserName  = User['name'];  // string
type UserId    = User['id'];    // number

// Works with union keys
type IdOrName  = User['id' | 'name']; // number | string

// Works with arrays
type Arr = string[];
type Elem = Arr[number]; // string — the element type
```

## Combining all three

```ts
const routes = {
  home:    { path: '/',       auth: false },
  profile: { path: '/me',    auth: true  },
  admin:   { path: '/admin', auth: true  },
} as const;

type RouteName = keyof typeof routes;                 // 'home' | 'profile' | 'admin'
type RouteConfig = typeof routes[RouteName];          // { path: string; auth: boolean }
type RoutePath = typeof routes[RouteName]['path'];    // string
```

## Senior follow-ups

- **"What's the difference between `typeof` at runtime and at type level?"** At runtime, `typeof x` is a JavaScript operator returning `'string'`, `'number'`, etc. At type level (in a type position), `typeof x` is a TypeScript operator returning the full inferred type of `x`.
- **"What does `keyof any` produce?"** `string | number | symbol` — all valid object key types.
- **"How do you get all values of an object type?"** `T[keyof T]` — indexed access with all keys produces the union of all value types.
