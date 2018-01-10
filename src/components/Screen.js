import React from 'react';

import {STATE_OFF, STATE_BUSY, STATE_PAUSE} from '../utils/constants';
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
    const scoreText = []; //@TODO: optimize ?
    switch (this.props.gamestate) {
      case STATE_OFF: {
        scoreText.push(this.props.score ? this.props.score : 'hello');
        this.props.highscore && scoreText.push(this.props.highscore);
        this.props.highscore === this.props.score && this.props.highscore !== 0 && scoreText.push('u top');
        break;
      }
      case STATE_BUSY: {
        scoreText.push('ha-ha');
        break;
      }
      case STATE_PAUSE: {
        scoreText.push(this.props.score);
        scoreText.push('pause');
        this.props.highscore && scoreText.push(this.props.highscore);
        break;
      }
      default: {
        scoreText.push(this.props.score);
      }
    }

    return (
      <div className="screen">
        <SvgOrnament className="decor-left" />
        <SvgOrnament className="decor-right" />
        <Board content={this.props.board} className="board" />
        <FigureIndicator content={this.props.next} />
        <ScoreBoard content={scoreText} />
        <NumberBoard content={this.props.speed} className="speed" />
        <NumberBoard content={this.props.level} className="level" />
        <RotationIndicator content={this.props.rotation} />
      </div>
    );
  }
}

export default Screen;
