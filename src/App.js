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
function Board({xIsNext, squares, onPlay}) {
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

    // JSP 수정이 귀찮아서 렌더링 함수 추가
    const renderSquare = (i) => {
        return <Square value={squares[i]} onSquareClick={() => handleClick(i)}/>;
    };
    const renderRow = (i) => {
        return (<div className="board-row">
            {renderSquare(i)}
            {renderSquare(i + 1)}
            {renderSquare(i + 2)}
        </div>);
    };
    return (<>
        <div className="status">{status}</div>

        {renderRow(0)}
        {renderRow(3)}
        {renderRow(6)}
    </>);
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[history.length - 1];

    // 클릭시 플레이어 변경 및 히스토리 추가
    function handlePlay(nextSquares) {
        setHistory([...history, nextSquares]);
        setCurrentMove(history.length - 1 );
    }

    // 히스토리로 이동
    function jumpTo(nextStep) {
        setHistory(history.slice(0, nextStep + 1));
        setCurrentMove(nextStep);
    }

    // move에 대한 렌더링
    const moves = history.map((squares, step) => {
        return (
            <>
                <li key={step}>
                    { step === currentMove + 1 ? <label>Now : {step}</label> :
                        <button onClick={() => jumpTo(step)}>Go to move #{step} {currentMove}</button>}
                </li>
            </>
        );
    });
    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="game-info">
                <button onClick={() => jumpTo(0)}>restart</button>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function Square({value, onSquareClick}) {
    return <button className="square" onClick={onSquareClick}>{value}</button>;
}
