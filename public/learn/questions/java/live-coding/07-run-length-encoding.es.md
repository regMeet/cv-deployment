# Run-length encoding

> Comprimir runs: `aabbbcddeef` → `a2b3cd2e2f`. Se omiten counts de 1. Una pasada, O(n) tiempo, O(1) extra (sin contar el output).

## Preguntas clarificadoras

- ¿ASCII o Unicode completo? (Cambia el iterador — `codePointAt` vs `charAt`.)
- ¿Counts que exceden 9? Confirmar que mantenemos multi-dígito (ej. `a12`).
- Round-trip — ¿también hace falta decodificar?

## Solución — una pasada con count corriente

```java
public String encode(String s) {
    if (s == null || s.isEmpty()) return "";
    StringBuilder out = new StringBuilder();
    int i = 0, n = s.length();
    while (i < n) {
        int j = i + 1;
        while (j < n && s.charAt(j) == s.charAt(i)) j++;
        int run = j - i;
        out.append(s.charAt(i));
        if (run > 1) out.append(run);
        i = j;
    }
    return out.toString();
}
```

## Decoding (espejo)

```java
public String decode(String s) {
    StringBuilder out = new StringBuilder();
    int i = 0, n = s.length();
    while (i < n) {
        char c = s.charAt(i++);
        int count = 0;
        while (i < n && Character.isDigit(s.charAt(i))) {
            count = count * 10 + (s.charAt(i++) - '0');
        }
        if (count == 0) count = 1;
        for (int k = 0; k < count; k++) out.append(c);
    }
    return out.toString();
}
```

## Edge cases

- Input vacío / un solo char.
- Input todo igual → `<c><n>`.
- Ambigüedad si el dato tiene dígitos — decirlo en voz alta; este encoding es inseguro para input con números.

## Follow-ups

- **Comprimir solo si es más corto** — devolver original si el largo encodeado ≥ original.
- **RLE a nivel de bloques en binario** — fonts bitmap, fax, BMP. Otro framing.
