# Async test patterns (`waitFor`, `findBy`, mocks)

> Most React tests are async. Get the async primitives right and your tests stop being flaky.

## `findBy*` — async queries

`findBy*` waits for an element to appear. It's `getBy*` + `waitFor`.

```jsx
const greeting = await screen.findByText(/welcome/i);
```

Use `findBy*` when the element appears **after** an action (data loaded, mutation completed).

## `queryBy*` — for "should NOT exist"

`getBy*` throws if not found. `queryBy*` returns `null`. Use it for negative assertions:

```jsx
expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
```

## `waitFor` — for arbitrary async assertions

```jsx
await waitFor(() => {
  expect(api.update).toHaveBeenCalledWith({ id: 1 });
});
```

Use sparingly. Most cases are better served by `findBy*` + a single assertion.

## Mocking the network

Don't mock `fetch` directly in every test. Use **MSW (Mock Service Worker)**:

```js
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/users/:id', ({ params }) =>
    HttpResponse.json({ id: params.id, name: 'Ana' })
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

- Intercepts at the network layer.
- Tests run real fetch / axios code paths.
- Same handlers can be reused across unit, integration, and e2e tests.

## Wrapping with providers

If your component uses React Query, Redux, theme context — render through a wrapper:

```jsx
function renderWithProviders(ui) {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </QueryClientProvider>
  );
}
```

## Common flake sources

- Missing `await` on `userEvent` actions or `findBy*`.
- Using `getBy*` where you should use `findBy*` (element not yet there).
- Real timers + delayed code — use `vi.useFakeTimers()` / `jest.useFakeTimers()` and advance manually.
- Polluted module state between tests — reset MSW handlers and `QueryClient` per test.

## Senior framing

> "Most flake comes from missing awaits or using the wrong query for the situation. I use `findBy*` for things that appear after an action, `queryBy*` for negative assertions, MSW for the network, and fake timers for time-dependent logic. Rarely `waitFor` directly — `findBy*` covers most cases."
