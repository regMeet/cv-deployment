# Subarray con suma dada (contiguo, inputs no-negativos)

> Array desordenado de enteros no-negativos y target `S`. Encontrar cualquier subarray contiguo que sume `S`, devolver `[start, end]` o `[-1, -1]`. **Sliding window — O(n) tiempo, O(1) espacio.**

## Preguntas clarificadoras

- ¿Todos los valores no-negativos? (Crítico — sliding window solo funciona porque expandir solo crece la suma.)
- ¿Hay ceros? (Sí; afecta casos tipo `[1, 4, 0, 0, 3, 10, 5]`.)
- Múltiples soluciones — ¿cualquiera, o todas?
- ¿Valores negativos permitidos? (Si sí, sliding window falla; pasar a prefix sum + HashMap.)

## Sliding window — caso no-negativo

```java
public int[] subarraySum(int[] a, int target) {
    int n = a.length, lo = 0;
    long sum = 0;

    for (int hi = 0; hi < n; hi++) {
        sum += a[hi];
        while (sum > target && lo <= hi) {
            sum -= a[lo++];
        }
        if (sum == target) return new int[]{lo, hi};
    }
    return new int[]{-1, -1};
}
```

La ventana solo expande o achica; cada índice se mueve a lo sumo dos veces → O(n).

## Por qué importa la no-negatividad

Cuando todos los valores son ≥ 0, expandir la ventana crece monótonamente la suma, y achicar la reduce monótonamente. Esa monotonía es lo que hace que el two-pointer funcione. Con negativos, expandir puede reducir la suma — el algoritmo se pierde ventanas.

## Permitiendo negativos — prefix sum + HashMap

```java
public int[] subarraySumGeneral(int[] a, int target) {
    Map<Long, Integer> firstIndex = new HashMap<>();
    firstIndex.put(0L, -1);
    long prefix = 0;
    for (int i = 0; i < a.length; i++) {
        prefix += a[i];
        Integer j = firstIndex.get(prefix - target);
        if (j != null) return new int[]{j + 1, i};
        firstIndex.putIfAbsent(prefix, i);
    }
    return new int[]{-1, -1};
}
```

O(n) tiempo, O(n) espacio — el trade-off por aceptar negativos.

## Edge cases

- `target == 0` con array all-positive → solo matchea ventana de ceros (o vacía si no se permite).
- Toda el array suma target → devuelve `[0, n-1]`.
- Sin match → `[-1, -1]`.

## Follow-ups

- **Contar subarrays con suma target** (LeetCode 560) — mismo truco prefix-sum, contar en vez de devolver.
- **Subarray más chico con suma ≥ target** — sliding window pero minimizando largo en cada match.
