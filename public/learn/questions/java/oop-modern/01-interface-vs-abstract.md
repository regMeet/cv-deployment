# Interface vs Abstract Class (modern Java)

> **Core idea:** Interface = *contract* (what it does). Abstract class = *base* (what it is + partial implementation).

## When to use an Interface

- Define behavior / capabilities.
- No need for state.
- Need multiple inheritance.
- Want flexible / decoupled design.

> Mental examples: `Runnable`, `Comparable`, the Strategy pattern.

## When to use an Abstract Class

- Need state (fields).
- Share logic across classes.
- Need constructors.
- Strong "is-a" relationship.
- Want to control flow (Template Method pattern).

## Key differences

| | Interface | Abstract |
|---|---|---|
| State (fields) | ❌ | ✅ |
| Constructors | ❌ | ✅ |
| Inheritance | Multiple | Single |
| Methods | default, static, private | No restrictions |

## Modern interface features (Java 8+)

- **default methods** — partial implementation.
- **static methods** — utility logic.
- **private methods (Java 9+)** — internal reuse inside default methods.

## Practical rule

1. **Start with an interface.**
2. If you need state → switch to an abstract class.

## Code

```java
interface Flyable {
    void fly();
    default void takeOff() { System.out.println("Taking off"); }
}

abstract class Animal {
    String name;
    Animal(String name) { this.name = name; }
    void eat() { System.out.println("Eating"); }
    abstract void makeSound();
}

// Multiple inheritance — only with interfaces
class Duck implements Flyable, Swimmable { /* ... */ }

// Template method — abstract-class power
abstract class Game {
    final void play() { start(); end(); }
    abstract void start();
    abstract void end();
}

// Private method in interface (Java 9+) — avoid duplication in defaults
interface Logger {
    default void logInfo(String m)  { log("INFO", m); }
    default void logError(String m) { log("ERROR", m); }
    private void log(String level, String m) {
        System.out.println(level + ": " + m);
    }
}
```

## Interview phrases

- "Interfaces define contracts, abstract classes provide shared implementation."
- "Interfaces support multiple inheritance, abstract classes don't."
- "Abstract classes are used when we need both state and behavior."

## Ultra short

- **Interface** → flexible + contract.
- **Abstract** → base + state.
