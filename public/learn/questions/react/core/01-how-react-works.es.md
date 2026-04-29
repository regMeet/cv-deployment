# ¿Cómo funciona React realmente? (VDOM, reconciliación, Fiber)

> React mantiene un árbol **virtual**, hace diff de la próxima versión contra la actual, y aplica el **set mínimo de mutaciones al DOM**.

## El flujo

1. Tu componente devuelve **React elements** (objetos describiendo la UI).
2. React construye un **árbol de virtual DOM** desde esos elements.
3. Ante cambio de state/props, React produce un **árbol nuevo**.
4. La **reconciliación** hace diff del nuevo vs el actual → lista de cambios.
5. El **renderer** (react-dom, react-native) commitea esos cambios al host.

## Fiber (React 16+)

Fiber es la estructura de datos + scheduler que potencia la reconciliación. Splitea el trabajo en unidades que se pueden **pausar, reanudar y priorizar**.

Eso es lo que hace posibles los **features concurrentes** (transitions, Suspense, time-slicing).

Dos fases:

- **Render phase** — pura, se puede pausar/abortar. Construye el árbol nuevo.
- **Commit phase** — sincrónica. Aplica los cambios al DOM y corre los effects.

## Por qué importa el VDOM

- La manipulación directa del DOM es cara e imperativa.
- El VDOM te deja escribir UI **declarativa** ("así debería verse") y deja a React calcular el update más barato.
- No es "más rápido que el DOM" — es una **abstracción suficientemente buena** que es mucho más fácil de razonar.

## Heurísticas de reconciliación

- **Tipos de element distintos** en la misma posición → el árbol se descarta y se reconstruye (unmount completo + mount).
- **Mismo tipo de element** → React updatea props y recursa en los children.
- **Listas con `key`** → React matchea children por key, no por posición. Keys mal puestas o faltantes = updates equivocados.

## Frase para entrevista

> "React keeps a virtual representation of the UI, diffs the new version against the current, and commits only the necessary changes. Fiber is the scheduler that lets that work be interruptible — which is what enables concurrent rendering and transitions."
