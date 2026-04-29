# What makes a good alert?

> Senior+ question. They're testing whether you understand **operational reality**, not just monitoring tools.

## Strong answer

A good alert is **actionable, accurate, and tied to user impact**.

If an alert fires at 3am, the on-call should be able to:

1. Understand **what's broken**.
2. Know **what to do** (or have a runbook).
3. Trust that this is **worth being woken up for**.

I prefer to alert on **symptoms users actually experience** — high error rates, latency exceeding SLOs, failed business transactions — rather than on internal metrics that may or may not affect users (e.g., CPU at 80%).

When defining alerts, I think in terms of **SLOs and SLIs**:

- **SLI** (Service Level Indicator): the metric you measure (e.g., p99 latency, error rate).
- **SLO** (Service Level Objective): the target (e.g., p99 < 500ms over 30 days).
- The alert fires when the SLO is at risk of being breached, not just on raw threshold spikes.

I also work to **avoid alert fatigue**:

- Tune thresholds so noisy alerts get fixed or removed.
- Group related alerts so a single incident doesn't generate 50 pages.
- Regularly review which alerts fired, which were actionable, and which were noise.

## Signs of a bad alert

- Fires multiple times a day with no action taken.
- Vague title — on-call has no idea what's wrong.
- No runbook or owner.
- Triggered by internal metric with no clear user impact.

## Signals

- Frame around **user impact**, not infrastructure metrics.
- Mention **SLOs/SLIs**.
- Care about **alert fatigue** — quality over quantity.
- Alerts should come with **runbooks**.
