import React from 'react';

import {BOARD_WIDTH, BOARD_HEIGHT, SPEED_TICK, FIGURES} from './utils/constants';
import {random, div, createMatrix, rotateMatrix, mergeMatrix, getFloorDistance} from './utils/math';
import Screen from './components/Screen';
import Button from './components/Button';

import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: createMatrix(BOARD_HEIGHT, BOARD_WIDTH),
      // current: {
      //   figure: this.randomFigure(),
      //   x: div(BOARD_WIDTH - FIGURES[0][0].length, 2),
      //   y: -2
      // },
      current: {
        figure: [[0]],
        x: 0,
        y: 0
      },
      next: this.randomFigure()
    };

    this.test();

    //@TODO: change to recursive setTimeout to change speeds
    //       test the time difference (delays for tick run)
    console.log(this);
    this.floorDistance = 0;
    this.limit = 100;
    this.timer = setInterval(this.tick.bind(this), SPEED_TICK);
    // this.timer = setInterval(this.tick, SPEED_TICK);
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
    //@TODO: remove
    this.limit--;
    if (this.limit <= 0) {
      clearInterval(this.timer);
    }

    // check if current figure is down
    // yes:
    if (this.floorDistance === 0) {
      //@TODO: check for game over

      this.setState((prevState, props) => {
        // move figure to board layer
        const board = mergeMatrix(
          prevState.board,
          prevState.current.figure,
          prevState.current.y,
          prevState.current.x
        );

        //@TODO: check score

        const xOffset = div(BOARD_WIDTH - FIGURES[0][0].length, 2)
        const yOffset = -2;

        this.floorDistance = getFloorDistance( board, prevState.next, yOffset, xOffset);
        //@TODO: may be better to store the array, so not recalc on moves

        console.log(this);

        // update next & current figures
        return {
          board: board,
          current: {
            figure: prevState.next,
            x: xOffset,
            y: yOffset
          },
          next: this.randomFigure()
        };
      });
    // no:
    } else {
      // move figure
      this.floorDistance--;

      this.setState((prevState, props) => ({
        current: {
          figure: prevState.current.figure,
          x: prevState.current.x,
          y: prevState.current.y + 1
        }
      }));
    }

    console.log(this.limit, this.floorDistance);
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
