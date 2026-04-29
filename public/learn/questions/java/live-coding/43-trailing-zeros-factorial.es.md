# Ceros trailing en N!

> Contar los ceros trailing de N!. Cada cero trailing es un factor de 10 = 2 · 5. Siempre hay más 2s que 5s en N!, así que **contar factores de 5: `n/5 + n/25 + n/125 + ...`**. O(log₅ N).

## Preguntas clarificadoras

- ¿N como `int` o `long`? (Afecta si la división intermedia se mantiene segura.)
- ¿`N = 0` permitido? (`0! = 1` → 0 ceros trailing.)
- ¿Solo el count, no los dígitos?

## Solución — suma de `n / 5^k`

```java
public int trailingZeros(long n) {
    int count = 0;
    while (n >= 5) {
        n /= 5;
        count += n;
    }
    return count;
}
```

`n/5` cuenta los números de 1..n divisibles por 5 (cada uno aporta al menos un factor de 5).
`n/25` cuenta los divisibles por 25 (factor extra; `25 = 5²` aporta un *segundo* 5).
Y así. Sumar.

## Por qué factores de 5, no de 2

En N!, los factores de 2 son muchísimo más abundantes que los de 5 (aproximadamente `2·n/5` a `4·n/5` más, según N). Entonces el cuello de botella para "cuántos 10s podemos formar" son los 5s. **Decí este insight primero** — es toda la intuición.

## Ejemplo paso a paso

`N = 100`:
- `100 / 5  = 20`
- `100 / 25 = 4`
- `100 / 125 = 0` → fin.
- Total: 24. (`100! = 9.33...e157`, termina exactamente en 24 ceros.)

## Baseline naive (mencionar para no parecer tonto)

Calcular N! directo: overflowea para N > 20 en `long`. `BigInteger` funciona pero es `O(N²)` tiempo y `O(N log N)` espacio. Decirlo brevemente, superarlo.

## Edge cases

- `n == 0` → 0 (loop nunca se ejecuta).
- `n < 5` → 0.
- `n == 5` → 1.
- `n` muy grande (10¹⁸) — funciona; loop corre ~26 veces.

## Follow-ups

- **Ceros trailing de `N!` en base B** — factorizar B, contar la multiplicidad de cada factor primo en N!, tomar el min dividido.
- **K-ésimo dígito trailing de N!** — mucho más difícil; relacionado al problema "último dígito no-cero de N!".
- **N más chico con exactamente M ceros trailing** — binary search sobre N, usando `trailingZeros(N)` como check monótono.
