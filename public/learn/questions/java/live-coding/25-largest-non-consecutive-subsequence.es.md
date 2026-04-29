# Subsecuencia con suma máxima sin elementos adyacentes

> Elegir una subsecuencia (no subarray) tal que no haya dos elementos elegidos adyacentes en el array original, y maximizar la suma. **DP en O(n) tiempo, O(1) espacio.** Lo mismo que "House Robber" (LeetCode 198).

## Preguntas clarificadoras

- ¿Todos positivos, todos negativos, mixto?
- ¿Subsecuencia vacía permitida (devolver 0 si todos negativos)?
- Subsecuencia vs subarray — confirmar que podemos skipear elementos arbitrarios sin elegir dos adyacentes.

## DP — elegir o skipear

Para cada índice `i`, la mejor suma considerando `a[0..i]` es:

```
dp[i] = max(dp[i-1],            // skipear a[i]
            dp[i-2] + a[i])     // tomar a[i], obligado a skipear a[i-1]
```

Solo los dos últimos valores importan → O(1) espacio.

```java
public int maxNonAdjacentSum(int[] a) {
    if (a == null || a.length == 0) return 0;
    int prev2 = 0, prev1 = Math.max(0, a[0]);
    for (int i = 1; i < a.length; i++) {
        int take = prev2 + a[i];
        int skip = prev1;
        int cur  = Math.max(skip, take);
        prev2    = prev1;
        prev1    = cur;
    }
    return prev1;
}
```

El `Math.max(0, a[0])` maneja el caso "subsecuencia vacía permitida". Quitalo si hay que elegir al menos un elemento.

## Por qué funciona

Una subsecuencia sin adyacentes parte naturalmente en índice `i`: o `i` está en la subsecuencia (entonces `i-1` no está, y el resto es el mejor de `0..i-2`), o `i` no está (y el resto es el mejor de `0..i-1`). Dos casos, max fácil. Sin solape → sin doble conteo.

## Lo que "subsecuencia" NO significa acá

Algunos entrevistadores confunden subsecuencia con subarray. **Confirmar en voz alta**: subsecuencia = elegir cualquier subset preservando orden; subarray = ventana contigua. Este problema es lo primero.

## Edge cases

- Todo negativo + vacío permitido → devolver 0.
- Todo negativo + obligado a elegir uno → devolver el max single element (sacar el `Math.max(0, ...)` inicial).
- Largo 1 → devolver `max(0, a[0])` o `a[0]`.
- Largo 2 → devolver `max(a[0], a[1])`.

## Follow-ups

- **Array circular** (House Robber II) — primer y último son adyacentes. Resolver dos veces: incluir primero / excluir primero.
- **No 3 consecutivos** — recurrencia distinta (ver problema aparte).
- **K consecutivos prohibidos** — generalizar: `dp[i] = max(dp[i-1], dp[i-K] + a[i])` (con cuidado).
