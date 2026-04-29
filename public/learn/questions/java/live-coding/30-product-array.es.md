# Product array except self (sin división)

> Dado `A[N]`, devolver `P[N]` donde `P[i] = producto de todos los elementos excepto A[i]`. **Sin división permitida.** O(n) tiempo, O(1) espacio extra (output no cuenta).

## Preguntas clarificadoras

- ¿Hay ceros en el input? (Sin división funciona igual; con división, los ceros son el caso peligroso.)
- ¿La alocación del array de output cuenta como espacio?
- ¿Posible overflow → usar `long`?

## Solución — dos pasadas, prefix y suffix products

```java
public int[] productExceptSelf(int[] a) {
    int n = a.length;
    int[] p = new int[n];

    p[0] = 1;
    for (int i = 1; i < n; i++) p[i] = p[i - 1] * a[i - 1];   // prefix products

    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        p[i] *= suffix;                                       // multiplicar el suffix
        suffix *= a[i];
    }
    return p;
}
```

Tras pasada 1, `p[i] = A[0] · A[1] · ... · A[i-1]` (todo lo de la izquierda).
La pasada 2 multiplica el suffix corriente (todo lo de la derecha).
Final: `p[i] = (todo a la izquierda de i) · (todo a la derecha de i)`.

## Por qué sin división

División es la solución naive obvia: producto total / `a[i]`. Pero:
- Falla si hay un cero (en cualquier parte).
- Múltiples ceros → respuesta es todo ceros; un cero → solo ese índice tiene el producto no-cero, resto son cero. Muchos edge cases.
- Algunos entrevistadores la prohíben explícitamente para testear ingenio.

## Edge cases

- Un solo elemento → output es `[1]` (producto vacuo).
- Un cero → output tiene `producto_total_sin_cero` en el índice del cero, 0 en el resto.
- Dos o más ceros → output es todo ceros.
- Riesgo de overflow → usar `long[]` o documentar la asunción.

## Follow-ups

- **Range product queries** — prefix product array (con cuidado por ceros) da O(1) por query.
- **Suma en vez de producto** — mismo template prefix/suffix con `+`.
- **División permitida** — manejar count de ceros: 0 ceros → dividir; 1 cero → solo ese índice no-cero; ≥2 ceros → todo cero.
