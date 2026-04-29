# How do you detect a memory leak?

> Watch the heap over time. If Old Gen grows and doesn't shrink after a Full GC → leak.

## Signals

- Heap usage trending up across days/weeks.
- Old Gen full → frequent Full GCs → eventual `OutOfMemoryError`.
- Latency spikes correlated with GC pauses.

## Tools

### 1. GC logs

```bash
-Xlog:gc*:file=gc.log
```

Plot heap-after-GC over time. If the post-GC baseline keeps climbing → leak.

### 2. Heap dumps

```bash
jmap -dump:live,file=heap.hprof <pid>
```

Or automatic on OOM:

```bash
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/tmp/heap.hprof
```

### 3. Eclipse MAT / VisualVM

Open the `.hprof`. **Leak Suspects Report** highlights what's dominating the heap.

### 4. Profilers in prod

- **Datadog APM** / **JFR (Java Flight Recorder)** can sample allocations + GC stats live.

## Workflow

1. Confirm leak from GC logs (post-GC heap rising).
2. Trigger a heap dump near the suspected peak.
3. Analyze with MAT — find the dominator (the object holding the most retained heap).
4. Trace the GC root path → that's where the leak is rooted (often a static collection or a `ThreadLocal`).

## Interview line

> "I confirm with GC logs first — if the post-GC baseline is climbing, that's a leak. Then a heap dump and MAT to find the dominator. Most leaks I've found traced back to static collections, unbounded caches, or `ThreadLocal` left in a thread pool."
