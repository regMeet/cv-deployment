# Sealed Classes (Java 17)

> Restrict who can extend a class. Better control over hierarchy and exhaustive `switch`.

## Use when

- You want **strict domain modeling**.
- A **finite set** of subclasses (e.g., `Shape` is `Circle` or `Rectangle`).
- You want exhaustiveness checks in `switch` / pattern matching.

## Code

```java
sealed class Shape permits Circle, Rectangle, Triangle {}

final class Circle    extends Shape {}
final class Rectangle extends Shape {}
non-sealed class Triangle extends Shape {} // can be extended further
```

## Modifiers for permitted subclasses

- `final` — cannot be extended further.
- `sealed` — can be extended only by its own permitted set.
- `non-sealed` — opens the hierarchy back up.

## Bonus — exhaustive switch with pattern matching

```java
double area(Shape s) {
    return switch (s) {
        case Circle c    -> Math.PI * c.radius() * c.radius();
        case Rectangle r -> r.w() * r.h();
        case Triangle t  -> 0.5 * t.base() * t.height();
    };
}
```

No `default` needed — compiler verifies all permitted types are handled.
