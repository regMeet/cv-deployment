# Encontrar el elemento repetido en un array 1..N-1 de tamaño N

> Array de tamaño N que contiene cada entero de 1 a N-1, con exactamente uno repetido. Encontrar el repetido. **O(n) tiempo, O(1) espacio.**

## Preguntas clarificadoras

- ¿Exactamente un repetido (no múltiples)?
- ¿Los valores entran en `int`? (Con el truco de suma, cuidado con overflow.)
- ¿Se permite modificar in-place? (Habilita una tercera opción.)

## Solución 1 — truco de suma

```java
public int repeated(int[] a) {
    long sum = 0;
    int n = a.length;
    for (int v : a) sum += v;
    return (int) (sum - (long) n * (n - 1) / 2);   // suma esperada de 1..n-1
}
```

La suma esperada de `1..n-1` es `n(n-1)/2`. La suma real excede a la esperada exactamente en el valor duplicado.

**Cuidado con overflow** — para N grande, ambas sumas necesitan `long`.

## Solución 2 — XOR (a prueba de overflow)

```java
public int repeatedXor(int[] a) {
    int x = 0;
    for (int v : a) x ^= v;
    for (int i = 1; i <= a.length - 1; i++) x ^= i;
    return x;
}
```

XOR de todos los valores del array XOReado contra XOR de `1..n-1` cancela todo excepto el duplicado. Sin riesgo de overflow.

## Solución 3 — Floyd's cycle detection (cuando no se puede modificar in-place y se pide `O(1)` estricto)

Tratá el array como una función `i → a[i]`. Como un valor se repite, dos índices mapean al mismo nodo — hay ciclo. Aplicá tortoise-and-hare para encontrar la entrada del ciclo.

```java
public int repeatedFloyd(int[] a) {
    int slow = a[0], fast = a[0];
    do { slow = a[slow]; fast = a[a[fast]]; } while (slow != fast);
    slow = a[0];
    while (slow != fast) { slow = a[slow]; fast = a[fast]; }
    return slow;
}
```

LeetCode 287 — más elegante cuando el array no se puede modificar y el overflow es preocupación.

## Para floats en [0, 1] (el bonus del blog)

Suma y XOR fallan (XOR no definido; suma imprecisa con floats). Usar **HashSet**: O(n) tiempo, O(n) espacio. No hay truco de O(1) para floats arbitrarios.

## Edge cases

- Duplicado al inicio vs al final → los tres algoritmos lo manejan.
- N = 1 → input inválido (no hay valores en 1..0); throw o devolver -1.

## Follow-ups

- **Encontrar faltante Y repetido** simultáneamente — una pasada con suma + suma-de-cuadrados (dos ecuaciones).
- **Múltiples repetidos** — el truco de suma falla; usar frequency counting en O(n) extra.
