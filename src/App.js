import {useState} from "react";

export default function Board() {
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    function calculateWinner(squares) {
        //한 변의 길이
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

    function handleClick(i) {
        const newSquares = squares.slice();
        if(!!newSquares[i] || calculateWinner(squares)){
            return;
        }
        if (xIsNext) {
            newSquares[i] = "O";
        } else {
            newSquares[i] = "X";
        }
        setXIsNext(!xIsNext);
        setSquares(newSquares);
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
        {renderRow(1)}
        {renderRow(4)}
        {renderRow(7)}
    </>);
}

function Square({value, onSquareClick}) {
    return <button className="square" onClick={onSquareClick}>{value}</button>;
}
