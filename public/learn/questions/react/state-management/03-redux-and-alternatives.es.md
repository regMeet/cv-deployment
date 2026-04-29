# Redux vs Zustand / Jotai / Recoil

> Redux sigue siendo el estándar para apps grandes. Zustand y Jotai son más simples para la mayoría de los casos. Recoil es mayormente histórico ahora.

## Redux (con Toolkit)

```js
// slice
const userSlice = createSlice({
  name: 'user',
  initialState: { value: null },
  reducers: {
    setUser: (state, action) => { state.value = action.payload; }
  }
});

// en componente
const user = useSelector(s => s.user.value);
const dispatch = useDispatch();
```

**Fortalezas**

- Maduro, battle-tested.
- Excelentes **devtools** (time travel, action history).
- Ecosistema de **middleware** (logging, async, persistencia).
- Patrones fuertes a gran escala; predecible.

**Costos**

- Boilerplate (RTK ayuda mucho pero sigue siendo más que Zustand).
- Modelo mental indirecto — actions, reducers, selectors.

## Zustand

```js
const useStore = create((set) => ({
  count: 0,
  inc: () => set(s => ({ count: s.count + 1 })),
}));

// en componente
const count = useStore(s => s.count);
```

**Fortalezas**

- API chiquita. Los selectors te dan slice subscription out of the box.
- No requiere `Provider`.
- Se lleva bien con React Suspense / concurrent.

**Costos**

- Menos ecosistema que Redux. Menos patrones codificados.

## Jotai

```js
const countAtom = atom(0);

const [count, setCount] = useAtom(countAtom);
```

**Fortalezas**

- **Atómico** — cada pieza de state es su propio atom; solo los componentes que usan un atom dado re-renderizan.
- Atoms componibles (state derivado vía fórmulas).

**Costos**

- Modelo mental distinto (atoms en lugar de un solo store).
- Menos común; comunidad más chica.

## Recoil

Hecho por Meta. Modelo atómico similar a Jotai. Mayormente **estancado** — Meta pausó el desarrollo activo. **No recomendado para proyectos nuevos** en 2025.

## Regla de decisión

| Necesidad | Elegir |
|---|---|
| App grande, devtools, ecosistema de middleware | Redux Toolkit |
| Default para apps nuevas, footprint chico | Zustand |
| Modelo atómico, state derivado con fórmulas | Jotai |
| State del servidor (caching, refetch, mutations) | **React Query / SWR** (problema separado) |

## Importante — server state vs UI state

Mucha "complejidad de state management" desaparece cuando te das cuenta:

- **Server state** (datos de APIs) → **React Query / SWR / RTK Query** (caching, dedup, refetch).
- **UI state** (modal abierto, tab seleccionada, draft de form) → Zustand / Redux / state local.

No pongas datos del servidor en Redux a menos que tengas una razón real. RTK Query / React Query lo manejan mejor.

## Frase para entrevista

> "I default to local state and React Query for server data. For shared UI state I lean Zustand for new apps; Redux Toolkit when I need devtools, middleware, or it's already in the codebase. Most 'Redux apps' I've seen would have been simpler with React Query for server state and a small Zustand store for the rest."
