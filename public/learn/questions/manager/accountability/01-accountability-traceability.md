# How do you ensure accountability and traceability of the system?

> Senior+ question. They want to see **observability + process + ownership** all woven together.

## Strong answer

I ensure accountability and traceability through a combination of **observability, clear ownership, and structured processes**.

**On the system side**, I rely on **logs, metrics, and distributed tracing** to have full visibility of what's happening in production. Every request can be traced end-to-end, which helps quickly identify issues and understand system behavior.

**On the process side**, I make sure changes are traceable through **version control, pull requests, and ticketing systems**, so every decision has context and history.

I also promote **clear ownership of services**, so it's always known who is responsible for what.

This combination allows us to **detect issues faster, understand root causes, and continuously improve the system**.

## Building blocks

### 1. Observability (technical core)

- Structured logs.
- Metrics — latency, errors, throughput.
- Distributed tracing — request flow across services.

> "If something breaks, we should be able to answer **what happened, where, and why**."

### 2. Trackability (change history)

- Commits + PRs.
- Tickets (Jira, Linear, etc.).
- Feature flags — to know what's live.

> "Every change in the system should be **traceable to a decision**."

### 3. Accountability (real ownership)

- Owner per service.
- On-call rotation.
- Blameless postmortems.

> "Clear ownership ensures **faster decision-making and better system reliability**."

### 4. Incidents

> "For incidents, I follow a structured approach: **quick mitigation, clear communication, and a blameless postmortem** to improve the system."

### 5. Success metrics

- **MTTR** (mean time to recovery).
- Error rate.
- Uptime / availability.

## Staff-level version

> "I think about accountability not only at the system level but also at the team level. Systems should be **observable by design**, but teams should also have **clear ownership and feedback loops**. That's what enables continuous improvement, not just incident reaction."

## Common mistakes to avoid

- Talking only about logs (sounds junior).
- Not mentioning ownership.
- Not connecting to processes.
- Not connecting to impact.
