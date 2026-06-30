# Fix the TypeScript errors

> Each snippet has one or more type errors. Identify the problem and fix it without using `any` or type assertions unless noted.

---

## Exercise 1 — Stale closure / wrong return type

```ts
function makeAdder(x: number) {
  return (y: string) => x + y;
}

const add5 = makeAdder(5);
const result: number = add5(3);
```

<details>
<summary><strong>Problems & fix</strong></summary>

Two problems:
1. `y` is typed as `string` but called with `3` (number).
2. `x + y` where `x: number` and `y: string` produces `string`, not `number`.

```ts
function makeAdder(x: number) {
  return (y: number) => x + y; // both number → result is number
}

const add5 = makeAdder(5);
const result: number = add5(3); // ✓
```

</details>

---

## Exercise 2 — Object narrowing

```ts
type Config = {
  db?: { host: string; port: number };
};

function getPort(config: Config): number {
  return config.db.port;
}
```

<details>
<summary><strong>Problems & fix</strong></summary>

`config.db` is `{ host: string; port: number } | undefined` — accessing `.port` on it without a null check is an error.

```ts
function getPort(config: Config): number {
  if (!config.db) throw new Error('db config missing');
  return config.db.port; // narrowed to non-undefined
}

// Or with optional chaining + nullish coalescing:
function getPort(config: Config): number {
  return config.db?.port ?? 5432;
}
```

</details>

---

## Exercise 3 — Array method type loss

```ts
const ids = [1, 2, 3];
const doubled = ids.map(id => id * 2);
const first: string = doubled[0];
```

<details>
<summary><strong>Problems & fix</strong></summary>

`doubled` is `number[]` (map over `number[]` with `* 2` returns `number[]`). Assigning `doubled[0]` to `string` is a type error.

```ts
const first: number = doubled[0]; // fix the annotation
```

Or if you really need a string:

```ts
const first: string = String(doubled[0]);
```

</details>

---

## Exercise 4 — Generic constraint missing

```ts
function merge<T, U>(target: T, source: U): T {
  return { ...target, ...source };
}
```

<details>
<summary><strong>Problems & fix</strong></summary>

Spread requires both operands to be objects. Without a constraint, `T` and `U` could be primitives. Also, the return type is wrong — the merge of T and U is `T & U`, not just `T`.

```ts
function merge<T extends object, U extends object>(target: T, source: U): T & U {
  return { ...target, ...source };
}

const result = merge({ name: 'Ana' }, { age: 30 });
result.name; // string ✓
result.age;  // number ✓
```

</details>

---

## Exercise 5 — Event handler type

```ts
function handleInput(event) {
  console.log(event.target.value);
}

document.querySelector('input')?.addEventListener('input', handleInput);
```

<details>
<summary><strong>Problems & fix</strong></summary>

`event` is implicitly `any`. `event.target` is `EventTarget | null`, which doesn't have a `value` property.

```ts
function handleInput(event: Event) {
  const input = event.target as HTMLInputElement;
  console.log(input.value);
}
```

Or directly typed as an input event:

```ts
function handleInput(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) return;
  console.log(event.target.value); // narrowed ✓
}
```

</details>
