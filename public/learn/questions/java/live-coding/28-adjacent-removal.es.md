# Remover pares adyacentes recursivamente

> Procesar un string tipo `abccbcba`: remover pares de chars adyacentes iguales. Después `cc` cancela → `abbcba`. Después `bb` cancela → `acba`. Sin más cancels → listo. **Stack — O(n) tiempo, O(n) espacio.**

## Preguntas clarificadoras

- ¿Removal en cascada (tras un remove, nuevas adyacencias pueden formarse y cancelar)? **Sí** — eso es lo que hace al problema no-trivial.
- ¿Solo pares, o runs de cualquier largo? (Existen variantes.)
- ¿Case-sensitive? ¿Unicode?

## Solución — stack de chars

```java
public String removeAdjacentPairs(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (!stack.isEmpty() && stack.peek() == c) {
            stack.pop();
        } else {
            stack.push(c);
        }
    }
    StringBuilder out = new StringBuilder();
    Iterator<Character> it = stack.descendingIterator();
    while (it.hasNext()) out.append(it.next());
    return out.toString();
}
```

Cada char nuevo o cancela el top o extiende el resultado. La cascada es automática: tras un pop, el char siguiente se chequea contra el nuevo top.

## Por qué stack y no manipulación in-place

*Podés* hacerlo in-place con un write index, tratando el prefijo `s[0..writeIdx]` como stack — mismo algoritmo:

```java
char[] buf = s.toCharArray();
int top = -1;
for (char c : buf) {
    if (top >= 0 && buf[top] == c) top--;
    else                            buf[++top] = c;
}
return new String(buf, 0, top + 1);
```

Más limpio; sin allocación de stack separado. **Mencionalo en entrevista** — ahorra una alocación por carácter.

## Variante — runs de largo k

LeetCode 1209: remover todo run de exactamente `k` chars idénticos. Stack de pares `(char, count)`; popear cuando count llega a `k`.

## Edge cases

- String vacío → output vacío.
- Todos chars distintos → output igual al input.
- Todos iguales (largo par) → output vacío.
- Todos iguales (largo impar) → un char queda.

## Follow-ups

- **Trackear número de remociones** — incrementar contador en cada pop.
- **Remover pares solo si son un par específico (ej. `(`, `)`)** — generaliza a validación de balanced-parens.
- **Variante K-runs** (LeetCode 1209) — misma idea con entradas `(char, count)` en el stack.
