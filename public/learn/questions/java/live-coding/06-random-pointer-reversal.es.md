# Invertir una linked list con punteros `next` y `random`

> Cada nodo tiene dos punteros: `next` y `random`. `random` apunta a cualquier nodo de la lista (o `null`); ningún par de `random`s apunta al mismo nodo. Invertir AMBOS punteros — o sea, después de la operación, `next` recorre la lista al revés, y si originalmente `A.random == B`, después `B.random == A`. Restricción: O(1) espacio extra.

## Preguntas clarificadoras

- "Invertir `random`" significa flipear el destino (`A→B` se vuelve `B→A`), ¿correcto?
- ¿El input es acíclico por `next` garantizado? (Ciclos por `random` son inherentes al problema.)
- ¿HashMap permitido? Si sí, el problema se vuelve mucho más simple (vale la pena cotizar ambas opciones).

## Paso 1 — Invertir `next` (clásico, O(1) espacio)

```java
class Node {
    int  value;
    Node next;
    Node random;
}

private Node reverseNext(Node head) {
    Node prev = null, cur = head;
    while (cur != null) {
        Node nxt = cur.next;
        cur.next = prev;
        prev     = cur;
        cur      = nxt;
    }
    return prev;
}
```

## Paso 2 — Invertir `random`

La restricción **"ningún par de `random`s apunta al mismo nodo"** significa que cada nodo es target de a lo sumo un `random` entrante. Entonces el mapa inverso está bien definido: hay exactamente un nodo cuyo nuevo `random` debe ser cada nodo dado.

### Variante A — HashMap, O(n) espacio (escribí esta primero)

```java
public Node reverse(Node head) {
    head = reverseNext(head);

    // Map<target, source> — el nodo cuyo random viejo era target
    Map<Node, Node> incoming = new IdentityHashMap<>();
    for (Node n = head; n != null; n = n.next) {
        if (n.random != null) incoming.put(n.random, n);
    }
    for (Node n = head; n != null; n = n.next) {
        n.random = incoming.get(n);   // null si nadie apuntaba a n
    }
    return head;
}
```

Dos pasadas lineales limpias. **Usá esta en la entrevista a menos que O(1) espacio sea requisito duro** — la versión O(1) es frágil y no vale la pena bajo presión.

### Variante B — O(1) espacio (mencionala si te preguntan)

Truco: caminar la lista dos veces, usando los `random` existentes como scratch.

1. **Pasada 1** — para cada nodo `X` con `X.random == Y`, encadenar el par en una estructura temporal: setear `Y.random` a `X` DESPUÉS de guardar el random original de `Y` en algún lugar recuperable. El truco estándar es chainear a través del `next` de nodos que ya tuvieron su `next` invertido en el paso 1, pero se vuelve espinoso.
2. **Pasada 2** — limpiar.

En la práctica son 30 líneas fáciles de errar en pizarrón. **Decí que sabés que se puede, bocetá la idea, default a la Variante A por claridad.**

## Edge cases

- `head == null` → devolver null.
- Todos los `random` son null → después de la inversión deben seguir siendo null. La Variante A lo maneja naturalmente (el map queda vacío).
- Un nodo cuyo `random` apunta a sí mismo → después de la inversión, sigue apuntando a sí mismo.
- Un solo nodo → inversión de `next` trivial; `random` es null o auto-puntero, ambos sin cambio.

## Qué está testeando realmente esta pregunta

- Si sabés el patrón de inversión de listas en O(1) espacio en piloto automático.
- Si reconocés que **"ningún par de randoms apunta al mismo nodo"** es lo que hace que la inversa sea una función (no un multimap).
- Si podés intercambiar memoria por claridad sin que te lo pidan, y articular el trade-off.

## Follow-ups

- **Sin la restricción de unicidad** — ahora múltiples `random` pueden apuntar al mismo nodo. La "inversión" deja de estar bien definida; preguntale al entrevistador cómo desambiguar (¿primera ocurrencia? ¿unión en lista?).
- **Deep-clone de la lista** (LeetCode 138) — mismo modelo de `random`, op distinta. El truco interleave-y-split logra O(1) extra ahí limpio.
