# Modified 2-color sort (0s en posiciones pares, 1s en impares)

> Array de 0s y 1s. Poner todos los 0s en índices pares, 1s en impares. Si los counts no matchean, dejar el excedente sin tocar. **Una pasada, O(1) extra, in-place.**

## Preguntas clarificadoras

- "Excedente sin tocar" — ¿mantener en su orden original? ¿Empujar al final? (Distinta semántica.)
- ¿0-indexed o 1-indexed para par/impar? (Estándar: 0-indexed; índice 0 es par.)
- ¿Orden de los elementos colocados — preservado o arbitrario?

## Solución — two-pointer sobre posiciones pares e impares

```java
public void colorSort(int[] a) {
    int n = a.length;
    int even = 0, odd = 1;
    while (even < n && odd < n) {
        if (a[even] == 0) { even += 2; continue; }   // ya correcto
        if (a[odd]  == 1) { odd  += 2; continue; }
        // a[even] == 1 y a[odd] == 0 → swap
        int t = a[even]; a[even] = a[odd]; a[odd] = t;
        even += 2;
        odd  += 2;
    }
}
```

Cada puntero solo avanza; ambos hacen a lo sumo n/2 pasos → O(n).

## Por qué esto respeta "excedente sin tocar"

Si hay más 0s que 1s, eventualmente `odd` se sale del array mientras `even` todavía tiene posiciones. Los slots `even` restantes ya contienen 0s (alcanza). Simétrico si hay más 1s. La cola sin swappear es el "excedente" — se queda en sus índices originales.

## Qué significa "sin tocar"

Leer la spec con cuidado. El ejemplo del blog muestra que el excedente **se queda en sus índices originales**, no empujado al final. El two-pointer-con-swap de arriba logra exactamente eso — solo se swappean pares (even, odd) que no matchean.

## Edge cases

- Todos ceros → 0s ya están en posiciones pares e impares; el algoritmo no hace swaps.
- Todos unos → simétrico.
- Largo 1 → sin trabajo.
- Largo 0 → trivialmente listo.

## Follow-ups

- **3-color sort** (Dutch National Flag) — tres punteros, low/mid/high. Otra familia de problemas.
- **Requisito de estabilidad** — este algoritmo NO es estable; si importa, hacer una pasada de output separada.
