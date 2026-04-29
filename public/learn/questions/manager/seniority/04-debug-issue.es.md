# ¿Cómo investigás un issue reportado?

> Quieren ver **disciplina de debugging** + mentalidad de observabilidad.

## Respuesta sólida

Primero, intento **reproducir el problema** para entenderlo desde la perspectiva del usuario y confirmar las condiciones exactas que lo disparan.

Después chequeo las **señales de observabilidad** disponibles — logs, métricas y traces — para acotar dónde está fallando y si es un issue de código, datos, dependencia o algo del ambiente.

Aíslo el problema lo más posible, identifico la **causa raíz** y evalúo el impacto antes de proponer un fix.

Cuando tengo confianza en el diagnóstico, implemento la solución y, cuando hace falta, agrego monitoring o tests para prevenir que el issue vuelva.

## Señales bonus

- Mencionar **observabilidad** (logs, métricas, distributed tracing).
- Distinguir entre **síntoma** y **causa raíz**.
- Agregar tests/monitoring como parte del fix, no como afterthought.
