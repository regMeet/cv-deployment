# Context API — cuándo alcanza, cuándo no

> Context no es una librería de state management. Es un **resolver de prop-drilling**. Escala mal con updates frecuentes.

## Cuándo Context es la herramienta correcta

- **Theme**, locale, moneda.
- **Usuario actual / status de auth**.
- **Feature flags**.
- DI para servicios (analytics client, API client).

> El patrón: datos **broadly needed** pero **raramente cambian**.

## Cuándo Context es la herramienta equivocada

- Una pieza de state que se actualiza **frecuentemente** (cada keystroke, cada scroll, datos en tiempo real).
- Un objeto grande donde cada consumer solo le importa **un campo**.
- Una **lista que crece** con inserts frecuentes.

En estos casos cada consumer de `useContext` re-renderiza en cada cambio. No hay forma built-in de subscribirse a un slice.

## Workarounds antes de irse a una librería

### 1. Splitear en múltiples contexts

Si theme y user no están relacionados, no los pongas en un context. Dos contexts = dos ciclos de re-render aislados.

### 2. Provider value estable

```jsx
const value = useMemo(() => ({ user, setUser }), [user]);
```

De lo contrario creás un objeto nuevo cada render y re-renderizás cada consumer.

### 3. Contexts de State + Dispatch (patrón Kent C. Dodds)

Splitear el state y el dispatcher en dos contexts. Componentes que solo necesitan dispatch (no leer) no re-renderizan cuando el state cambia.

## Cuándo recurrir a Zustand / Redux / Jotai

- Múltiples componentes se subscriben a **slices distintos** del mismo state.
- Updates de alta frecuencia.
- Necesitás devtools / time-travel debugging.
- Acciones complejas / middleware.

## Frase para entrevista

> "Context is great for theme, locale, and auth — broadly-needed, low-frequency. For high-frequency or sliced state, every consumer re-rendering is too expensive, and I'd reach for Zustand or Redux which support subscribing to specific slices."
