# Encontrar el nodo común donde se mergean dos linked lists

> Dos linked lists simples pueden mergearse en algún nodo y compartir el sufijo. Devolver el nodo de merge, o `null` si no se cruzan. Estándar: O(m + n) tiempo, O(1) espacio.

## Preguntas clarificadoras

- ¿Las listas son acíclicas garantizado?
- ¿Conocemos las longitudes de antemano?
- ¿Se permite modificar in-place, o estrictamente read-only?

## El truco de dos punteros — O(m + n) tiempo, O(1) espacio

```java
class Node {
    int  value;
    Node next;
}

public Node intersection(Node a, Node b) {
    if (a == null || b == null) return null;

    Node p = a;
    Node q = b;

    while (p != q) {
        p = (p == null) ? b : p.next;
        q = (q == null) ? a : q.next;
    }
    return p;   // el nodo de merge, o null si no se cruzan
}
```

Cada puntero camina `m + n` nodos en total. Después de saltar a la otra lista una vez, ambos quedan alineados por la diferencia de longitudes y se encuentran exactamente en el nodo de merge. Si no hay merge, ambos llegan a `null` al mismo tiempo y el loop termina.

## Por qué funciona (la intuición limpia)

Sean `m`, `n` las longitudes y `c` el largo del sufijo compartido. Camino de `p`: `(m - c) + c + (n - c) = m + n - c`. Mismo para `q`. Ambos caminan distancias idénticas → colisionan al inicio del sufijo compartido.

## Alternativa — caminar por diferencia de longitudes

```java
int la = length(a), lb = length(b);
while (la > lb) { a = a.next; la--; }
while (lb > la) { b = b.next; lb--; }
while (a != b)  { a = a.next; b = b.next; }
return a;
```

Misma complejidad, más código, pero la lógica es más obvia. Algunos entrevistadores la prefieren por claridad.

## Lo que NO hay que hacer

- **HashSet de una lista, scan en la otra** — O(m + n) tiempo pero O(m) espacio. Mencionalo como baseline, después superalo.
- **Comparar valores** — mal; queremos el mismo NODO, no el mismo dato.

## Edge cases

- Cualquiera de las dos listas vacía → devolver `null`.
- Las listas son iguales (mismo head) → devolver el head.
- Sin intersección → ambos punteros llegan a `null`, loop termina limpio.

## Follow-ups

- **¿Y si una lista tiene un ciclo?** Usar Floyd primero; el problema se reduce a la versión cíclica.
- **Ambas listas tienen ciclos** — analizar si son el mismo ciclo.
