# ¿Cuándo re-renderiza un componente?

> Tres triggers — y un malentendido extendido.

## Un componente re-renderiza cuando

1. Su **state** cambia (`setState`).
2. Sus **props** cambian (el padre re-renderizó con props distintas — o cualquier referencia nueva).
3. Un **context** que consume cambia de value.
4. Su **padre re-renderiza** (por default — a menos que esté memoizado).

## El gran malentendido

> "Las props no cambiaron visualmente, así que mi componente no debería re-renderizar."

**Mal.** Por default, cuando un padre re-renderiza, cada child re-renderiza también — *sin importar* si las props son referencialmente iguales. React no "saltea" renders gratis.

Para hacer que React saltee, necesitás `React.memo` (y referencias de prop estables).

## Re-render ≠ update del DOM

Un re-render produce un virtual DOM nuevo, que React diffea contra el anterior. Si nada cambió, **no pasan mutaciones del DOM**. Así que un re-render "desperdiciado" es barato, pero no gratis — la función corre, los hooks se ejecutan, etc.

## Qué cambia una referencia de prop

```jsx
<Child onClick={() => doX()}              />  // función nueva cada render
<Child config={{ a: 1 }}                  />  // objeto nuevo cada render
<Child items={list.filter(x => x.active)} />  // array nuevo cada render
```

Si `Child` está memoizado pero le pasás referencias nuevas cada render, el memo nunca pega. Usá `useCallback` / `useMemo` (o movete las constantes afuera) para estabilizar.

## Mental check del Profiler

Si un componente está re-renderizando "sin razón":

1. ¿Cambió **state**? → esperado.
2. ¿Cambió **context**? → esperado.
3. ¿Re-renderizó el **padre**? → esperado, a menos que tenga `React.memo` + props estables.
4. ¿Ninguna de las anteriores? → chequeá `React DevTools Profiler` — te va a decir exactamente por qué.

## Frase para entrevista

> "By default, every parent re-render re-renders its children — even if props are referentially equal. To skip, you need `React.memo` plus stable prop references. The DevTools Profiler tells you exactly which prop or hook caused a re-render."
