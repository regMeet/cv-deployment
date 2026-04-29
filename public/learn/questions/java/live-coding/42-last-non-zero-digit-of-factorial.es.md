# Último dígito no-cero de N!

> Calcular el dígito no-cero más a la derecha de N! sin computar N! (que overflowea rápido). El truco: **contar y sacar los factores de 5, aparearlos con los factores de 2 (que causan ceros trailing), y trackear el residuo mod 10 del producto restante.** Muchas soluciones publicadas son sutilmente erróneas; el approach correcto canónico usa recursión sobre N/5.

## Preguntas clarificadoras

- ¿N como int o long? (Para N hasta ~10⁶, todos los algoritmos funcionan; para N hasta 10¹⁸, solo el recursivo escala.)
- ¿N! definido para `N == 0`? (`0! = 1` → último dígito es 1.)
- Performance — ¿O(N) aceptable, o hace falta O(log N)?

## O(log N) — recursivo sobre N/5

La recurrencia (demostrada en textos de teoría de números; forma común):

```
D(0) = 1
D(N) = (lastDigitOfBlock(N % 10) · 4^(N/5 mod 4) · D(N/5)) mod 10
```

`lastDigitOfBlock(r)` es el último dígito no-cero del producto `1 · 2 · ... · r` tras sacar los factores de 5 (que siempre se aparean con los 2s que crean ceros trailing). Se tabula para `r ∈ {0..9}`.

```java
public int lastNonZeroDigit(long n) {
    if (n < 10) {
        int[] table = {1, 1, 2, 6, 4, 2, 2, 4, 2, 8};
        return table[(int) n];
    }
    long blocks = n / 5;
    int  rem    = (int) (n % 10);
    int  block  = lastNonZeroDigit(blocks);
    int  tail   = (int) Math.pow(4, blocks % 4) % 10;
    int[] table = {1, 1, 2, 6, 4, 2, 2, 4, 2, 8};
    return (block * tail * table[rem]) % 10;
}
```

Profundidad de recursión ~log₅(N) — entra cómodo incluso para N = 10¹⁸.

## Por qué es difícil

Tres cosas conspiran:

1. **Factores de 2 y 5 se aparean para hacer 10s** (ceros trailing). Hay que sacarlos con cuidado.
2. Tras sacar los 5s, los **factores de 2** sobrantes (sin par) contribuyen un factor multiplicativo `2^(extra)` mod 10, que tiene **período 4** (`2, 4, 8, 6, 2, 4, 8, 6, ...`).
3. El producto de dígitos 1..9 (sin 5) mod 10 es a su vez periódico en el dígito de unidades de N.

La forma recursiva combina todo en una expresión prolija.

## Baseline O(N) — empezá por esta

```java
public int lastNonZeroDigitNaive(int n) {
    long product = 1;
    for (int i = 2; i <= n; i++) {
        long v = i;
        while (v % 10 == 0) v /= 10;
        product *= v;
        while (product % 10 == 0) product /= 10;
        product %= 1_000_000_000L;          // mantener chico
    }
    return (int) (product % 10);
}
```

Sacás ceros trailing de `i` y del running product; truncás para acotar magnitud. Funciona para N hasta ~10⁶ cómodo. **En entrevista, escribí esta primero y discutí la versión log verbal** salvo que te lo pidan explícitamente.

## Edge cases

- `n == 0` o `n == 1` → factorial es 1; último no-cero 1.
- `n == 5` → `120`; último no-cero 2.
- `n == 10` → `3628800`; último no-cero 8.
- `n` muy grande → solo la versión recursiva log-N sobrevive.

## Follow-ups

- **Count de ceros trailing de N!** — otro problema, más simple: `n/5 + n/25 + n/125 + ...`.
- **Últimos K dígitos no-cero de N!** — generalización; mod `10^K` y misma lógica de strip de factores.
- **Último no-cero de N!! (doble factorial)** — otra recurrencia.
