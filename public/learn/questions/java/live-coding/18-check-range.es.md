# Verificar si los valores del array son exactamente el rango entero [N, N+M-1]

> Array desordenado de M enteros. Decidir si sus valores son exactamente `{N, N+1, ..., N+M-1}` (cualquier orden, sin duplicados permitidos... ¿o sí?). La spec del blog acepta duplicados mientras `max - min + 1 == M` — clarificar en entrevista.

## Preguntas clarificadoras

- "Consiste de números en el rango" — ¿significa que el array ES el rango exactamente, o solo está contenido en él?
- ¿Duplicados permitidos? (La spec define qué check es el correcto.)
- ¿Devuelve solo boolean, o también los límites del rango?

## Interpretación naive — el bag de valores debe ser exactamente el rango

```java
public boolean isExactRange(int[] a) {
    if (a == null || a.length == 0) return true;
    int min = a[0], max = a[0];
    long sum = 0;
    boolean[] seen = null;
    for (int v : a) { min = Math.min(min, v); max = Math.max(max, v); }
    if (max - min + 1 != a.length) return false;

    seen = new boolean[a.length];
    for (int v : a) {
        int idx = v - min;
        if (seen[idx]) return false;     // duplicado detectado
        seen[idx] = true;
    }
    return true;
}
```

O(n) tiempo, O(n) espacio. Dos pasadas: una para bounds, otra para verificar unicidad con boolean array.

## O(1) espacio — truco de suma + suma-de-cuadrados

Si los duplicados están prohibidos, podés verificar con dos identidades aritméticas:

- `sum(values) == M·N + M(M-1)/2`
- `sum(values²) == sum_{k=N}^{N+M-1} k²` (forma cerrada disponible)

Si ambas matchean → el array es exactamente el rango sin duplicados. **Cuidado con overflow** — usar `long`. Útil en entrevistas para discutir; el boolean-array es más claro.

## La interpretación más laxa del blog

El blog dice que `{1,3,1}` devuelve true con N=1, M=3 (rango 1..3). Eso es solo `max - min + 1 == M`. **Una pasada, O(1) espacio:**

```java
public boolean isWithinTightRange(int[] a) {
    int min = a[0], max = a[0];
    for (int v : a) { min = Math.min(min, v); max = Math.max(max, v); }
    return max - min + 1 == a.length;
}
```

Trivialmente correcto, pero permite duplicados y tiene semántica rara — confirmar que es lo que se quiere antes de comprometerse.

## Edge cases

- Array vacío → vacuamente true (o throw — spec).
- Un solo elemento → siempre true.
- Overflow cuando `max - min + 1` excede int → usar `long`.

## Follow-ups

- **Encontrar el número faltante** — mismo setup, suma o XOR (LeetCode 268).
- **Faltante Y duplicado** (set-mismatch) — suma + suma-de-cuadrados da un sistema de 2 ecuaciones.
