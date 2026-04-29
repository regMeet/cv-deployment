# Build vs Buy — how do you decide?

> Classic senior+ decision. They're testing **trade-off thinking** + business awareness.

## What it means

The decision between **building something in-house** vs **using an existing solution** (open source, SaaS, vendor product).

Examples:

- Auth → build vs Auth0 / Cognito / Clerk
- Queue → build vs SQS / RabbitMQ / Kafka
- Analytics → build vs Mixpanel / Amplitude
- Search → build vs Elasticsearch / Algolia
- Feature flags → build vs LaunchDarkly / Unleash

## Strong answer

I treat build vs buy as a **trade-off across cost, control, time-to-market, and strategic fit** — not as a default in either direction.

I tend to **buy when the capability isn't core to our product** and a mature solution exists. Why spend engineering time reinventing auth or messaging if great options already exist?

I lean toward **building when**:

- It's a **core differentiator** for the product.
- Existing solutions don't fit our scale, latency, or compliance needs.
- The cost of vendor lock-in is high relative to the cost of building.
- Total cost of ownership of a vendor (licensing + integration + data extraction) exceeds the build cost over a reasonable horizon.

I also factor in **maintenance burden** — building means owning forever, including security patches, scaling, and on-call.

When in doubt, I prefer **buying first** to ship fast and learn, then revisit if/when we hit real limitations.

## Trade-off summary

| Dimension | Build | Buy |
|-----------|-------|-----|
| Time to market | Slower | Fast |
| Cost upfront | High (eng time) | Low (license) |
| Cost long-term | Maintenance | Recurring fees |
| Control / customization | Full | Limited |
| Lock-in risk | None | High |
| Operational burden | You own it | Vendor handles |

## Signals to convey

- Not religious about either side.
- Frame around **core vs commodity**.
- Total cost of ownership, not just sticker price.
- Willing to revisit the decision as scale changes.
