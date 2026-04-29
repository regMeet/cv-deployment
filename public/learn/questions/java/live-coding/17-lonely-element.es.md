# Encontrar el elemento solitario con XOR

> Array de tamaño 2N+1: cada valor aparece exactamente dos veces excepto uno que aparece una sola. Encontrarlo. **O(n) tiempo, O(1) espacio.** XOR de todo.

## Preguntas clarificadoras

- ¿Los valores son enteros arbitrarios o están acotados? (XOR funciona sin importar el rango.)
- ¿El solitario puede ser 0? (Sí; XOR sigue funcionando.)
- ¿Siempre exactamente un solitario? (Si hay cero o muchos, el algoritmo necesita ajuste.)

## Solución — XOR de todos los elementos

```java
public int lonely(int[] a) {
    int x = 0;
    for (int v : a) x ^= v;
    return x;
}
```

Tres propiedades de XOR cargan toda la demostración:

1. `a ^ a == 0`
2. `a ^ 0 == a`
3. XOR es asociativo y conmutativo

Apareás los duplicados → cada par XORea a 0. El solitario XOReado contra cero es él mismo.

## Por qué HashMap es la respuesta incorrecta acá

HashMap con counts funciona (O(n) tiempo, O(n) espacio) pero estás regalando un win obvio de O(1) espacio. **Mencionalo y después superalo con XOR.** Señal senior.

## Edge cases

- Array de un solo elemento → ese es la respuesta.
- Solitario es 0 → XOR resultado es 0; correcto.
- Array vacío → XOR resultado es 0; según la spec, throw o devolver 0.

## Follow-ups

- **Dos solitarios** (resto duplicados; LeetCode 260) — XOR de todo → resultado es `a ^ b`. Elegir un bit donde difieren, particionar el array por ese bit, XOR cada mitad → recuperás ambos.
- **Uno aparece una vez, el resto tres veces** (LeetCode 137) — aritmética modular bit-a-bit mod 3. Más limpio: dos acumuladores (`ones`, `twos`).
- **Versión ordenada** — pares de duplicados no cruzan el solitario; binary search del borde en O(log n).
