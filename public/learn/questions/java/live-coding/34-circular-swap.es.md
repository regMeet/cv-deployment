# Swap circular de tres variables en un solo statement

> Dados `a, b, c`, rotar tal que `a ← b, b ← c, c ← a` — en **un solo statement** sin variable temporal. El truco: combinar la auto-inversa de XOR con asignación-como-expresión.

## Preguntas clarificadoras

- "Un solo statement" — ¿incluye asignaciones separadas por comas, o estrictamente una expresión?
- Java específicamente: las asignaciones-como-expresión no componen tan limpio como en C. Confirmar lenguaje.
- Permitido en Java: un solo statement con cadena de side effects.

## Solución estilo C (la del blog)

```c
a = a ^ b ^ c ^ (b = c) ^ (c = a);
```

Por qué funciona (de izquierda a derecha):

1. Calcular `a ^ b ^ c` con los valores **originales**.
2. Evaluar `b = c` — side effect: `b` toma el valor del viejo `c`, y la expresión vale el viejo `c`.
3. XOR con eso: `a ^ b ^ c ^ c = a ^ b`.
4. Evaluar `c = a` — en este punto `a` sigue siendo su valor original (la asignación no se completó aún). Side effect: `c ← a original`. Valor: a original.
5. XOR con eso: `a ^ b ^ a = b`. Entonces el valor final asignado a `a` es `b`.

Tras el statement: `a = b viejo`, `b = c viejo`, `c = a viejo`. ✓

## En Java

Java garantiza orden de evaluación left-to-right de operandos, y una expresión de asignación vale lo asignado. El truco de C se traduce literal, con una salvedad importante sobre orden de evaluación bien definido (lo está, en Java):

```java
public int[] circularSwap(int a, int b, int c) {
    int[] r = new int[3];
    r[0] = a; r[1] = b; r[2] = c;
    r[0] = r[0] ^ r[1] ^ r[2] ^ (r[1] = r[2]) ^ (r[2] = r[0]);
    return r;   // r = {b viejo, c viejo, a viejo}
}
```

## Por qué es básicamente un truco de salón

- **Ilegible** — todo reviewer lo va a reescribir.
- **UB en C**: en C, modificar y leer una variable sin sequence point es UB. El snippet original del blog `a = a^b^c^(b=c)^(c=a)` es técnicamente UB en C/C++. **Java está OK** porque el orden de evaluación de operandos está definido.
- El swap simple usa un temp:
  ```java
  int t = a; a = b; b = c; c = t;
  ```

## Edge cases

- `a == b`, `b == c`, etc. — XOR cancela sin daño; la rotación funciona.
- Los tres iguales → sin cambio observable.

## Follow-ups

- **Swap XOR de dos variables** — `a ^= b; b ^= a; a ^= b;` Mismo truco, famoso. Falla con aliasing (`&a == &b`) — ambos quedan 0.
- **Rotar K de N variables** — rotación de array; el truco O(1) es reverse-reverse-reverse.
