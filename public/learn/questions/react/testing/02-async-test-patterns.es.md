# Patrones de tests async (`waitFor`, `findBy`, mocks)

> La mayoría de los tests de React son async. Acertá los primitivos async y tus tests dejan de ser flaky.

## `findBy*` — queries async

`findBy*` espera a que un elemento aparezca. Es `getBy*` + `waitFor`.

```jsx
const greeting = await screen.findByText(/welcome/i);
```

Usar `findBy*` cuando el elemento aparece **después** de una acción (datos cargados, mutación completada).

## `queryBy*` — para "no debería existir"

`getBy*` tira si no encuentra. `queryBy*` devuelve `null`. Usalo para aserciones negativas:

```jsx
expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
```

## `waitFor` — para aserciones async arbitrarias

```jsx
await waitFor(() => {
  expect(api.update).toHaveBeenCalledWith({ id: 1 });
});
```

Usar con moderación. La mayoría de los casos están mejor servidos con `findBy*` + una sola aserción.

## Mockear la red

No mockees `fetch` directamente en cada test. Usá **MSW (Mock Service Worker)**:

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

- Intercepta a nivel de red.
- Los tests corren los code paths reales de fetch / axios.
- Los mismos handlers se pueden reusar entre unit, integration y e2e tests.

## Wrappear con providers

Si tu componente usa React Query, Redux, theme context — renderizá a través de un wrapper:

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

## Fuentes comunes de flake

- `await` faltante en acciones de `userEvent` o `findBy*`.
- Usar `getBy*` donde deberías usar `findBy*` (elemento aún no está).
- Timers reales + código demorado — usá `vi.useFakeTimers()` / `jest.useFakeTimers()` y avanzá manualmente.
- State de módulo polucionado entre tests — resetear handlers de MSW y `QueryClient` por test.

## Encuadre senior

> "Most flake comes from missing awaits or using the wrong query for the situation. I use `findBy*` for things that appear after an action, `queryBy*` for negative assertions, MSW for the network, and fake timers for time-dependent logic. Rarely `waitFor` directly — `findBy*` covers most cases."
