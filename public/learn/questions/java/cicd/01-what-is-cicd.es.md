# ¿Para qué sirve un CI/CD?

> CI atrapa errores de integración temprano, buildeando y testeando en cada commit. CD hace que el camino desde "pasó los tests" hasta "está corriendo en producción" sea repetible y de bajo riesgo. Juntos, sacan el error humano y la fricción de deployar.

## Continuous Integration (CI)

- Cada push dispara automáticamente un **build + corrida de tests**.
- Objetivo: atrapar errores de integración **temprano** — cambios de dos personas que chocan, un contrato roto entre módulos — en vez de descubrirlo días después, cuando ya es difícil rastrear qué lo rompió.
- Sin esto, "funciona en mi máquina" es la norma, no la excepción.
- Un CI sano da feedback rápido: unos minutos, no lo que tarda un café.

## Continuous Delivery / Deployment (CD)

- Automatiza el camino desde "el código pasó CI" hasta "está corriendo en producción".
- **Delivery** — cada cambio queda automáticamente preparado para release (buildeado, testeado, empaquetado), pero un humano dispara el deploy real.
- **Deployment** — va más allá: si pasa todos los checks, se deploya solo, sin ningún paso manual.
- Mismo proceso todas las veces — sin pasos manuales que alguien se olvida, sin "depende de quién deploya hoy".
- Rollback fácil y rápido si algo sale mal en producción.

## Por qué importa

- Saca el **error humano** de pasos repetitivos y de alto riesgo.
- Convierte el deploy de un evento riesgoso y ocasional en algo rutinario y aburrido — "deploys aburridos" es una *buena* señal de madurez de ingeniería.
- Acorta los ciclos de feedback en cada etapa: code review, testing, release.
- Habilita prácticas como trunk-based development y feature flags, que dependen de poder shippear cambios chicos todo el tiempo, de forma segura.

## Herramientas comunes hoy

| Categoría | Herramientas |
|---|---|
| Default para repos en GitHub | **GitHub Actions** |
| Default para repos en GitLab | **GitLab CI/CD** |
| Self-hosted / legacy / enterprise | **Jenkins** (sigue muy presente en orgs grandes y gobierno) |
| CI managed en la nube | **CircleCI**, Buildkite |
| Kubernetes-native / GitOps | **Argo CD**, **Tekton**, Flux |
| Pipelines cloud-native | AWS CodePipeline, Azure Pipelines, Google Cloud Build |

La herramienta puntual importa mucho menos que los principios — pipeline as code, feedback rápido, rollback seguro. Aprender un nuevo dialecto de YAML es la parte fácil.

## Frase para entrevista

> "CI/CD existe para sacar el error humano y la fricción del camino entre 'escribí código' y 'está corriendo correctamente en producción' — feedback rápido si algo se rompe, y deploys aburridos y repetibles en vez de eventos de alto riesgo."
