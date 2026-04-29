# ¿N es de la forma 2^x − 2^y (con x > y > 0)?

> Decidir si N puede escribirse como `2^x − 2^y`. Equivalentemente: en binario, N es un run contiguo de 1s, que NO toca el bit 0 (porque `y > 0`). **O(1) bit-twiddling.**

## Preguntas clarificadoras

- `x > y > 0` — estricto, así que `y ≥ 1`. Significa que N es par.
- ¿N solo positivo? (Sí según la spec.)
- ¿Ancho de bits? (`int` o `long` de Java.)

## La vista del patrón de bits

`2^x − 2^y` en binario es `(2^(x-y) − 1) << y` — un run de `(x-y)` 1s consecutivos, shifteado a izquierda por `y`. Ejemplos:
- `2^4 − 2^1 = 14 = 1110`
- `2^5 − 2^2 = 28 = 11100`
- `2^3 − 2^1 = 6  = 110`

Entonces el test es: **"los bits seteados en N forman un único run contiguo, Y el bit 0 es 0."**

## Solución

```java
public boolean isDifferenceOfPowers(int n) {
    if (n < 2) return false;
    if ((n & 1) != 0) return false;            // bit 0 debe ser 0 (y > 0)
    // sacar los ceros trailing
    while ((n & 1) == 0) n >>>= 1;
    // ahora n debe ser 2^k - 1, o sea todo 1s
    return ((n + 1) & n) == 0;                  // power-of-two test sobre n+1
}
```

Tras sacar los ceros trailing, lo que queda debe ser todo 1s. Sumar 1 a todo-1s da una potencia de dos; AND con el original da 0.

## El truco del blog (alternativo)

```java
public boolean isDifferenceOfPowers2(int n) {
    if (n < 2 || (n & 1) != 0) return false;
    int m = n | (n - 1);          // poner en 1 todos los bits debajo del más alto seteado
    return ((m + 1) & m) == 0;
}
```

`n | (n-1)` flipea todos los bits debajo del más alto seteado, produciendo `0b...0111...1`. Si N era un run contiguo, esto da todo 1s hasta el bit más alto. `m + 1` es entonces una potencia de dos sii `m` era todo-1s en el patrón correcto.

## Edge cases

- `n == 0` → no expresable.
- `n == 1` → `2^1 − 2^0 = 1` pero la spec dice `y > 0`, rechazar.
- `n` impar → bit 0 seteado; no expresable (`y ≥ 1`).
- `n == 2` → necesitaría `x = 2, y = 0` (rechazado) o un edge similar; rechazar.

## Follow-ups

- **Suma de potencias de 2** (`2^x + 2^y`) — otro problema; chequear que N tenga exactamente dos bits seteados.
- **N como `2^x · k`** — chequear trailing zeros vs cociente impar.
