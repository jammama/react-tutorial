import {useState} from "react";

// 승자 계산
function solution(n, arr) {
    const checkBingo = (char) => {
        // Check rows
        for (let i = 0; i < n; i++) {
            if (Array.from({ length: n }, (_, j) => arr[i * n + j]).every(cell => cell === char)) {
                return char;
            }
        }

        // Check columns
        for (let j = 0; j < n; j++) {
            if (Array.from({ length: n }, (_, i) => arr[i * n + j]).every(cell => cell === char)) {
                return char;
            }
        }

        // Check main diagonal
        if (Array.from({ length: n }, (_, i) => arr[i * n + i]).every(cell => cell === char)) {
            return char;
        }

        // Check anti-diagonal
        if (Array.from({ length: n }, (_, i) => arr[i * n + (n - 1 - i)]).every(cell => cell === char)) {
            return char;
        }

        return null;
    };

    const uniqueChars = new Set(arr.filter(char => char !== null && char !== ''));

    for (const char of uniqueChars) {
        const result = checkBingo(char);
        if (result !== null) {
            return result;
        }
    }

    return null;
}

function Square({
                    value, onSquareClick
                }) {
    return <button className={"square " + value} onClick={onSquareClick}>{value}</button>;
}

//보드판
function Board({xIsNext, squares, onPlay, row}) {
    // 렌더링 시점에 승자 결정
//    const winner = calculateWinner(squares);
    const winner = solution(row, squares)
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Player Now: " + (xIsNext ? "O" : "X");
    }

    // 클릭시 onPlay로 배열 전달
    function handleClick(i) {
        const newSquares = squares.slice();
        // if (!!newSquares[i] || calculateWinner(squares)) {
        if (!!newSquares[i] || solution(row, squares)) {
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
            <div className="board-box"> {renderBox(row)} </div>
        </>
    );
}

export default function Game() {
    const [row, setRow] = useState(3);
    const [history, setHistory] = useState([Array(row * row).fill(null)]);
    const [currentMove, setCurrentMove] = useState(-1);
    const [moveOrder, setMoveOrder] = useState(1);
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

    // 게임 리셋
    function restart() {
        setHistory([Array(row * row).fill(null)])
        setCurrentMove(-1);
    }

    // 보드판 크기 설정
    const setBoardSize = (row) => {
        setRow(row);
        restart()
    }

    //내림차순 오름차순 변경
    const toggleMoveOrder = () => {

    }

    // move에 대한 렌더링
    const button = (step) => +step === currentMove + 1 ?
        <button disabled >Now : {step}</button> :
        <button onClick={() => jumpTo(step)}>Go to move #{step}</button>
    const moves = history.map((squares, step) => {
            return (
                <>
                    <ol key={step}>
                        {button(step)}
                    </ol>
                </>
            )
                ;
        })
    ;

    return (
        <>
            <div className="game">
                <div className="game-board">
                    <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} row={row}/>
                </div>
                <div className="game-info">
                        <div>
                            <button onClick={() => restart()}>restart</button>
                            <button onClick={() => restart()}>restart</button>
                        </div>
                        {moves}
                </div>
            </div>
            <br/>
        </>
    );
}
