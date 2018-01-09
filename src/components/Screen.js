import React from 'react';

import SvgOrnament from '../svg/Ornament';
import Board from './Board';
import ScoreBoard from './ScoreBoard';
import NumberBoard from './NumberBoard';
import RotationIndicator from './RotationIndicator';
import FigureIndicator from './FigureIndicator';
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
        <FigureIndicator content={this.props.next} />
        <ScoreBoard content={this.props.score} />
        <NumberBoard content={this.props.speed} className="speed" />
        <NumberBoard content={this.props.level} className="level" />
        <RotationIndicator content={this.props.rotation} />
        {/*<div className="state"></div>*/}
      </div>
    );
  }
}

export default Screen;
