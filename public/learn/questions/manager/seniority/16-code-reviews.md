# How do you give code reviews?

> They're checking **technical quality + collaboration style**.

## Strong answer

I treat code reviews as a **conversation, not a gate**. The goal is improving the code and helping the author grow, not proving I'm smart.

When reviewing, I focus on:

- **Correctness and logic** first.
- **Architecture and maintainability** — does this fit the system, will it be easy to evolve?
- **Edge cases** the author might've missed.
- **Readability** — would someone new to this code understand it?

I separate **must-fix** from **suggestion** explicitly so the author isn't paralyzed by every comment. I prefer to suggest improvements rather than dictate them.

For complex changes, I'll often **ask questions instead of asserting** — sometimes the author has context I don't.

I also try to **review quickly**. A slow review blocks the team more than most people realize.

## Avoid

- Nitpicking style that a linter could catch.
- Vague comments ("this could be better"); be specific.
- Tone that makes the author defensive.
