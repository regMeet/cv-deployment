# How do you investigate a reported issue?

> They want **debugging discipline** + observability mindset.

## Strong answer

First, I try to **reproduce the issue** so I can understand it from the user's perspective and confirm the exact conditions that trigger it.

Then I check the available **observability signals** — logs, metrics, and traces — to narrow down where the failure is happening and whether it's a code issue, data issue, dependency issue, or something environmental.

I isolate the problem as much as possible, identify the **root cause**, and assess the impact before proposing a fix.

Once I have enough confidence in the diagnosis, I implement the solution and, when needed, add monitoring or tests to prevent the issue from coming back.

## Bonus signals

- Mention **observability** (logs, metrics, distributed tracing).
- Distinguish between **symptom** and **root cause**.
- Add tests/monitoring as part of the fix, not as an afterthought.
