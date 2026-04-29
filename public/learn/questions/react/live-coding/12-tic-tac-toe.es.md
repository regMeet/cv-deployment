# Tic-tac-toe (Tres en raya)

> El clásico del tutorial de React. Algunos lo usan como warm-up, otros como cierre — la vara se mueve con los follow-ups.

## Problema

Tic-tac-toe de dos jugadores en un tablero 3×3.
- Click a una celda vacía para jugar
- Mostrar de quién es el turno
- Detectar ganador / empate
- Botón Reset

## Solución

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
    ? `Ganó: ${winner.player}`
    : isDraw
    ? 'Empate'
    : `Sigue: ${xIsNext ? 'X' : 'O'}`;

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
            aria-label={v ? `${v} en celda ${i + 1}` : `Celda vacía ${i + 1}`}
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

## Qué demuestra

- **Estado derivado, no guardado.** `winner`, `isDraw`, `status` se computan durante el render. Sin effects, sin data stale.
- **Lazy initial state** — `useState(() => Array(9).fill(null))`. El factory corre una vez.
- **Update inmutable** — `squares.slice()` luego mutar la copia, luego setState.
- **Deshabilitar las celdas tras ganar** — guard adentro de `play` *y* `disabled` en el botón.
- **Resaltar la línea ganadora** — leerla de `winner.line`, sin state extra.

## Follow-ups senior

- **"Agregá time travel (history)."** Trackeá `history: Square[][]` y un índice `step`. `setSquares` pasa a ser `setHistory(h => [...h.slice(0, step + 1), next])`.
- **"Generalizá a N×N + K-en-raya."** Calculá las líneas dinámicamente; el resto es igual.
- **"Agregá una IA imbatible."** Minimax con alpha-beta. Para 3×3 es instantáneo.
- **"Refactorealo a useReducer."** Tres acciones (`PLAY`, `RESET`, `JUMP_TO`) — más limpio que tres setStates sincronizados a mano.
