# Sumar dos enteros sin `+` ni operadores aritméticos

> Implementar suma con solo operadores bitwise. **XOR computa la suma sin carry; AND-y-shift computa el carry. Repetir hasta que el carry sea cero.**

## Preguntas clarificadoras

- ¿Negativos permitidos? (Sí — `int` en Java es complemento a dos; el algoritmo maneja negativos nativamente.)
- ¿Comportamiento de overflow — wraparound o throw? (Default wraparound, como `+`.)
- Permitidos: bitwise `& | ^ << >> ~`? Confirmar.

## Solución — XOR para sum-sin-carry, AND-shift para carry

```java
public int add(int a, int b) {
    while (b != 0) {
        int carry = a & b;
        a = a ^ b;
        b = carry << 1;
    }
    return a;
}
```

En cada iteración:
- `a ^ b` es la suma *sin carries* (XOR bit-a-bit).
- `a & b` son los bits donde se generaría carry.
- Shift del carry a izquierda 1 (porque los carries propagan a la siguiente posición) y re-sumar.

El "re-sumar" es recursivo — pero cada iteración mueve el carry hacia la izquierda, así que el loop termina en ~32 pasos (bits en `int`).

## Por qué termina

El carry, tras el shift, tiene al menos un cero trailing — y sobre iteraciones, el patrón del carry migra estrictamente hacia arriba. Eventualmente, o el carry llega a cero o se sale del rango (que en Java es wraparound complemento-a-dos definido y termina igual).

## Negativos

Java usa complemento a dos, así que `-3` es `0xFFFFFFFD`. El algoritmo funciona sin cambios porque XOR/AND/shift son agnósticos a signed/unsigned. Probá `add(5, -3)`:

```
a=5  (0101), b=-3 (...11111101)
a^b = ...11111000   (-8)
a&b = 0101 & ...11111101 = 0101 (5)
shift = 0101 << 1 = 1010 (10)
... eventualmente a = 2, b = 0
```

## Edge cases

- `b == 0` → devolver `a` directo.
- `a == 0 && b == 0` → devuelve 0; el carry nunca entra al loop.
- `Integer.MIN_VALUE + Integer.MIN_VALUE` → wrappea a 0 (matchea `+`).

## Follow-ups

- **Restar** — `a - b == add(a, ~b + 1)`, pero `+1` usa el operador prohibido. Usar `add(a, add(~b, 1))`.
- **Multiplicar** — shift-and-add repetido: para cada bit seteado `i` de `b`, sumar `a << i` al resultado.
- **Dividir** — resta repetida con shifting; más complicado con signos.
