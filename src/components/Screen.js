import React from 'react';

import SvgOrnament from '../svg/Ornament';
import Board from './Board';
import ScoreBoard from './ScoreBoard';
import NumberBoard from './NumberBoard';
// import {ReactComponent as Ornament} from '../img/ornament.svg';
// import svgOrnament from '../img/ornament.raw.svg';

import './Screen.scss';



class Screen extends React.Component {
  render() {
    return (
      <div className="screen">
        <SvgOrnament className="decor-left" />
        <SvgOrnament className="decor-right" />
        <Board content={this.props.board} className="board" />
        <Board content={this.props.next} className="next" />
        <ScoreBoard content={this.props.score} />
        <NumberBoard content={this.props.speed} className="speed" />
        <NumberBoard content={1} className="level" />
        {/*<div className="rotate"></div>
        <div className="state"></div>*/}
      </div>
    );
  }
}

export default Screen;
