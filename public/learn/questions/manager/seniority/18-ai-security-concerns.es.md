# Herramientas de IA — problemas de seguridad

> Preguntan esto para ver si usás IA de forma **responsable**, no solo rápida. Mostrá que lo pensaste, no que evitás la IA por miedo.

## Respuesta sólida

Sí — tomo algunas precauciones concretas al usar IA en el proceso de desarrollo.

**Exposición de datos.** Nunca pego secretos, credenciales, datos de clientes o lógica de negocio propietaria en una herramienta de IA de consumo/pública. Uso ofertas enterprise con acuerdo de **no entrenar con los inputs** para todo lo que toque código de la empresa, y aun así trato los prompts como algo que sale de nuestro perímetro — el mismo criterio que aplicaría a mandar código a cualquier SaaS de terceros.

**Dependencias alucinadas.** La IA puede sugerir un paquete que no existe — y atacantes registran esos nombres exactos en registros públicos (npm, PyPI, Maven Central) apostando a que alguien lo instale sin verificar ("slopsquatting"). Siempre verifico que una dependencia sugerida realmente exista, esté mantenida y tenga historial real de descargas antes de agregarla.

**Código vulnerable generado.** El código generado por IA puede parecer correcto y aun así saltarse cosas básicas — queries sin parametrizar, falta de validación de inputs, defaults inseguros, elecciones débiles de crypto. Reviso las salidas de IA con **el mismo escrutinio que un PR de un junior** — nada se salta el code review ni el pipeline normal de SAST/scanning de dependencias solo porque "lo escribió la IA".

**Herramientas agénticas y permisos.** Cuando uso un agente de IA que puede correr comandos de shell o pegarle a la red, le limito los permisos de forma estricta y mantengo a un humano en el loop para cualquier cosa destructiva (deletes, force-pushes, acceso a prod) — no le doy autonomía total.

**Prompt injection indirecto.** Si un agente lee contenido no confiable (un ticket, una página web, un comentario de PR) como parte de su contexto, ese contenido puede traer instrucciones ocultas. No dejo que agentes actúen sobre contenido externo con permisos elevados sin un paso de revisión.

## Señales a transmitir

- Usás IA **y** pensás en su modelo de amenazas — no es una cosa u otra.
- Tratás la salida de IA como cualquier contribución no confiable/no revisada: mismo review, mismos scanners, mismos estándares.
- Riesgos concretos (slopsquatting, prompt injection, exposición de datos) muestran compromiso real con el tema, no una respuesta genérica de "soy cuidadoso".
