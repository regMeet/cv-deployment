# ¿N es de la forma 2^x + 2^y (con x ≠ y, ambos positivos)?

> Decidir si N puede escribirse como `2^x + 2^y` con exponentes distintos. Equivalentemente: **N tiene exactamente dos bits seteados en binario.** O(1).

## Preguntas clarificadoras

- ¿`x` y `y` distintos? (Si no, `2·2^x = 2^(x+1)`, una sola potencia — clarificar.)
- ¿Ambos positivos (`x, y ≥ 1`)? Afecta el manejo del bit 0.
- ¿N entra en `int`?

## Solución — contar bits seteados

```java
public boolean isSumOfPowers(int n) {
    if (n <= 0) return false;
    return Integer.bitCount(n) == 2;
}
```

Si N tiene exactamente dos 1-bits en posiciones `i` y `j`, entonces `N = 2^i + 2^j` con `i ≠ j`. Trivial.

## Sin `Integer.bitCount` — clear-rightmost-bit dos veces

```java
public boolean isSumOfPowersManual(int n) {
    if (n <= 0) return false;
    n &= (n - 1);          // borra el bit seteado más bajo
    if (n == 0) return false;   // tenía solo 1 bit
    n &= (n - 1);          // borra el siguiente más bajo
    return n == 0;         // todos los bits borrados → exactamente 2 originalmente
}
```

`n & (n-1)` es el idiom canónico de "tirar el bit seteado más bajo". Aplicarlo dos veces — debe quedar en cero — confirma exactamente 2 bits seteados.

## Si `x, y > 0` es requisito (sin bit-0)

```java
public boolean isSumOfPowersStrict(int n) {
    if ((n & 1) != 0) return false;     // bit 0 seteado → uno de x o y es 0
    return Integer.bitCount(n) == 2;
}
```

## Edge cases

- `n == 0` → no.
- `n == 1` → solo un bit; no.
- `n == 2` → solo bit 1; no (necesita dos distintos).
- `n == 3` → bits 0 y 1; **sí** si `x, y ≥ 0` permitido; no si ambos deben ser positivos.
- `n` negativo (complemento a dos) → rechazar.

## Follow-ups

- **Suma de K potencias de 2** — `Integer.bitCount(n) == K`.
- **Diferencia de potencias de 2** — otro problema; run contiguo de 1s.
- **Descomponer N en el *mínimo* número de potencias de 2** — eso es `bitCount(n)` (cada bit seteado es una potencia).
