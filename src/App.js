import {useState} from "react";

/**
 * 승자계산
 * @param row 현 게임의 row 수
 * @param squares 게임 내 OX가 등록된 좌표 squares
 * @param cur 현재 선택한 좌표와 O|X [x, y , O|X]
 */
function checkWinner(row, squares, cur) {
    if (cur == null || cur.length === 0) {
        return;
    }
    /*
     * [0,0] [1,0] [2,0] [3,0] [4,0]
     * [0,1] [1,1] [2,1] [3,1] [4,1]
     * [0,2] [1,2] [2,2] [3,2] [4,2]
     * [0,3] [1,3] [2,3] [3,3] [4,3]
     * [0,4] [1,4] [2,4] [3,4] [4,4]
     */
    // [최우측, 최좌측, 최하단, 최상단]
    const [maxH, minH, maxV, minV] = [
        Math.min(cur[0] + 4, row - 1),
        Math.max(cur[0] - 4, 0),
        Math.min(cur[1] + 4, row - 1),
        Math.max(cur[1] - 4, 0)
    ];

    let count = 0;
    let [x,y]= cur;
    const [verticalLen, horizonLen] = [maxV - minV, maxH - minH];
    const diagonalLen = Math.min(verticalLen, horizonLen)

    // 가로 최좌측 min -> 최우측 max
    if(horizonLen >= 4) {
        for (let i = minH; i <= maxH; i++) {
            if(squares[i][y] === squares[x][y]) {
                count++;
            } else {
                count = 0;
            }
            if(count >= 5) {
                console.log(squares[x][y], 'ok you win');
                return squares[x][y];
            }
        }
    }

    // 세로 최상층 min -> 최하층 max
    if(verticalLen >= 4) {
        for (let i = minV; i <= maxV; i++) {
            if(squares[x][i] === squares[x][y]) {
                count++;
            } else {
                count = 0;
            }
            if(count >= 5) {
                console.log(squares[x][y], 'ok you win');
                return squares[x][y];
            }
        }
    }


    // 대각선 최좌측상단(min,min) -> 최우측하단(max,max)
    if(verticalLen >= 4 && horizonLen >= 4) {
        for (let i = 0; i <= diagonalLen; i++) {
            if(squares[minH + i][minV + i] === squares[x][y]) {
                count++;
            } else {
                count = 0;
            }
            if(count >= 5) {
                console.log(squares[x][y], 'ok you win');
                return squares[x][y];
            }
        }
    }

    // 대각선 최우측상단(min,max) -> 최좌측하단(max,min)
    if(verticalLen >= 4 && horizonLen >= 4) {
        for (let i = 0; i <= diagonalLen; i++) {
            if(squares[minH + i][maxV - i] === squares[x][y]) {
                count++;
            } else {
                count = 0;
            }
            if(count >= 5) {
                console.log(squares[x][y], 'ok you win');
                return squares[x][y];
            }

        }}


    return null;
}

function Square({value, onSquareClick}) {
    return <button className={"square " + value} onClick={onSquareClick}>{value}</button>;
}

//보드판
function Board({xIsNext, squares, addHistory, row}) {
    // 클릭시 addHistory 로 배열 전달
    function handleClick(i) {
        const [x, y] = [i % row, Math.floor(i / row)];
        if (!!squares[x][y]) {
            return;
        }
        squares[x][y] = xIsNext ? "O" : "X";
        console.log(checkWinner(row, squares, [x, y]));
        addHistory([x, y]);
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
    const [squares, setSquares] = useState(Array.from(Array(row),
        () => (new Array(row).fill(null))));
    const currentMove = history.length - 1;
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[history.length - 1];


    // 히스토리 추가
    function addHistory(position) {
        setHistory([...history, position]);
    }

    // 히스토리로 이동
    function jumpTo(nextStep) {
        const removeHistory = history.slice(nextStep, history.length)
        removeHistory.forEach((p) => {
            squares[p[0]][p[1]] = null;
        })
        setHistory(history.slice(0, nextStep));
    }

    // 게임 리셋
    function restart(newRow = row) {
        setHistory([]);
        setSquares(Array.from(Array(newRow), () => (new Array(newRow).fill(null))));
    }

    // 보드판 크기 설정
    const setBoardSize = (newRow) => {
        restart(+newRow)
        setRow(+newRow);
    }

    // move에 대한 렌더링
    const button = (step) => +step === +currentMove ? <label>Now : {step + 1}</label> :
        <button onClick={() => jumpTo(step)}>Go to move #{step + 1}</button>
    const moves = history.map((squares, step) => {
            return (
                <>
                    <ol key={step}>
                        {button(step)}
                    </ol>
                </>
            );
        })
    ;

    return (
        <>
            <div className="game">
                <div className="game-board">
                    <Board xIsNext={xIsNext} squares={squares} addHistory={addHistory} row={row}/>
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <button onClick={() => restart()}>restart</button>
                    <ol key={moves}>{moves}</ol>
                </div>
            </div>
            <label htmlFor="row"> board size : {row} </label>
            <br/>
            <input id="row" value={row} onInput={(e) => setBoardSize(e.target.value)} type="range" min="5" max="22"/>
        </>
    );
}
