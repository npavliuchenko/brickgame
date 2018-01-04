import React from 'react';
// import './Board.scss';



class Board extends React.Component {
  render() {
    console.log(this.props.content);

    if (!Array.isArray(this.props.content) || !this.props.content.length) {
      return null;
    }

    return (
      <div className={'matrix ' + this.props.className}>
        {this.props.content.map((row, i) =>
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
