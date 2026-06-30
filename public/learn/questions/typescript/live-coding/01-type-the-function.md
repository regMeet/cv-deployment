# Type these functions (progressively harder)

> Each exercise is untyped JavaScript. Add correct TypeScript types. Don't use `any`.

---

## Exercise 1 — Basic generics

```js
function last(arr) {
  return arr[arr.length - 1];
}
```

<details>
<summary><strong>Solution</strong></summary>

```ts
function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

last([1, 2, 3]);   // number | undefined
last(['a', 'b']);  // string | undefined
last([]);          // T is unknown when empty — returns undefined safely
```

</details>

---

## Exercise 2 — Constrained generics

```js
function getProperty(obj, key) {
  return obj[key];
}
```

<details>
<summary><strong>Solution</strong></summary>

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Ana', age: 30 };
getProperty(user, 'name'); // string
getProperty(user, 'age');  // number
getProperty(user, 'x');    // Error — 'x' not in user
```

</details>

---

## Exercise 3 — Function overloads

```js
function createElement(tag, content) {
  const el = document.createElement(tag);
  if (typeof content === 'string') el.textContent = content;
  else el.appendChild(content);
  return el;
}
```

<details>
<summary><strong>Solution</strong></summary>

```ts
function createElement(tag: string, content: string): HTMLElement;
function createElement(tag: string, content: HTMLElement): HTMLElement;
function createElement(tag: string, content: string | HTMLElement): HTMLElement {
  const el = document.createElement(tag);
  if (typeof content === 'string') el.textContent = content;
  else el.appendChild(content);
  return el;
}
```

</details>

---

## Exercise 4 — Async with generics

```js
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

<details>
<summary><strong>Solution</strong></summary>

```ts
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

// Usage
interface User { id: number; name: string; }
const user = await fetchJSON<User>('/api/user/1'); // typed as User
```

Why `as Promise<T>`: `res.json()` returns `Promise<any>`. The cast is the one place where `any` is acceptable — we're explicitly taking responsibility for the type.

</details>

---

## Exercise 5 — Callback with inference

```js
function pipe(value, ...fns) {
  return fns.reduce((v, fn) => fn(v), value);
}
```

<details>
<summary><strong>Solution</strong></summary>

Typing a variadic pipe is hard in full generality. A practical solution handles 2–3 steps with overloads:

```ts
function pipe<A, B>(value: A, f1: (a: A) => B): B;
function pipe<A, B, C>(value: A, f1: (a: A) => B, f2: (b: B) => C): C;
function pipe<A, B, C, D>(value: A, f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D): D;
function pipe(value: unknown, ...fns: Array<(v: unknown) => unknown>): unknown {
  return fns.reduce((v, fn) => fn(v), value);
}

pipe(
  '  hello  ',
  (s: string) => s.trim(),
  (s: string) => s.toUpperCase(),
  (s: string) => s.split(''),
); // string[]
```

Libraries like `fp-ts` and `ramda` use more sophisticated tuple-based overloads to handle up to 10+ steps.

</details>
