# Raíces binarias simétricas

> `bit-rev(N)` invierte los bits de `N` (los bits significativos, no los 32 completos). Una **raíz binaria simétrica** de N es un entero `A` tal que `N = A · bit-rev(A)`. Encontrar todos los A. Ejemplo: el bit-reverse de 32 bits no aplica acá — solo se invierten los bits hasta el bit más alto seteado.

## Preguntas clarificadoras

- ¿Bit-reverse sobre el ancho *mínimo* de A (most-significant bit fijo)? (Sí — `bit-rev(25) = 19` porque `25 = 11001` y reverse `10011 = 19`.)
- Rango de N — ¿entra en `long`?
- ¿Múltiples raíces posibles — devolver todas? ¿O solo una?
- ¿Cota de performance? (Brute force hasta `sqrt(N)` generalmente alcanza.)

## Solución — probar candidatos hasta √N

Para `A · bit-rev(A) = N`, al menos uno de `{A, bit-rev(A)}` es ≤ √N. Entonces enumerar candidatos hasta √N, calcular su bit-reverse, chequear el producto.

```java
import java.util.ArrayList;
import java.util.List;

public List<Long> symmetricRoots(long n) {
    List<Long> out = new ArrayList<>();
    long limit = (long) Math.sqrt(n) + 1;
    for (long a = 1; a <= limit; a++) {
        long r = bitReverse(a);
        if (a * r == n) out.add(a);
        if (r != a && r * a == n && r <= limit) out.add(r);
    }
    return out;
}

private long bitReverse(long x) {
    long r = 0;
    while (x > 0) {
        r = (r << 1) | (x & 1);
        x >>>= 1;
    }
    return r;
}
```

`bitReverse` solo flipea los bits que se usan — los ceros altos no se preservan. Eso matchea el ejemplo (`bit-rev(25) = 19`, no el reverse de 32 bits).

## Por qué √N alcanza

Si `A · bit-rev(A) = N`, entonces `min(A, bit-rev(A)) ≤ √N`. Nunca hace falta chequear más allá de √N — cada par válido tiene al menos un miembro ahí. (Cuidado con el duplicado cuando `A == bit-rev(A)` — patrón palindrómico, ej. `A = 9 = 1001`.)

## Edge cases

- N = 0 → solo `A = 0` (degenerado).
- N = 1 → `A = 1`.
- A es bit-palíndromo (`bit-rev(A) == A`) → A² = N → una entrada, no dos.
- `A = 0` no enumerado (loop empieza en 1) — generalmente intencional.

## Follow-ups

- **El A más grande que cumple la condición** — mismo loop pero trackear max en vez de collectear.
- **Bit-reverse sobre ancho fijo de 32 bits** — otro problema; LeetCode 190 usa lookup tables.
- **N no factorizable como `A · bit-rev(A)`** — devolver lista vacía.
