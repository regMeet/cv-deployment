# AI tools — security concerns

> Interviewers ask this to see if you use AI **responsibly**, not just fast. Show you've thought about it, not that you avoid AI out of fear.

## Strong answer

Yes — I take a few concrete precautions when using AI in the development process.

**Data exposure.** I never paste secrets, credentials, customer data, or proprietary business logic into a public/consumer-tier AI tool. I use enterprise offerings with a **no-training-on-inputs** agreement for anything touching company code, and I still treat prompts as something that leaves our perimeter — same mindset as sending code to any third-party SaaS.

**Hallucinated dependencies.** AI can suggest a package name that doesn't exist — and attackers register those exact names on public registries (npm, PyPI, Maven Central) betting someone will `install` it blindly ("slopsquatting"). I always verify a suggested dependency actually exists, is maintained, and has real download history before adding it.

**Vulnerable generated code.** AI-generated code can look correct while missing basics — unparameterized queries, missing input validation, insecure defaults, weak crypto choices. I review AI output with the **same scrutiny as a junior engineer's PR** — nothing skips code review or the normal SAST/dependency-scanning pipeline just because "AI wrote it."

**Agentic tools & permissions.** When using an AI coding agent that can run shell commands or hit the network, I scope its permissions tightly and keep a human in the loop for anything destructive (deletes, force-pushes, prod access) — I don't grant blanket autonomy.

**Indirect prompt injection.** If an agent reads untrusted content (a ticket, a web page, a PR comment) as part of its context, that content can carry hidden instructions. I don't let agents act on external content with elevated permissions without a review step.

## Signals to convey

- You use AI **and** think about its threat model — not either/or.
- Treat AI output like any other untrusted/unreviewed contribution: same review, same scanners, same standards.
- Specific risks (slopsquatting, prompt injection, data exposure) show real engagement with the topic, not a generic "I'm careful" answer.
