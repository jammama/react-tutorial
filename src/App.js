import {useState} from "react";

// 승자 계산
function solution(n, arr) {
    return null;
}

function Square({value, onSquareClick}) {
    return <button className={"square " + value} onClick={onSquareClick}>{value}</button>;
}

//보드판
function Board({xIsNext, squares, afterPlay, row}) {
    // 클릭시 afterPlay로 배열 전달
    function handleClick(i) {
        const [x, y] = [i % row, Math.floor(i / row)];
        if (!!squares[x][y] || solution(row, squares)) {
            console.log('exist')
            return;
        }
        console.log(squares, i % row, Math.floor(i / row))
        squares[x][y] = xIsNext ? "O" : "X";
        afterPlay([x, y]);
    }

    // square 렌더링
    const renderSquare = (i) => {
        return <Square value={squares[i % row][Math.floor(i / row)]} onSquareClick={() => handleClick(i)}/>;
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
            <div className="board-box"> {renderBox(row)} </div>
        </>
    );
}

export default function Game() {
    const [row, setRow] = useState(5);
    // history : [[x,y], [x,y]]
    const [history, setHistory] = useState([]);
    // squares : [["O", null, null, null, null], ["X","O",null,null...]...]
    const [squares, setSquares] = useState(Array.from(Array(row), () => (new Array(row).fill(null))));
    const currentMove = history.length;
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[history.length - 1];
    // 렌더링 시점에 승자 결정
    const winner = solution(row, currentSquares)
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Player Now: " + (xIsNext ? "O" : "X");
    }

    // 히스토리 추가
    function addHistory(position) {
        setHistory([...history, position]);
    }

    // 히스토리로 이동
    function jumpTo(nextStep) {
        const removeHistory = history.slice(nextStep + 1, history.length)
        removeHistory.forEach((p) => {
            squares[p[0]][p[1]] = null;
        })
        squares[1][1] = null
        setHistory(history.slice(0, nextStep));
    }

    // 게임 리셋
    function restart() {
        setHistory([]);
        setSquares(Array.from(Array(row), () => (new Array(row).fill(null))));
    }

    // 보드판 크기 설정
    const setBoardSize = (row) => {
        setRow(row);
        restart()
    }

    // move에 대한 렌더링
    const button = (step) => +step === +currentMove ? <label>Now : {step}</label> :
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
                    <Board xIsNext={xIsNext} squares={squares} afterPlay={addHistory} row={row}/>
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <button onClick={() => restart()}>restart</button>
                    <ol>{moves}</ol>
                </div>
            </div>
            <label htmlFor="row"> board size : {row} </label>
            <br/>
            <input id="row" value={row} onInput={(e) => setBoardSize(e.target.value)} type="range" min="5" max="22"/>
        </>
    );
}
