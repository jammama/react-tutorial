import {useState} from "react";

// 승자 계산 TODO: squares 크기에 상관 없이 동작하도록 변경
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

//보드판
function Board({xIsNext, squares, onPlay, row}) {
    // 렌더링 시점에 승자 결정
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Player Now: " + (xIsNext ? "O" : "X");
    }

    // 클릭시 onPlay로 배열 전달
    function handleClick(i) {
        const newSquares = squares.slice();
        if (!!newSquares[i] || calculateWinner(squares)) {
            return;
        }
        if (xIsNext) {
            newSquares[i] = "O";
        } else {
            newSquares[i] = "X";
        }
        onPlay(newSquares);
    }

    // square 렌더링
    const renderSquare = (i) => {
        return <Square value={squares[i]} onSquareClick={() => handleClick(i)}/>;
    };
    // 한 줄 렌더링
    const renderRow = (row, i) =>
        <div className="board-row">
            {Array.from({length: row}, (x, y) => y + row * i)
                .map((r, j) => renderSquare(r))}
        </div>;
    // 가로세로 렌더링
    const renderBox = (row) => Array.from({length: row})
        .map((r, i) => renderRow(row, i))
    return (
        <>
            <div className="status">{status}</div>
            {renderBox(row)}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(-1);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[history.length - 1];

    // 클릭시 플레이어 변경 및 히스토리 추가
    function handlePlay(nextSquares) {
        setHistory([...history, nextSquares]);
        setCurrentMove(history.length - 1);
    }

    // 히스토리로 이동
    function jumpTo(nextStep) {
        setHistory(history.slice(0, nextStep + 1));
        setCurrentMove(nextStep);
    }

    // move에 대한 렌더링
    const button = (step) => step === currentMove + 1 ? <label>Now : {step}</label> :
        <button onClick={() => jumpTo(step)}>Go to move #{step}</button>
    const moves = history.map((squares, step) => {
            return (
                <>
                    <li key={step}>
                        {button(step)}
                    </li>
                </>
            )
                ;
        })
    ;
    const [row, setRow] = useState(3);
    return (
        <>
            <div className="game">
                <div className="game-board">
                    <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} row={row}/>
                </div>
                <div className="game-info">
                    <button onClick={() => jumpTo(0)}>restart</button>
                    <ol>{moves}</ol>
                </div>
            </div>
            <label for="row"> board size : {row} </label>
            <br/>
            <input id="row" value={row} onInput={(e) => setRow(e.target.value)} type="range" max="9"/>
        </>
    );
}

function Square({
                    value, onSquareClick
                }) {
    return <button className="square" onClick={onSquareClick}>{value}</button>;
}
