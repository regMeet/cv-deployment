# Interface vs Abstract Class (Java moderno)

> **Idea core:** Interface = *contrato* (qué hace). Abstract class = *base* (qué es + implementación parcial).

## Cuándo usar Interface

- Definir comportamiento / capacidades.
- No necesitás estado.
- Necesitás herencia múltiple.
- Querés diseño flexible / desacoplado.

> Ejemplos mentales: `Runnable`, `Comparable`, el patrón Strategy.

## Cuándo usar Abstract Class

- Necesitás estado (campos).
- Compartir lógica entre clases.
- Necesitás constructores.
- Relación "is-a" fuerte.
- Querés controlar el flujo (patrón Template Method).

## Diferencias clave

| | Interface | Abstract |
|---|---|---|
| Estado (campos) | ❌ | ✅ |
| Constructores | ❌ | ✅ |
| Herencia | Múltiple | Simple |
| Métodos | default, static, private | Sin restricciones |

## Features modernos de interface (Java 8+)

- **default methods** — implementación parcial.
- **static methods** — lógica utilitaria.
- **private methods (Java 9+)** — reuso interno dentro de los default methods.

## Regla práctica

1. **Arrancá con interface.**
2. Si necesitás estado → cambiate a abstract class.

## Código

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

// Herencia múltiple — solo con interfaces
class Duck implements Flyable, Swimmable { /* ... */ }

// Template method — poder de abstract class
abstract class Game {
    final void play() { start(); end(); }
    abstract void start();
    abstract void end();
}

// Private method en interface (Java 9+) — evitar duplicación en defaults
interface Logger {
    default void logInfo(String m)  { log("INFO", m); }
    default void logError(String m) { log("ERROR", m); }
    private void log(String level, String m) {
        System.out.println(level + ": " + m);
    }
}
```

## Frases para entrevista

- "Interfaces define contracts, abstract classes provide shared implementation."
- "Interfaces support multiple inheritance, abstract classes don't."
- "Abstract classes are used when we need both state and behavior."

## Ultra corto

- **Interface** → flexible + contrato.
- **Abstract** → base + estado.
