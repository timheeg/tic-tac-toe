import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import sort_icon from './img/sort-down.png'
import new_icon from './img/new.png'

function SortArrow(props) {
  let classname = "sort-arrow-"
  classname += props.order === 'asc' ? "asc" : "desc"
  
  return (
    <span className="sort-arrow" onClick={props.onClick}>
      <img className={classname}
        src={sort_icon} alt={props.order} />
    </span>
  )
}

function Square(props) {
  let classname = "square"
  classname += props.winner ? " win-square" : ""
  return (
    <div className="square-container">
      <button className={classname} onClick={props.onClick}>
        {props.value}
      </button>
    </div>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let is_winner = this.props.winners ?
      this.props.winners.includes(i) : false

    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        winner={is_winner}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const rows = []
    for (let row=0; row < 3; row++) {
      const cols = [];
      for (let col=0; col < 3; col++) {
        cols.push(this.renderSquare(row*3+col))
      }
      rows.push(
        <div className="board-row">{cols}</div>
      )
    }

    return (
      <div>{rows}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      sortAsc: false
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let square;
    square = current.square;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    square = i;
    this.setState({
      history: history.concat([{
        squares: squares,
        square: square
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleSortClick() {
    const sort = this.state.sortAsc;
    this.setState({
      sortAsc: !sort
    });
  }

  handleNewGame() {
    // Don't reset current sort order
    this.setState(state => ({
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true
    }));
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = calculateWinner(current.squares);
    const winner = result ? result[0] : null;
    const winners = result ? result[1] : null;

    let moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const val = step.squares[step.square]
      const col = (step.square % 3) + 1;
      const row = Math.floor(step.square / 3) + 1;
      const label = move ?
        val + ' (' + col + ', ' + row + ')' : '';
      return(
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={(move === this.state.stepNumber) ?
              { fontWeight: 'bold' } :
              { fontWeight: 'normal'}
            }>
              {desc}
          </button>
          <span className="label"
            style={(move === this.state.stepNumber) ?
              { fontWeight: 'bold' } :
              { fontWeight: 'normal'}
            }>
              {label}
            </span>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      if (!current.squares.includes(null)) {
        status = "Draw: Cat's game";
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    const sortAsc = this.state.sortAsc;
    if (!sortAsc) {
      moves = moves.reverse()
    }
    let order = sortAsc ? 'asc' : '';

    return (
      <div className="game">
        <div className="new-game">
          <span>New Game</span>
          <img className="new-button"
            src={new_icon}
            alt="New game"
            onClick={() => this.handleNewGame()} />
        </div>
        <div className="game-board">
          <Board 
            squares={current.squares}
            winners={winners}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="game-status">{status}</div>
          <br/>
          <div className="game-moves-label">Moves:
            <SortArrow
              order={order}
              onClick={() => this.handleSortClick()}
            />
          </div>
          <div className="game-moves">
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

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
      return [squares[a], [a, b, c]];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
