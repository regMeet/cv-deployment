# Suma máxima sin tres elementos consecutivos

> Enteros positivos. Elegir un subset (alineado al array, consciente de la contigüidad) que maximice la suma tal que nunca haya tres elementos consecutivos del original todos elegidos. Ejemplo: `[3000, 2000, 1000, 3, 10]` → 5013 (elegir 3000, 2000, 3, 10; no se puede incluir los tres 3000-2000-1000).

## Preguntas clarificadoras

- "Sin tres consecutivos" — ¿ninguno de los tres? ¿O a lo sumo dos de cualquier tres?
- ¿Solo positivos, o mixto?
- ¿Subset vacío OK?

## DP — keep, skip, double-skip

Para cada índice `i`, decidir según si elegimos `a[i]` y cuántos predecesores inmediatos están elegidos:

```
dp[i] = max(
    dp[i-1],                  // skipear a[i]
    dp[i-2] + a[i],           // tomar a[i], skipear a[i-1]
    dp[i-3] + a[i-1] + a[i]   // tomar a[i] y a[i-1], skipear a[i-2]
)
```

La tercera rama asegura que nunca incluyamos tres seguidos.

```java
public int maxNoThreeConsecutive(int[] a) {
    int n = a.length;
    if (n == 0) return 0;
    if (n == 1) return Math.max(0, a[0]);
    if (n == 2) return Math.max(0, a[0] + a[1]);
    int[] dp = new int[n];
    dp[0] = a[0];
    dp[1] = a[0] + a[1];
    dp[2] = Math.max(Math.max(a[1] + a[2], a[0] + a[2]), a[0] + a[1]);
    for (int i = 3; i < n; i++) {
        dp[i] = Math.max(dp[i - 1],
                Math.max(dp[i - 2] + a[i],
                         dp[i - 3] + a[i - 1] + a[i]));
    }
    return dp[n - 1];
}
```

Se puede reducir a O(1) espacio guardando solo los últimos tres valores de `dp`.

## Por qué tres ramas (no dos)

A diferencia de "sin dos adyacentes" donde solo decidimos tomar o skipear, acá tomar `a[i]` no restringe completamente a `a[i-1]` — quizás también lo podemos tomar, mientras no hayamos tomado `a[i-2]`. La ramificación captura los tres patrones de cola permitidos del set elegido: terminar en skip, single take, o double take.

## Edge cases

- N < 3 → tomar todo; no se puede violar la restricción.
- Todo cero → devolver 0.
- Valores negativos + subset vacío permitido → capear con `Math.max(0, ...)`.

## Follow-ups

- **Sin K consecutivos** generalización — K ramas, recurrencia con K términos.
- **Reconstruir los índices elegidos** — backtrack desde `dp[n-1]` chequeando qué rama fue activa.
