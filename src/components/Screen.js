import React from 'react';

import {mergeMatrix} from '../utils/math';
import SvgOrnament from '../svg/Ornament';
import Board from './Board';
import NumberBoard from './NumberBoard';
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
        <Board content={boardState} className="board" />
        <Board content={this.props.next} className="next" />
        <NumberBoard content={'     0'} className="score" />
        {/*<NumberBoard content={'0123456789'} className="test" />
        <NumberBoard content={1} className="speed" />
        <NumberBoard content="" className="level" />*/}
        <div className="rotate"></div>
        <div className="state"></div>
      </div>
    );
  }
}

export default Screen;
