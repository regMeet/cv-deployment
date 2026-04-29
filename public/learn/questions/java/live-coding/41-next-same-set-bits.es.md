# Próximo entero con el mismo número de bits seteados

> Dado N, encontrar el M > N más chico con el mismo `bitCount`. Ejemplo: `N = 10 (1010)` → `M = 12 (1100)`. **El truco "snoob"** — sale en Hacker's Delight y es la op base de Gosper's hack (enumeración combinatoria).

## Preguntas clarificadoras

- ¿N solo positivo? (Sí, estándar.)
- ¿32 o 64 bits?
- ¿Y si N es e.g. `0b111...1000` y no hay valor con el mismo bitcount dentro del rango de int?

## Truco snoob (Hacker's Delight)

```java
public int nextSameBits(int n) {
    int c = n & -n;                  // bit seteado más bajo
    int r = n + c;                   // ripple-add: convierte el run trailing en un bit
    int ones = ((n ^ r) >>> 2) / c;  // count de unos a redistribuir (shifteados)
    return r | ones;
}
```

Lo que pasa conceptualmente:

1. `c` aísla el bit seteado más bajo.
2. `n + c` flipea el run trailing de 1s a un bit más alto, ceando los anteriores. El bitcount de `r` ahora es `bitCount(n) - (unos en el run trailing) + 1`.
3. Hay que reponer los unos faltantes en las posiciones más bajas posibles.
4. `(n ^ r)` resalta los bits que cambiaron; shiftear y dividir por `c` los reacomoda en el extremo LSB.
5. OR los bits reacomodados en `r` para la respuesta.

## Ejemplo paso a paso

```
n     = 0b00010110   (decimal 22; 3 bits seteados)
c     = 0b00000010   (bit seteado más bajo)
r     = 0b00011000   (tras add — colapsa trailing 110 → 1000)
n^r   = 0b00001110   (bits que cambiaron)
shift = 0b00000011   ((n^r >> 2) / c = 0b00000011)
result = 0b00011011   (decimal 27 — mismos 3 bits, más chico > n)
```

## Por qué es famoso

Lo usa Gosper's hack para enumerar todos los subsets de k elementos de n en orden creciente de bitmask. Fundamental para generación combinatoria. Vale memorizar el patrón.

## Edge cases

- `n == 0` → sin bits seteados; no hay sucesor. Devolver 0 o throw.
- `n` ya tiene los bits en las posiciones más altas (e.g. `0b1110...0000`) → el siguiente overflowearía. Devuelve 0 o wrappea; documentar.
- Un solo bit seteado → siguiente es `n << 1` (único valor con un bit y mayor).
- `n == Integer.MAX_VALUE` → sin sucesor en rango int; wrappea.

## Follow-ups

- **Entero previo con mismo bitcount** — truco simétrico (Hacker's Delight también lo tiene).
- **Generar todos los subsets de tamaño k de un set de n** — iteración de Gosper's hack arrancando en `(1 << k) - 1`.
- **Por qué `>>> 2`** — primero el run trailing pasa de `c << 0 + c << 1 + ... = (c << k) - c` a `c << k`, contribuyendo `k - 1` unos a redistribuir; el shift compensa eso.
