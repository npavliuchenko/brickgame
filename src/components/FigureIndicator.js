import React from 'react';

import {createMatrix, mergeMatrix} from '../utils/math';
import Board from './Board';



class FigureIndicator extends React.Component {
  render() {
    const width = 4;
    const height = 4;
    const dataToShow = mergeMatrix(
      createMatrix(height, width),
      this.props.content,
      Math.ceil((height - this.props.content.length) / 2),
      Math.ceil((width - this.props.content[0].length) / 2)
    );

    return (
      <Board content={dataToShow} className="next" />
    );
  }
}

export default FigureIndicator;
