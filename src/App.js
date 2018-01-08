import React from 'react';

import {STATE_OFF, STATE_BUSY, STATE_PLAY, STATE_PAUSE,
  BOARD_WIDTH, BOARD_HEIGHT, SPEED_DELAY_BASIC, SPEED_DELAY_CHANGE,
  CONTROLS_SENSIVITY, ROTATION_DEFAULT, FIGURES,
  START_X_OFFSET, START_Y_OFFSET,
  KEYBOARD_KEYS, SCORE_BONUS, SPEED_SWITCH_SCORE} from './utils/constants';
import {random, createMatrix, copyMatrix, rotateMatrix, mergeMatrix,
  hasOverflow, clearLines, div} from './utils/math';
import Screen from './components/Screen';
import Button from './components/Button';

import './App.scss';

const DEBUG = true;
const DEBUG_TICKS_LIMIT = 1000;

function printTimingStats(intervalsArray) {
  let min = Number.MAX_VALUE;
  let max = 0;
  let sum = 0.0;

  for (let i = 0; i < intervalsArray.length; i++) {
    if (intervalsArray[i] < min) min = intervalsArray[i];
    if (intervalsArray[i] > max) max = intervalsArray[i];
    sum += intervalsArray[i];
  }

  console.log(
    'MIN : ' + min.toFixed(2) + 'ms',
    'MAX : ' + max.toFixed(2) + 'ms',
    'AVG : ' + (sum / intervalsArray.length).toFixed(2) + 'ms'
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: STATE_OFF,
      board: createMatrix(BOARD_HEIGHT, BOARD_WIDTH),
      current: null,
      next: [[0]],
      score: 'hello',
      speed: 1,
      level: 1,
      rotation: ROTATION_DEFAULT
    }

    DEBUG && console.log(this);
  }

  initGame() {
    this.keys = {};
    this.didNothingOnPreviousTick = false;
    this.isBusy = false;
    this.ticks = [];

    this.setState({
      board: createMatrix(BOARD_HEIGHT, BOARD_WIDTH),
      current: { // fake figure outside the board to start the 'tick' loop
        figure: [[1]],
        x: START_X_OFFSET,
        y: BOARD_HEIGHT
      },
      next: this._getRandomFigure(),
      score: 0
    });
  }

  startGame() {
    //@TODO: may be use recursive setTimeout to change speeds ???
    //       but setTimeout excludes code run from timer (so less smooth)
    //       test the time difference (delays for tick run) :
    //       ~9-130ms per tick (avg=12ms)

    this.setState({
      state: STATE_PLAY
    });

    this.gameTimer = setInterval(
      this.tick.bind(this),
      this._getDelayFromSpeed(this.state.speed)
    );
    this.limit = DEBUG_TICKS_LIMIT;
    this.tick(); // run 1st tick manually to provide better feeling for user
  }

  pauseGame() {
    clearInterval(this.gameTimer);

    this.setState({
      state: STATE_PAUSE
    });

    DEBUG && printTimingStats(this.ticks);
  }

  _getRandomFigure() {
    return rotateMatrix(FIGURES[random(FIGURES.length)], random(4));
  }

  _getDelayFromSpeed(speed) {
    return SPEED_DELAY_BASIC - (speed - 1) * SPEED_DELAY_CHANGE;
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
    const t0 = performance.now();

    //@TODO: cancel if game over (on high speeds)
    // if (this.state.state !== STATE_PLAY) return;

    //@TODO: remove after debugging
    if (DEBUG && --this.limit <= 0) {
      this.handleStart('stop');
    }

    this.setState((prevState, props) => {
      let newState;
      const canMove = !hasOverflow(
        prevState.board,
        prevState.current.figure,
        prevState.current.y + 1,
        prevState.current.x
      );

      // if current figure is still falling ...
      if (canMove) {
        newState = {
          current: {
            figure: prevState.current.figure,
            x: prevState.current.x,
            y: prevState.current.y + 1
          }
        }

      // if current figure is already down ...
      } else {
        // check for game over
        if (this.didNothingOnPreviousTick) {
          this.gameOver();
          return;
        }

        // remove the full lines
        const [linesCleared, board] = clearLines(
          // move figure to board layer
          mergeMatrix(
            prevState.board,
            prevState.current.figure,
            prevState.current.y,
            prevState.current.x
          ),
          prevState.current.y,
          prevState.current.y + prevState.current.figure.length - 1
        );

        const newScore = prevState.score + SCORE_BONUS[linesCleared];
        const newSpeed = Math.min(9, div(newScore, SPEED_SWITCH_SCORE) + 1);

        DEBUG && console.log(linesCleared + ' lines cleared', SCORE_BONUS[linesCleared] + ' points are gotten');
        DEBUG && linesCleared && console.log(newScore + ' points', 'new speed is ' + newSpeed);

        if (newScore % SPEED_SWITCH_SCORE === 0) {
          clearInterval(this.gameTimer);
          this.gameTimer = setInterval(this.tick.bind(this), this._getDelayFromSpeed(newSpeed));
        }

        // update next & current figures, score
        newState = {
          board: board,
          current: {
            figure: prevState.next,
            x: START_X_OFFSET,
            y: START_Y_OFFSET
          },
          next: this._getRandomFigure(),
          score: newScore,
          speed: newSpeed
        }
      }

      this.didNothingOnPreviousTick = !canMove;
      return newState;
    });

    const t1 = performance.now();
    this.ticks.push(t1 - t0);
    DEBUG && console.log('tick was ' + (t1 - t0) + ' ms');
  }

  gameOver() {
    // recursive timeout for board animation
    const clearBoard = (iteration) => {
      this.setState((prevState, props) => {
        // console.log(iteration, prevState.board)
        const newBoard = copyMatrix(prevState.board);
        newBoard[iteration] = Array(prevState.board[iteration].length).fill(0);
        return { board: newBoard };
      });

      if (iteration > 0) {
        setTimeout(() => { clearBoard(iteration - 1) }, 100);
      } else {
        this.setState({
          state: STATE_OFF
        });
      }
    }

    DEBUG && console.log('game over', 'score: ' + this.state.score);

    // stop game
    this.handleStart('pause');
    // reset figures
    this.setState({
      state: STATE_BUSY,
      next: createMatrix(FIGURES[0].length, FIGURES[0][0].length),
      current: null
    });

    // run animation
    clearBoard(this.state.board.length - 1);
  }

  handleStart(command) {
    DEBUG && console.log(this.state.state, command);

    if ((this.state.state === STATE_OFF && command === undefined)
      || command === 'init')
    {
      this.initGame();
      this.startGame();
    } else if ((this.state.state === STATE_PAUSE && command === undefined)
      || command === 'start')
    {
      this.startGame();
    } else {
      this.pauseGame();
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
      const rotatedFigure = rotateMatrix(prevState.current.figure, prevState.rotation);

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

  switchRotation() {
    this.setState((prevState, props) => {
      DEBUG && console.log('rotation direction changed');

      return {
        rotation: prevState.rotation > 0 ? -1 : 1
      };
    });
  }

  runAction(actionName) {
    let actionHandlers = {};

    actionHandlers[STATE_PLAY] = {
      start:  () => { this.handleStart() },
      left:   () => { this.handleMove(-1) },
      down:   () => { this.tick() },
      right:  () => { this.handleMove(1) },
      rotate: () => { this.handleRotate() }
    };
    actionHandlers[STATE_OFF] = {
      start:  () => { this.handleStart() },
    };
    actionHandlers[STATE_PAUSE] = {
      start:  () => { this.handleStart() },
      rotate: () => { this.switchRotation() }
    };

    DEBUG && console.log(this.state.state, actionName);

    if (actionHandlers.hasOwnProperty(this.state.state)
      && actionHandlers[this.state.state].hasOwnProperty(actionName))
    {
      actionHandlers[this.state.state][actionName]();
    }
  }

  handleLongPress(e) {
    const actionName = e.target.className;

    DEBUG && console.log(actionName + ' button', e.type === 'mousedown' ? 'on' : 'off');

    if (e.type === 'mousedown') {
      this.runAction(actionName);

      this.keys[actionName] = setInterval(() => {
        this.runAction(actionName);
      }, this._getDelayFromSpeed(this.state.speed) / CONTROLS_SENSIVITY);
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
    // DEBUG && console.log(e.code, e.type, e);

    if (KEYBOARD_KEYS.hasOwnProperty(e.code)) {
      e.preventDefault();
      this.runAction(KEYBOARD_KEYS[e.code]);
    }
  }

  render() {
    const boardState = this.state.current ?
      mergeMatrix(
        this.state.board,
        this.state.current.figure,
        this.state.current.y,
        this.state.current.x
      ) :
      this.state.board;

    return (
      <div className="app">
        <Screen
          board={boardState}
          next={this.state.next}
          score={this.state.score}
          speed={this.state.speed}
          level={this.state.level}
          rotation={this.state.rotation > 0 ? 'cw' : 'ccw'}
        />

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
