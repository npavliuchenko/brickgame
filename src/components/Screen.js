import React from 'react';

import {mergeMatrix} from '../utils/math';
import SvgOrnament from '../svg/Ornament';
import Board from './Board';
// import {ReactComponent as Ornament} from '../img/ornament.svg';
// import svgOrnament from '../img/ornament.raw.svg';

import './Screen.scss';



class Screen extends React.Component {
  render() {
    const boardState = mergeMatrix(
      this.props.board,
      this.props.current.figure,
      this.props.current.y,
      this.props.current.x
    );

    return (
      <div className="screen">
        <SvgOrnament className="decor-left" />
        <SvgOrnament className="decor-right" />
        <Board board={boardState} />
        <div className="score"></div>
        <div className="next"></div>
        <div className="speed"></div>
        <div className="level"></div>
        <div className="rotate"></div>
      </div>
    );
  }
}

export default Screen;
