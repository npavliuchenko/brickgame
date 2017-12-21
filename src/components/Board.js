import React from 'react';
// import './Board.scss';



class Board extends React.Component {
  render() {
    return (
      <div className="board">
        {this.props.board.map((row, i) =>
          <div key={i}>
            {row.map((cell, j) =>
              <div key={j} className={'digit ' + (cell ? 'active' : 'passive')}></div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Board;
