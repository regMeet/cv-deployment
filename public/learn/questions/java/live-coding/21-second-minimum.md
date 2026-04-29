# Second minimum in fewer than 2N comparisons

> Find the second smallest element of an array. The naive answer is 2N − 3 comparisons (find min, then min of rest). The senior answer uses the **tournament method**: N + log₂N − 2 comparisons.

## Clarifying questions

- Distinct elements? (If duplicates, define "second min" — second distinct value, or second by position?)
- Is the comparison count actually scored, or just informational? (In a real Java method, plain O(n) is fine.)
- Strict comparison count or just asymptotic?

## Naive — two passes, 2N − 3 comparisons

```java
public int secondMin(int[] a) {
    int min = Integer.MAX_VALUE, second = Integer.MAX_VALUE;
    for (int v : a) {
        if (v < min)          { second = min; min = v; }
        else if (v < second && v != min) second = v;
    }
    return second;
}
```

Single pass — N − 1 comparisons against `min`, plus N − 1 against `second` (worst case) ≈ 2N. Practical, clear, fine for most interviews.

## Tournament — N + log₂N − 2 comparisons

Build a tournament bracket: pair-wise compare, advance winners, repeat. The minimum wins everything; the **second min must have lost to the min at some point**, so it's among the log₂N elements that lost directly to the min. Take the min of those.

```java
public int secondMinTournament(int[] a) {
    int n = a.length;
    int[] winners = a.clone();
    List<List<Integer>> losers = new ArrayList<>();
    for (int i = 0; i < n; i++) losers.add(new ArrayList<>());

    while (countLive(winners) > 1) {
        for (int i = 0; i + 1 < winners.length; i += 2) {
            int a1 = winners[i], a2 = winners[i + 1];
            if (a1 <= a2) { losers.get(i).add(a2);     winners[i + 1] = Integer.MAX_VALUE; }
            else          { losers.get(i + 1).add(a1); winners[i] = Integer.MAX_VALUE; }
        }
        winners = compact(winners);
    }
    int champion = winners[0];
    int championIdx = indexOf(a, champion);
    return Collections.min(losers.get(championIdx));
}
```

This is more code than is worth writing in 45 minutes. **Talk the algorithm through and write the simple version** — the interviewer will be impressed by the verbal explanation alone. Implementing it is brittle.

## Why log₂N, not log₂N + 1

Min wins log₂N rounds. Second min is the smallest of the log₂N values it beat — finding the min of that set takes log₂N − 1 comparisons. Total: (N − 1) for the tournament + (log₂N − 1) for the runoff = N + log₂N − 2.

## Edge cases

- N < 2 → throw.
- All equal → no distinct second min (clarify what to return).
- Min at index 0 vs N−1 → algorithm doesn't care.

## Follow-ups

- **K-th smallest** in fewer than O(N log N) — Quickselect, O(N) expected.
- **Find min and max** in 3N/2 comparisons — pair elements first, compare smaller-of-pair against running min, larger-of-pair against running max.
