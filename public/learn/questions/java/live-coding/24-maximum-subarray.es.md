# Maximum subarray sum (Kadane)

> Array de enteros (posiblemente negativos). Encontrar el subarray contiguo con suma máxima. **O(n) tiempo, O(1) espacio.** Algoritmo canónico; lo tenés que saber en piloto automático.

## Preguntas clarificadoras

- Array todo negativo — ¿devolver el máximo elemento, o 0 (subarray vacío)?
- ¿Hace falta índices o solo la suma?
- ¿Subarray vacío permitido? (La mayoría de variantes dice no — mínimo un elemento.)

## Kadane — máximo corriente terminando en i

```java
public int maxSubarraySum(int[] a) {
    int best = a[0], cur = a[0];
    for (int i = 1; i < a.length; i++) {
        cur  = Math.max(a[i], cur + a[i]);   // extender o reiniciar
        best = Math.max(best, cur);
    }
    return best;
}
```

`cur` = la suma máxima de cualquier subarray que termina en índice `i`. En cada paso, extendemos el máximo anterior o reiniciamos desde `a[i]`. `best` trackea el máximo global.

## Por qué "extender o reiniciar" es la única opción

Si `cur` es negativo, arrastrarlo solo perjudica la suma siguiente. Apenas `cur + a[i] < a[i]`, reiniciamos en `a[i]`. Esto equivale a `cur = max(a[i], cur + a[i])`.

## Reportar los índices

```java
int bestStart = 0, bestEnd = 0, curStart = 0;
int cur = a[0], best = a[0];
for (int i = 1; i < a.length; i++) {
    if (cur + a[i] < a[i]) { cur = a[i]; curStart = i; }
    else                     cur += a[i];
    if (cur > best) { best = cur; bestStart = curStart; bestEnd = i; }
}
```

Mismo algoritmo, más tracking de dónde arrancó cada candidato.

## Edge cases

- Input todo negativo → devuelve el elemento más grande (lo que normalmente se quiere).
- Un solo elemento → devolverlo.
- Input vacío → throw o devolver 0 (clarificar spec).

## Follow-ups

- **Subarray *circular*** — respuesta es `max(kadane, totalSum − minSubarraySum)`. Edge: todo negativo.
- **Suma máxima con a lo sumo K elementos** — sliding window o DP.
- **Versión 2D (max sum submatrix)** — fijar top/bottom rows, colapsar a 1D, correr Kadane. O(R²C).
