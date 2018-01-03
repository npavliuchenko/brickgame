import React from 'react';

import {BOARD_WIDTH, BOARD_HEIGHT, SPEED_TICK, FIGURES, START_X_OFFSET, START_Y_OFFSET} from './utils/constants';
import {random, createMatrix, rotateMatrix, mergeMatrix, hasOverflow} from './utils/math';
import Screen from './components/Screen';
import Button from './components/Button';

import './App.scss';

const DEBUG_TICKS_LIMIT = 100;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: createMatrix(BOARD_HEIGHT, BOARD_WIDTH),
      current: { // fake figure outside the board to start the 'tick' loop
        figure: [[1]],
        x: START_X_OFFSET,
        y: BOARD_HEIGHT
      },
      next: this.getRandomFigure()
    };

    //@TODO: use recursive setTimeout to change speeds
    //       test the time difference (delays for tick run)
    console.log(this);

    this.handlePause('stop');
  }

  getRandomFigure() {
    return rotateMatrix(FIGURES[random(FIGURES.length)], random(4));
  }

  tick() { // update game state
    //@TODO: remove after debugging
    if (--this.limit === 0) {
      this.handlePause('stop');
    }

    const canMove = !hasOverflow( //@TODO: may be problem with async state ?
      this.state.board,
      this.state.current.figure,
      this.state.current.y + 1,
      this.state.current.x
    );

    // if current figure is still falling:
    if (canMove) {
      // move it
      this.setState((prevState, props) => ({
        current: {
          figure: prevState.current.figure,
          x: prevState.current.x,
          y: prevState.current.y + 1
        }
      }));

    // if current figure is already down:
    } else {
      //@TODO: check for game over
      //@TODO: check score

      this.setState((prevState, props) => {
        // move figure to board layer
        const board = mergeMatrix(
          prevState.board,
          prevState.current.figure,
          prevState.current.y,
          prevState.current.x
        );

        // update next & current figures
        return {
          board: board,
          current: {
            figure: prevState.next,
            x: START_X_OFFSET,
            y: START_Y_OFFSET
          },
          next: this.getRandomFigure()
        };
      });
    }

    console.log('fall ' + this.limit, canMove);
  }

  handleMove(offset) {
    const canMove = !hasOverflow(
      this.state.board,
      this.state.current.figure,
      this.state.current.y,
      this.state.current.x + offset
    );

    console.log('move ' + (offset === -1 ? 'left' : 'right'), canMove);

    // check if move is possible
    if (canMove) {
      this.setState((prevState, props) => ({
        current: {
          figure: prevState.current.figure,
          x: prevState.current.x + offset,
          y: prevState.current.y
        }
      }));
    }
  }

  handleDown() {

  }

  handlePause(command) {
    if (command === 'stop' || (this.timer && command !== 'play')) {
      clearInterval(this.timer);
      this.timer = null;
    } else {
      this.timer = setInterval(this.tick.bind(this), SPEED_TICK);
      this.limit = DEBUG_TICKS_LIMIT;
    }
  }

  handleKeyboard(e) {
    console.log(e, e.key);
  }

  render() {
    return (
      <div className="app">
        <Screen board={this.state.board} current={this.state.current} />

        <div className="controls">
          <div className="game-controls">
            <Button type="start" onClick={() => this.handlePause()} />
          </div>

          <div className="move-controls">
            <Button type="left" onClick={() => this.handleMove(-1)} />
            <Button type="down" onClick={this.handleDown} />
            <Button type="right" onClick={() => this.handleMove(1)} />
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
