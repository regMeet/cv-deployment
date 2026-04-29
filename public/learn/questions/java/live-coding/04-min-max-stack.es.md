# Min-Max Stack — push, pop, min, max todo en O(1)

> Implementar un stack que soporta `push`, `pop`, `min` y `max` en O(1). La respuesta naive es O(n) para min/max — la respuesta senior usa dos stacks auxiliares con los extremos corrientes.

## Preguntas clarificadoras

- ¿Vamos a hacer pop sobre stack vacío alguna vez? ¿Tirar excepción o devolver null?
- ¿Presupuesto de memoria? (Los stacks auxiliares pueden usar hasta 2× los datos — hay una variante más compacta.)
- ¿Se permiten duplicados? Afecta si pusheamos al aux cuando el valor es igual al corriente.

## Dos stacks auxiliares — O(1) para todo

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class MinMaxStack {

    private final Deque<Integer> data = new ArrayDeque<>();
    private final Deque<Integer> mins = new ArrayDeque<>();
    private final Deque<Integer> maxs = new ArrayDeque<>();

    public void push(int v) {
        data.push(v);
        mins.push(mins.isEmpty() ? v : Math.min(v, mins.peek()));
        maxs.push(maxs.isEmpty() ? v : Math.max(v, maxs.peek()));
    }

    public int pop() {
        if (data.isEmpty()) throw new IllegalStateException("empty");
        mins.pop();
        maxs.pop();
        return data.pop();
    }

    public int min() { return mins.peek(); }
    public int max() { return maxs.peek(); }
}
```

`mins`/`maxs` trackean el **mínimo/máximo corriente** en cada nivel del stack. Al hacer pop, popear los tres mantiene todo sincronizado.

## Por qué duplicar el min en cada push está OK

Podrías tentarte a pushear a `mins` solo cuando el nuevo valor es menor. Eso rompe pop:

> Push 3, 5, 5, 5. Si solo pusheaste 3 a `mins`, después popeás un 5 de arriba → `mins.peek()` sigue siendo 3 (correcto), popeás de nuevo → 3 (correcto), popeás → 3. El bug en realidad aparece con `max` y valores iguales.

Pushear en todos los niveles mantiene la invariante trivial.

## Variante compacta — un solo stack, guardar deltas

En vez de dos stacks extra, guardar `value - currentMin` (en `long` para evitar overflow). Al popear, si el delta es negativo, el valor popeado ERA el min, y recuperás el min anterior. Ahorra memoria; cuesta más razonar.

```java
// boceto — detalle de entrevista solo si te lo piden
public void push(int v) {
    if (data.isEmpty()) { min = v; data.push(0L); }
    else {
        data.push((long) v - min);
        if (v < min) min = v;
    }
}
```

Mencionalo si el entrevistador pregunta "¿podés mejorar la memoria?".

## Edge cases

- Pop sobre vacío → tirar `IllegalStateException` (o lo que diga la spec).
- Un solo elemento → los tres stacks tienen una entrada.
- Valores iguales → pushear siempre; NO skipear en igualdad.

## Follow-ups

- **Min-Max Queue** — más difícil; necesita una estructura monotónica con deque.
- **Versión concurrente** — `ReentrantLock` alrededor de las cuatro ops, o un stack persistente inmutable.
