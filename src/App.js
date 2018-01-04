import React from 'react';

import {BOARD_WIDTH, BOARD_HEIGHT, SPEED_TICK, CONTROLS_SENSIVITY,
  ROTATION_DIRECTION, FIGURES, START_X_OFFSET, START_Y_OFFSET,
  KEYBOARD_KEYS} from './utils/constants';
import {random, createMatrix, rotateMatrix, mergeMatrix,
  hasOverflow} from './utils/math';
import Screen from './components/Screen';
import Button from './components/Button';

import './App.scss';

const DEBUG = true;
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
      next: this._getRandomFigure()
    };
    this.keys = {};

    this.handlePause('stop');

    DEBUG && console.log(this);
  }

  _getRandomFigure() {
    return rotateMatrix(FIGURES[random(FIGURES.length)], random(4));
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyboard);
    // document.addEventListener('keyup', this.handleKeyboard);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyboard);
    // document.removeEventListener('keyup', this.handleKeyboard);
  }

  //@TODO: remove after debugging
  componentWillUpdate() {
    // console.log('up');
  }

  // update game state
  tick() {
    //@TODO: remove after debugging
    if (DEBUG && --this.limit <= 0) {
      this.handlePause('stop');
    }

    //@TODO: may be problem with async state ? The same is for all outer checks
    const canMove = !hasOverflow(
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
          next: this._getRandomFigure()
        };
      });
    }

    DEBUG && console.log('fall ' + this.limit, canMove);
  }

  handlePause(command) {
    if (command === 'stop' || (this.timer && command !== 'play')) {
      clearInterval(this.timer);
      this.timer = null;
    } else {
      //@TODO: use recursive setTimeout to change speeds
      //       test the time difference (delays for tick run)
      this.timer = setInterval(this.tick.bind(this), SPEED_TICK);
      this.limit = DEBUG_TICKS_LIMIT;
    }
  }

  handleMove(offset) {
    this.setState((prevState, props) => {
      // check if move is possible
      const canMove = !hasOverflow(
        prevState.board,
        prevState.current.figure,
        prevState.current.y,
        prevState.current.x + offset
      );

      DEBUG && console.log('move ' + (offset === -1 ? 'left' : 'right'), canMove);

      if (canMove) return {
        current: {
          figure: prevState.current.figure,
          x: prevState.current.x + offset,
          y: prevState.current.y
        }
      };
    });
  }

  handleRotate() {
    //@TODO: non-intuitive rotation, especially near the vertical walls
    this.setState((prevState, props) => {
      const rotatedFigure = rotateMatrix(prevState.current.figure, ROTATION_DIRECTION);

      // check if rotation is possible
      const canMove = !hasOverflow(
        prevState.board,
        rotatedFigure,
        prevState.current.y,
        prevState.current.x
      );

      DEBUG && console.log('rotate', canMove);

      if (canMove) return {
        current: {
          figure: rotatedFigure,
          x: prevState.current.x,
          y: prevState.current.y
        }
      };
    });
  }

  runAction(actionName) {
    const actionHandlers = {
      start:  () => { this.handlePause() },
      left:   () => { this.handleMove(-1) },
      down:   () => { this.tick() },
      right:  () => { this.handleMove(1) },
      rotate: () => { this.handleRotate() }
    }

    if (actionHandlers.hasOwnProperty(actionName)) {
      if (actionName === 'start' || DEBUG || this.timer) { // block actions on pause
        actionHandlers[actionName]();
      }
    }
  }

  handleLongPress(e) {
    const actionName = e.target.className;

    DEBUG && console.log(actionName + ' button', e.type === 'mousedown' ? 'on' : 'off');

    if (e.type === 'mousedown') {
      this.runAction(actionName);

      this.keys[actionName] = setInterval(() => {
        this.runAction(actionName);
      }, SPEED_TICK / CONTROLS_SENSIVITY);
    } else {
      clearInterval(this.keys[actionName]);
    }
  }

  handleShortPress(e) {
    DEBUG && console.log(e.target.className + ' button');
    this.runAction(e.target.className);
  }

  handleButtonPress = (e) => { // fix App as context
    if (e.type === 'click') {
      this.handleShortPress(e);
    } else {
      this.handleLongPress(e);
    }
  }

  handleKeyboard = (e) => { // fix App as context
    DEBUG && console.log(e.code, e.type, e);

    if (KEYBOARD_KEYS.hasOwnProperty(e.code)) {
      e.preventDefault();
      this.runAction(KEYBOARD_KEYS[e.code]);
    }
  }

  render() {
    return (
      <div className="app" tabIndex="0">
        <Screen board={this.state.board} current={this.state.current} />

        <div className="controls">
          <div className="game-controls">
            <Button type="start" onShortPress={this.handleButtonPress} />
          </div>

          <div className="move-controls">
            <Button type="left" onLongPress={this.handleButtonPress} />
            <Button type="down" onLongPress={this.handleButtonPress} />
            <Button type="right" onLongPress={this.handleButtonPress} />
          </div>

          <div className="action-controls">
            <Button type="rotate" onLongPress={this.handleButtonPress} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
