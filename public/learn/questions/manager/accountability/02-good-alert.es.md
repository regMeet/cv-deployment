# ¿Qué hace a una buena alerta?

> Pregunta nivel senior+. Están testeando si entendés **realidad operativa**, no solo herramientas de monitoring.

## Respuesta sólida

Una buena alerta es **accionable, precisa y atada al impacto al usuario**.

Si una alerta dispara a las 3am, el on-call debería poder:

1. Entender **qué está roto**.
2. Saber **qué hacer** (o tener un runbook).
3. Confiar en que **vale la pena despertarse por esto**.

Prefiero alertar sobre **síntomas que los usuarios realmente experimentan** — error rates altos, latencia que rompe SLO, transacciones de negocio fallidas — en lugar de métricas internas que pueden o no afectar al usuario (ej: CPU al 80%).

Cuando defino alertas, pienso en términos de **SLOs y SLIs**:

- **SLI** (Service Level Indicator): la métrica que medís (ej: latencia p99, error rate).
- **SLO** (Service Level Objective): el objetivo (ej: p99 < 500ms en 30 días).
- La alerta dispara cuando el SLO está en riesgo de romperse, no solo en spikes de threshold raw.

También trabajo para **evitar alert fatigue**:

- Tunear thresholds para que las alertas ruidosas se arreglen o eliminen.
- Agrupar alertas relacionadas para que un único incidente no genere 50 pages.
- Revisar regularmente qué alertas dispararon, cuáles fueron accionables y cuáles fueron ruido.

## Señales de mala alerta

- Dispara varias veces al día sin que se haga nada.
- Título vago — el on-call no tiene idea de qué está mal.
- Sin runbook ni owner.
- Disparada por métrica interna sin impacto claro al usuario.

## Señales

- Encuadrar alrededor del **impacto al usuario**, no métricas de infra.
- Mencionar **SLOs/SLIs**.
- Cuidar la **alert fatigue** — calidad sobre cantidad.
- Las alertas deben venir con **runbooks**.
