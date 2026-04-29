# Consolidación de queries (queries encadenadas → JOIN)

> Cuando una 2da query depende de la 1ra (usa su resultado en WHERE), fusionalas con un JOIN. Un round-trip en vez de dos.

## Mal — dos queries secuenciales

```java
List<Long> caseIds = caseRepo.findIdsByNumber(numbers);  // query 1
List<Application> apps = appRepo.findByCaseIdIn(caseIds); // query 2 — espera a q1
```

## Bien — una sola query con JOIN

```java
@Query("""
    SELECT new com.app.dto.AppDto(c.id, c.number, a.id, a.status)
    FROM Case c JOIN c.applications a
    WHERE c.number IN :numbers
    """)
List<AppDto> findApps(@Param("numbers") List<String> numbers);
```

## Por qué importa

- **Un round-trip de red** en vez de dos. Con DB remota (ej: sobre VPN), cada round-trip son 50–250ms — no trivial.
- El optimizador de la DB puede planear una query mejor de lo que puede planear dos que no ve juntas.

## Distinguir de batching

- **Batching (IN-clause):** misma query, muchos IDs, colapsada en una (`WHERE id IN (...)`) — reemplaza un loop de queries idénticas.
- **Consolidación (JOIN):** dos queries **distintas**, donde la 2da depende de la 1ra — fusionadas vía JOIN.

## Bullet de CV

> "Consolidated sequential query pairs into single JPQL JOINs to cut network round-trips."
