# Swap de dos enteros sin variable temporal

> XOR swap (sin overflow) o swap aritmético (con overflow). **Ambos son trivia en 2025 — los compiladores modernos eliminan la temp con register allocation. Vale conocerlo para la conversación.**

## Preguntas clarificadoras

- ¿Hay que manejar aliasing (las dos variables son la misma posición de memoria)?
- ¿Solo enteros, o también tipos arbitrarios?
- ¿La performance es realmente un objetivo, o es trivia de entrevista?

## XOR swap — sin overflow

```java
public void swap(int[] a, int i, int j) {
    if (i == j) return;                   // crítico: evitar aliasing → ambos quedan 0
    a[i] ^= a[j];
    a[j] ^= a[i];
    a[i] ^= a[j];
}
```

Trace:
1. `a[i] = a[i] ^ a[j]`
2. `a[j] = a[j] ^ (a[i] ^ a[j]) = a[i]_original`
3. `a[i] = (a[i] ^ a[j]) ^ a[i]_original = a[j]_original`

## Swap aritmético — legible pero con overflow

```java
public void swapAdd(int[] a, int i, int j) {
    if (i == j) return;
    a[i] = a[i] + a[j];
    a[j] = a[i] - a[j];
    a[i] = a[i] - a[j];
}
```

Falla cuando `a[i] + a[j]` overflowea — silenciosamente produce valores incorrectos en algunos inputs. **XOR no tiene overflow** porque cada bit es independiente.

## La trampa del aliasing

Ambas versiones destruyen el valor cuando `i == j` (o, en lenguajes con punteros, cuando `&a == &b`):

```
a[0] ^= a[0];   // a[0] = 0
a[0] ^= a[0];   // sigue 0
a[0] ^= a[0];   // sigue 0 — el valor se pierde
```

**Siempre proteger con `if (i == j) return;`** cuando se llama con índices al mismo array.

## Por qué es trivia ahora

Los compiladores convierten `int t = a; a = b; b = t;` en dos movs de registro sin temp real. La versión XOR genera *más* instrucciones que la versión con temp en hardware moderno. Se sigue preguntando porque testea bitwise reasoning y conciencia de edge cases (aliasing).

## Edge cases

- `i == j` → debe short-circuit, si no ambos pierden valor.
- Ambos ya iguales (posiciones distintas) → swap es no-op; ambas versiones manejan bien.
- `INT_MIN` y `INT_MAX` en versión aritmética → undefined (overflow); XOR está seguro.

## Follow-ups

- **Swap de tipos arbitrarios** sin temp — generalmente imposible en Java (sin operator overloading); usar temp.
- **Swap con tuple-style assignment** — Java no lo soporta; Python y Go sí.
