# Discriminated unions

> Model state machines, API responses, and domain variants cleanly. TypeScript's most powerful pattern for exhaustive handling.

## The pattern

A discriminated union is a union where each member has a shared **literal-typed field** (the discriminant). TypeScript uses it to narrow automatically.

```ts
type Shape =
  | { kind: 'circle';   radius: number }
  | { kind: 'square';   side: number }
  | { kind: 'rect';     width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'square': return shape.side ** 2;
    case 'rect':   return shape.width * shape.height;
  }
}
```

Inside each case, TypeScript narrows `shape` to the exact variant — only the relevant properties are accessible.

## Exhaustiveness checking

Add a `never` check to ensure all cases are handled:

```ts
function assertNever(x: never): never {
  throw new Error('Unhandled variant: ' + JSON.stringify(x));
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'square': return shape.side ** 2;
    case 'rect':   return shape.width * shape.height;
    default:       return assertNever(shape); // compile error if a case is missing
  }
}
```

If you add `triangle` to `Shape` and forget to handle it, TypeScript flags the `assertNever` call.

## Modeling async state

```ts
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error';   error: Error };

function render<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'idle':    return <div>Start</div>;
    case 'loading': return <Spinner />;
    case 'success': return <Data value={state.data} />;
    case 'error':   return <Error msg={state.error.message} />;
  }
}
```

No more `isLoading: boolean`, `error: Error | null`, `data: T | null` — four separate flags that create impossible states.

## Modeling a result type

```ts
type Result<T, E = Error> =
  | { ok: true;  value: T }
  | { ok: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return { ok: false, error: 'Division by zero' };
  return { ok: true, value: a / b };
}

const result = divide(10, 2);
if (result.ok) {
  console.log(result.value); // number — TypeScript knows
} else {
  console.log(result.error); // string
}
```

## Common discriminant fields

- `kind`, `type`, `tag` — most common
- `status` — for async state or HTTP responses
- `__typename` — GraphQL responses
- `action.type` — Redux actions

## Senior follow-ups

- **"Why are impossible states a problem?"** When you use multiple boolean flags (`isLoading`, `hasError`, `hasData`), you can represent combinations like `{ isLoading: true, hasData: true }` that shouldn't exist. Discriminated unions make impossible states unrepresentable.
- **"How do you handle a discriminated union with shared properties?"** Extract common fields into a base type and intersect: `type Base = { id: string }; type Shape = Base & (Circle | Rect)`.
- **"Can the discriminant be a number or boolean?"** Yes — any literal type works. `kind: 0 | 1 | 2` is valid. String literals are most readable and searchable.
