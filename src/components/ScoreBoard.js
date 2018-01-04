import React from 'react';

import {SCORE_DIGITS} from '../utils/constants';
import NumberBoard from './NumberBoard';
// import './NumberBoard.scss';



class ScoreBoard extends React.Component {
  //@TODO: marquee
  //@TODO: switch

  render() {
    const str = this.props.content.toString();
    const formatted = ' '.repeat(SCORE_DIGITS - str.length) + str;
    // console.log(this.props.content, formatted);

    return (
      <NumberBoard content={formatted} className="score" />
    );
  }
}

export default ScoreBoard;
