# Tic-tac-toe

> The React tutorial classic. Asked as a warm-up by some shops, as a closer by others — the bar scales with the follow-ups.

## Problem

Two-player tic-tac-toe on a 3×3 board.
- Click an empty cell to play
- Show whose turn it is
- Detect winner / draw
- Reset button

## Solution

```jsx
import { useState } from 'react';

const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function getWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export function TicTacToe() {
  const [squares, setSquares] = useState(() => Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = getWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  const status = winner
    ? `Winner: ${winner.player}`
    : isDraw
    ? 'Draw'
    : `Next: ${xIsNext ? 'X' : 'O'}`;

  function play(i) {
    if (squares[i] || winner) return;
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext((v) => !v);
  }

  function reset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div>
      <p>{status}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gap: 4 }}>
        {squares.map((v, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            disabled={!!v || !!winner}
            aria-label={v ? `${v} at cell ${i + 1}` : `Empty cell ${i + 1}`}
            style={{
              width: 60, height: 60, fontSize: 24,
              background: winner?.line.includes(i) ? '#ffd' : 'white',
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## What this demonstrates

- **Derived state, not stored.** `winner`, `isDraw`, `status` are computed during render. No effects, no stale data.
- **Lazy initial state** — `useState(() => Array(9).fill(null))`. The factory runs once.
- **Immutable update** — `squares.slice()` then mutate the copy, then setState.
- **Disable squares once won** — guard inside `play` *and* `disabled` on the button.
- **Highlight winning line** — read it from `winner.line`, no extra state.

## Senior follow-ups

- **"Add time travel (history)."** Track `history: Square[][]` and a `step` index. `setSquares` becomes `setHistory(h => [...h.slice(0, step + 1), next])`.
- **"Generalize to N×N + K-in-a-row."** Compute lines dynamically; the rest is the same.
- **"Add an unbeatable AI."** Minimax with alpha-beta. For 3×3 it's instant.
- **"Refactor to useReducer."** Three actions (`PLAY`, `RESET`, `JUMP_TO`) — cleaner than three setStates kept in sync.
