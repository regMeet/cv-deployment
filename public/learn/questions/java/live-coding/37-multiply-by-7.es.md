# Multiplicar por 7 sin usar `*`

> `7 · N == 8 · N − N == (N << 3) − N`. Un shift y una resta. **Más brainteaser que optimización real** — los compiladores modernos hacen esto solos.

## Preguntas clarificadoras

- ¿Negativos OK?
- ¿Preocupaciones de overflow? (`(N << 3)` shiftea el bit de signo si `N` es grande.)
- ¿Resta permitida (o solo bitwise)?

## Solución

```java
public int multiplyBy7(int n) {
    return (n << 3) - n;
}
```

Eso es todo. Misma idea generaliza a cualquier constante de la forma `2^k - c` o `2^k + c`.

## Por qué existió este truco

En CPUs de los 80, el multiply entero era 10-30× más lento que shift-and-add. CPUs modernas multiplican en 3-5 ciclos, así que el truco es obsoleto en performance. **Por qué se sigue preguntando**: testea si ves la estructura binaria de los enteros.

## Generalización

```
N · 5  = (N << 2) + N            // 4N + N
N · 9  = (N << 3) + N            // 8N + N
N · 10 = (N << 3) + (N << 1)     // 8N + 2N
N · 15 = (N << 4) - N            // 16N - N
```

Los compiladores (GCC, javac+JIT) hacen estos transforms automáticamente.

## Cuidado con overflow

`(n << 3)` overflowea cuando `n > Integer.MAX_VALUE / 8`. La resta puede producir un valor que *parece* correcto por wraparound, pero el estado intermedio estaba mal. Usar `long` si `n` puede ser grande:

```java
public long multiplyBy7Safe(int n) {
    return ((long) n << 3) - n;
}
```

## Edge cases

- `n == 0` → devuelve 0.
- `n == Integer.MIN_VALUE` → `(n << 3)` es wraparound complemento-a-dos; puede producir resultado incorrecto.
- `n` negativo — shift es aritméticamente equivalente para `<<`; funciona bien.

## Follow-ups

- **Multiplicar por constantes sin `*` y solo `+`/`-`/shift** — shift-and-add repetido.
- **Multiplicar por entero arbitrario** — algoritmo de Booth o shift-and-add por bit seteado del multiplicador.
- **Dividir por 7** — mucho más difícil; involucra iteración tipo Newton-Raphson o magic constants.
