# Memory leaks en Java (¿con GC?)

> "Java tiene GC, así que no puede tener memory leaks" → mal. El GC libera objetos **sin referencias**, no objetos que ya no **necesitás**.

## Definición

> Un memory leak en Java pasa cuando los objetos ya no son necesarios pero **siguen siendo alcanzables** vía referencias, impidiendo que el GC los recupere.

## El ejemplo clásico

```java
List<Object> cache = new ArrayList<>();

public void process() {
    Object data = loadHugeData();
    cache.add(data);   // 💥 cache crece y nunca elimina
}
```

Para el GC: mientras `cache` referencie `data`, está "vivo". Lógicamente muerto, técnicamente vivo.

## Causas comunes

- **Colecciones estáticas** que crecen sin tope (`Map`, `List` declarados `static`).
- **Caches sin eviction** — sin TTL, sin max size.
- **Listeners / observers** registrados y nunca desregistrados.
- **`ThreadLocal` mal usado** en thread pools — el worker thread se reusa, el `ThreadLocal` nunca se limpia, el valor queda para siempre.
- **Classloader leaks** — comunes en app servers con hot-reload (Tomcat, Jetty).
- **Recursos no cerrados** que mantienen referencias (streams, connections, callbacks).

## Frase para entrevista

> "Garbage collection doesn't prevent memory leaks. It collects objects that are no longer referenced. Memory leaks happen when objects are still referenced but no longer needed — usually caches, static collections, listeners, `ThreadLocal` misuse, or classloader leaks."
