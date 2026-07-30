# What is CI/CD for?

> CI catches integration errors early by building and testing on every commit. CD makes the path from "tests passed" to "running in production" repeatable and low-risk. Together they remove human error and friction from shipping.

## Continuous Integration (CI)

- Every push triggers an automated **build + test run**.
- Goal: catch integration errors **early** — two people's changes conflicting, a broken contract between modules — instead of discovering it days later when it's hard to trace.
- Without it, "works on my machine" is the norm, not the exception.
- A healthy CI setup gives fast feedback: a few minutes, not a coffee-break's worth of waiting.

## Continuous Delivery / Deployment (CD)

- Automates the path from "code passed CI" to "running in production."
- **Delivery** — every change is automatically prepared for release (built, tested, packaged), but a human triggers the actual deploy.
- **Deployment** — goes further: passing all checks deploys automatically, no manual step at all.
- Same process every time — no manual steps someone forgets, no "it depends who's deploying today."
- Easy, fast rollback if something goes wrong in production.

## Why it matters

- Removes **human error** from repetitive, high-stakes steps.
- Turns deployment from a risky, occasional event into a routine, boring one — "boring deploys" is a *good* sign of engineering maturity.
- Shortens feedback loops at every stage: code review, testing, release.
- Enables practices like trunk-based development and feature flags, which depend on being able to ship small changes constantly and safely.

## Common tools today

| Category | Tools |
|---|---|
| Default for GitHub-hosted repos | **GitHub Actions** |
| Default for GitLab-hosted repos | **GitLab CI/CD** |
| Self-hosted / legacy / enterprise | **Jenkins** (still very common in large orgs & government) |
| Managed cloud CI | **CircleCI**, Buildkite |
| Kubernetes-native / GitOps | **Argo CD**, **Tekton**, Flux |
| Cloud-native pipelines | AWS CodePipeline, Azure Pipelines, Google Cloud Build |

The specific tool matters far less than the principles — pipeline as code, fast feedback, safe rollback. Picking up a new YAML dialect is the easy part.

## Interview line

> "CI/CD exists to take human error and friction out of the path between 'I wrote code' and 'it's running correctly in production' — fast feedback when something breaks, and boring, repeatable deploys instead of high-risk events."
