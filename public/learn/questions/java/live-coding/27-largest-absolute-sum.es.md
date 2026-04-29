# Subarray con suma absoluta máxima

> Array de enteros mixtos. Encontrar el subarray contiguo que maximiza `|sum|`. Ejemplo: `[1, 2, -5, 4, 5, -1, 2, -11]` → `|-11| = 11`. **Correr Kadane dos veces — uno para max, otro para min — devolver el mayor en valor absoluto.**

## Preguntas clarificadoras

- ¿Subarray vacío permitido (sum = 0)?
- ¿Hace falta índices o solo el valor?
- Empate entre max positivo y max negativo en valor absoluto — ¿preferencia?

## Solución — Kadane para ambos extremos

```java
public int maxAbsSubarraySum(int[] a) {
    int maxSum = a[0], maxCur = a[0];
    int minSum = a[0], minCur = a[0];
    for (int i = 1; i < a.length; i++) {
        maxCur = Math.max(a[i], maxCur + a[i]);
        maxSum = Math.max(maxSum, maxCur);
        minCur = Math.min(a[i], minCur + a[i]);
        minSum = Math.min(minSum, minCur);
    }
    return Math.max(Math.abs(maxSum), Math.abs(minSum));
}
```

Dos Kadanes en simultáneo — `maxSum` es la suma positiva más grande (o la menos negativa), `minSum` es la más negativa. El mayor en absoluto es uno de los dos.

## Por qué dos pasadas (o una intercalada), no una

`|sum|` no es un objetivo monótono-amistoso — el "extender o reiniciar" de Kadane depende de preferencia monótona (siempre mayor). Dividir en "encontrar max" y "encontrar min" recupera dos problemas monótonos, cada uno resoluble por Kadane. Tomá el ganador en absoluto.

## Edge cases

- Un solo elemento → devolver `|a[0]|`.
- Todos del mismo signo → solo una pasada encuentra algo interesante; la otra devuelve el single element de menor magnitud.
- Todos cero → devolver 0.

## Follow-ups

- **Subsecuencia con max suma absoluta** (no subarray) — otro problema; suma de todos los positivos o todos los negativos, tomar el mayor en absoluto.
- **Subarray con suma absoluta mínima** — subarray más cercano a cero; prefix sums ordenados, buscar la diferencia más chica entre prefijos consecutivos.
