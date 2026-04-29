# Invertir una linked list simple

> Clásico de calentamiento. El estándar a nivel senior es hacerlo iterativo en O(1) de espacio extra, manejando edge cases sin pensar.

## Preguntas clarificadoras

- ¿Simply o doubly linked?
- ¿Mutación in-place OK, o hay que preservar la original?
- ¿Recursión aceptable, o O(1) espacio estricto?

## Solución iterativa — O(n) tiempo, O(1) espacio

```java
class Node {
    int  value;
    Node next;
}

public Node reverse(Node head) {
    Node prev = null;
    Node cur  = head;

    while (cur != null) {
        Node nxt = cur.next;   // guardar antes de pisarlo
        cur.next = prev;       // invertir puntero
        prev     = cur;
        cur      = nxt;
    }
    return prev;               // nuevo head
}
```

El truco es la danza de cuatro líneas: capturar `next` primero, después re-apuntar, después avanzar `prev` y `cur`. Si te equivocás de orden, dejás huérfano el resto de la lista.

## Solución recursiva

```java
public Node reverseRec(Node head) {
    if (head == null || head.next == null) return head;
    Node newHead   = reverseRec(head.next);
    head.next.next = head;     // hacer que el siguiente apunte para atrás
    head.next      = null;     // soltar el link viejo hacia adelante
    return newHead;
}
```

Elegante, pero O(n) en stack — en una lista de 1M nodos te explota el stack. **En entrevista, escribí primero la iterativa**, después mencionás recursión como alternativa.

## Edge cases para mencionar en voz alta

- `head == null` → devolver null.
- Un solo nodo → devolver head sin cambios.
- Dos nodos → cubierto por el loop (acá se esconden los off-by-one).

## Follow-ups

- **Invertir en grupos de k** (LeetCode 25) — misma idea, aplicada por chunk.
- **Invertir entre posiciones m y n** — partir, invertir el medio, re-empalmar.
- **Doubly linked list** — también swappear `prev` en cada nodo.
