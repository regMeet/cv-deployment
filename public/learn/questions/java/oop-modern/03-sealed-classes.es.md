# Sealed Classes (Java 17)

> Restringen quién puede extender una clase. Mejor control sobre la jerarquía y `switch` exhaustivo.

## Usar cuando

- Querés **modelado de dominio estricto**.
- Un **conjunto finito** de subclases (ej: `Shape` es `Circle` o `Rectangle`).
- Querés chequeo de exhaustividad en `switch` / pattern matching.

## Código

```java
sealed class Shape permits Circle, Rectangle, Triangle {}

final class Circle    extends Shape {}
final class Rectangle extends Shape {}
non-sealed class Triangle extends Shape {} // se puede extender más
```

## Modificadores para subclases permitidas

- `final` — no se puede extender más.
- `sealed` — puede extenderse solo por su propio set permitido.
- `non-sealed` — abre la jerarquía de nuevo.

## Bonus — switch exhaustivo con pattern matching

```java
double area(Shape s) {
    return switch (s) {
        case Circle c    -> Math.PI * c.radius() * c.radius();
        case Rectangle r -> r.w() * r.h();
        case Triangle t  -> 0.5 * t.base() * t.height();
    };
}
```

No hace falta `default` — el compilador verifica que todos los tipos permitidos estén manejados.
