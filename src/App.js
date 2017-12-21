import React from 'react';

import {BOARD_WIDTH, BOARD_HEIGHT, FIGURES} from './utils/constants';
import {random, div, createMatrix, rotateMatrix} from './utils/math';
import Screen from './components/Screen';
import Button from './components/Button';

import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: createMatrix(BOARD_HEIGHT, BOARD_WIDTH),
      current: {
        figure: this.randomFigure(),
        x: div(BOARD_WIDTH - FIGURES[0][0].length, 2),
        y: -2
      },
      next: this.randomFigure()
    };

    this.test();
  }

  test() {
    // var a = createMatrix(5, 3);
    // console.log(a);
    // a[4][2] = 1;
    // a[3][2] = 1;
    // a[0][0] = 1;
    // var b = copyMatrix(a);
    // a[1][1] = 2;
    // console.log(a,b);
  }

  randomFigure() {
    return rotateMatrix(FIGURES[random(FIGURES.length)], random(4));
  }

  tick() { // update game state
    // check if current figure is down
    // yes:
    //    move figure to board layer
    //    check score
    //    next->current figure
    //    update next
    // no:
    //    move figure
  }

  render() {
    return (
      <div className="app">
        <Screen board={this.state.board} current={this.state.current}/>

        <div className="controls">
          <div className="game-controls">
            <Button type="start" />
          </div>

          <div className="move-controls">
            <Button type="left" />
            <Button type="down" />
            <Button type="right" />
          </div>

          <div className="action-controls">
            <Button type="rotate" />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
