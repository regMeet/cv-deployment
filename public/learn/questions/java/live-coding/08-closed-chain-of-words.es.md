# Closed chain of words — ¿existe un circuito Euleriano?

> Las palabras encadenan si el último char de W1 = primer char de W2. Decidir si existe una cadena cerrada que use TODAS las palabras. Ejemplo: `{abc, gha, efg, cde}` → `abc → cde → efg → gha → abc` ✓. Esto es **circuito Euleriano en un multigrafo dirigido** donde cada palabra es una arista de su primer char a su último char.

## Preguntas clarificadoras

- ¿Hay que usar cada palabra **exactamente una vez**? (Sí — circuito Euleriano, no Hamiltoniano.)
- ¿Pueden repetirse palabras en el input? ¿Son distintas? (Tratar como multi-aristas igual.)
- ¿Qué alfabeto — 26 minúsculas, ASCII, Unicode completo?

## Solución — condiciones de circuito Euleriano en grafo dirigido

Un multigrafo dirigido tiene circuito Euleriano sii:
1. Todo vértice tiene `in-degree == out-degree`.
2. Todos los vértices con grado no-cero están en una sola componente fuertemente conexa (los de grado cero se ignoran).

```java
public boolean hasClosedChain(String[] words) {
    int[] in  = new int[26];
    int[] out = new int[26];
    int[] parent = new int[26];
    for (int i = 0; i < 26; i++) parent[i] = i;

    for (String w : words) {
        if (w == null || w.isEmpty()) continue;
        int u = w.charAt(0) - 'a';
        int v = w.charAt(w.length() - 1) - 'a';
        out[u]++;
        in[v]++;
        union(parent, u, v);
    }

    int root = -1;
    for (int i = 0; i < 26; i++) {
        if (in[i] != out[i]) return false;          // condición 1
        if (in[i] + out[i] > 0) {                    // condición 2 — una sola componente
            int r = find(parent, i);
            if (root == -1) root = r;
            else if (root != r) return false;
        }
    }
    return root != -1;   // input vacío no tiene cadena cerrada
}

private int find(int[] p, int x) {
    while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
    return x;
}
private void union(int[] p, int a, int b) {
    p[find(p, a)] = find(p, b);
}
```

La conectividad acá se chequea sobre el **grafo subyacente no-dirigido** — es un check suficiente si la condición 1 se cumple (resultado conocido de teoría de grafos). Evita el costo de SCC.

Complejidad: O(N · L · α(26)) — efectivamente lineal.

## Por qué modelar como aristas, no vértices

Las palabras son las *aristas* (primer char → último char), no los vértices. Hay a lo sumo 26 vértices sin importar el tamaño del input — por eso esto es rápido y el array in/out es tan chico.

## Edge cases

- Input vacío → devolver `false` (o `true` según la spec — clarificar).
- Una sola palabra que empieza y termina con la misma letra → self-loop; cadena cerrada existe trivialmente.
- Palabras aisladas en distintas letras (sin chars compartidos) → falla conectividad.

## Follow-ups

- **Construir la cadena**, no solo decidir existencia — Hierholzer en O(E).
- **Cadena abierta (camino Euleriano, no circuito)** — exactamente un vértice con out − in = 1, uno con in − out = 1, resto balanceados.
