import React, { useMemo, useState } from "react";
import "./App.css";

const PLAYERS = {
  X: "X",
  O: "O",
};

const WIN_LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

// PUBLIC_INTERFACE
function App() {
  /** Core game state */
  const [squares, setSquares] = useState(() => Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const currentPlayer = isXNext ? PLAYERS.X : PLAYERS.O;

  const { winner, winningLine } = useMemo(() => {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], winningLine: line };
      }
    }
    return { winner: null, winningLine: null };
  }, [squares]);

  const isDraw = useMemo(() => {
    return !winner && squares.every((s) => s !== null);
  }, [squares, winner]);

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw: Cat's game";
    return `Turn: ${currentPlayer}`;
  }, [winner, isDraw, currentPlayer]);

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    /** Ignore clicks if the game is over or the square is already filled. */
    if (winner || squares[index] !== null) return;

    setSquares((prev) => {
      const next = [...prev];
      next[index] = currentPlayer;
      return next;
    });
    setIsXNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function handleNewGame() {
    /** Reset board and set X to start. */
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  }

  return (
    <div className="App">
      <main className="rt-page">
        <section className="rt-card" aria-label="Tic Tac Toe">
          <header className="rt-header">
            <div className="rt-titleblock">
              <h1 className="rt-title">Tic Tac Toe</h1>
              <p className="rt-subtitle">Two-player • same device • retro arcade</p>
            </div>

            <div
              className={[
                "rt-status",
                winner ? "is-winner" : "",
                isDraw ? "is-draw" : "",
              ].join(" ")}
              role="status"
              aria-live="polite"
            >
              {statusText}
            </div>
          </header>

          <div className="rt-boardWrap">
            <div className="rt-board" role="grid" aria-label="3 by 3 board">
              {squares.map((value, idx) => {
                const isWinningSquare = Boolean(
                  winningLine && winningLine.includes(idx)
                );
                const ariaLabel = value
                  ? `Square ${idx + 1}, ${value}`
                  : `Square ${idx + 1}, empty`;

                return (
                  <button
                    key={idx}
                    type="button"
                    className={[
                      "rt-square",
                      value === PLAYERS.X ? "is-x" : "",
                      value === PLAYERS.O ? "is-o" : "",
                      isWinningSquare ? "is-winning" : "",
                    ].join(" ")}
                    onClick={() => handleSquareClick(idx)}
                    aria-label={ariaLabel}
                    aria-disabled={winner || value !== null ? "true" : "false"}
                    disabled={Boolean(winner) || value !== null}
                  >
                    <span className="rt-squareValue" aria-hidden="true">
                      {value ?? ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <footer className="rt-footer">
            <div className="rt-hint" aria-hidden="true">
              Tip: X starts. First to 3 in a row wins.
            </div>

            <button type="button" className="rt-btn" onClick={handleNewGame}>
              New Game
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
