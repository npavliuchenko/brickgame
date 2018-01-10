import React from 'react';

import {STATE_OFF, STATE_BUSY, STATE_PLAY, STATE_PAUSE,
  BOARD_WIDTH, BOARD_HEIGHT, SPEED_DELAY_BASIC, SPEED_DELAY_CHANGE,
  CONTROLS_REPEAT_DELAY, ROTATION_DEFAULT, FIGURES,
  MAX_SPEED, MAX_LEVEL, STORAGE_PREFFIX,
  KEYBOARD_KEYS, SCORE_BONUS, SPEED_SWITCH_SCORE} from './utils/constants';
import {random, createMatrix, copyMatrix, rotateMatrix, mergeMatrix,
  hasOverflow, clearLines, div, generateLevel} from './utils/math';
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

function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: STATE_OFF,
      board: createMatrix(BOARD_HEIGHT, BOARD_WIDTH),
      current: null,
      next: [[0]],
      score: 0,
      speed: 0,
      level: 0,
      rotation: ROTATION_DEFAULT
    };

    this.keys = {};
    this.highscore = this.loadHighScore();

    DEBUG && console.log(this);
  }

  initGame() {
    this.didNothingOnPreviousTick = false;
    this.ticks = [];
    this.initialSpeed = this.state.speed;

    this.setState({
      board: generateLevel(BOARD_HEIGHT, BOARD_WIDTH, this.state.level),
      current: { // fake figure outside the board to start the 'tick' loop
        figure: [[1]],
        x: 0,
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
    return SPEED_DELAY_BASIC - (speed) * SPEED_DELAY_CHANGE;
  }

  _getSpeedByScore(score, initialSpeed) {
    return Math.min(MAX_SPEED, div(score, SPEED_SWITCH_SCORE) + initialSpeed);
  }

  _getFigureWithOffsets(figure) {
    return {
      figure: figure,
      x: Math.floor((BOARD_WIDTH - figure[0].length) / 2),
      y: -Math.floor(figure.length / 2)
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyboard);
    document.addEventListener('keyup', this.handleKeyboard);

    if (this.resumeGame()) {
      this.didNothingOnPreviousTick = false;
      this.ticks = [];
    };
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyboard);
    document.removeEventListener('keyup', this.handleKeyboard);
  }

  //@TODO: remove after debugging
  componentWillUpdate() {
    // console.log('up');
  }

  // update game state
  tick() {
    const t0 = performance.now();
    let isGameOver = false;

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
      // this branch takes ~10ms
      } else {
        // check for game over
        if (this.didNothingOnPreviousTick) {
          isGameOver = true;
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
        const newSpeed = this._getSpeedByScore(newScore, this.initialSpeed);

        DEBUG && console.log(linesCleared + ' lines cleared', SCORE_BONUS[linesCleared] + ' points are gotten');
        DEBUG && linesCleared && console.log(newScore + ' points', 'new speed is ' + newSpeed);

        if (newScore % SPEED_SWITCH_SCORE === 0) {
          clearInterval(this.gameTimer);
          this.gameTimer = setInterval(this.tick.bind(this), this._getDelayFromSpeed(newSpeed));
        }

        // update next & current figures, score
        newState = {
          board: board,
          current: this._getFigureWithOffsets(prevState.next),
          next: this._getRandomFigure(),
          score: newScore,
          speed: newSpeed
        }

        this.saveGame(true, newState);
      }

      this.didNothingOnPreviousTick = !canMove;
      return newState;
    });

    if (isGameOver) this.gameOver();

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

    DEBUG && console.log('game over', 'score: ' + this.state.score, this.highscore);

    // stop game
    // this.handleStart('pause');
    clearInterval(this.gameTimer);
    // clear saved game
    this.saveGame(false);
    // reset figures
    this.setState({
      state: STATE_BUSY,
      next: [[0]],
      current: null,
    });
    // save highscore
    if (this.state.score > this.highscore) {
      this.saveHighScore(this.state.score);
    }

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

  handleRotationSwitch() {
    this.setState((prevState, props) => {
      DEBUG && console.log('rotation direction changed');

      return {
        rotation: prevState.rotation > 0 ? -1 : 1
      };
    });
  }

  handleSpeedChange() {
    this.setState((prevState, props) => ({
      speed: prevState.speed < MAX_SPEED ? prevState.speed + 1 : 0
    }));
  }

  handleLevelChange() {
    this.setState((prevState, props) => ({
      level: prevState.level < MAX_LEVEL ? prevState.level + 1 : 0
    }));
  }

  runAction(actionName) {
    let actionHandlers = {};

    actionHandlers[STATE_PLAY] = {
      start:  () => { this.handleStart() },
      left:   () => { this.handleMove(-1); return true }, // return true for repeatable actions
      down:   () => { this.tick(); return true },
      right:  () => { this.handleMove(1); return true },
      rotate: () => { this.handleRotate() }
    };
    actionHandlers[STATE_OFF] = {
      start:  () => { this.handleStart() },
      rotate: () => { this.handleRotationSwitch() },
      right:  () => { this.handleSpeedChange() },
      left:   () => { this.handleLevelChange() },
    };
    actionHandlers[STATE_PAUSE] = {
      start:  () => { this.handleStart() },
      rotate: () => { this.handleRotationSwitch() },
    };

    DEBUG && console.log(this.state.state, actionName);

    if (actionHandlers.hasOwnProperty(this.state.state)
      && actionHandlers[this.state.state].hasOwnProperty(actionName))
    {
      return actionHandlers[this.state.state][actionName]();
    }
  }

  handleLongAction(actionName, isStarting) {
    DEBUG && console.log(actionName, isStarting ? 'on' : 'off');

    if (isStarting) {
      if (this.keys[actionName]) return;

      if (this.runAction(actionName)) {
        this.keys[actionName] = setInterval(() => {
          this.runAction(actionName);
        }, CONTROLS_REPEAT_DELAY);
      }
    } else {
      clearInterval(this.keys[actionName]);
      this.keys[actionName] = null;
    }
  }

  handleShortAction(actionName) {
    DEBUG && console.log(actionName + ' button');
    this.runAction(actionName);
  }

  handleButtonPress = (e) => { // fix App as context
    this.handleLongAction(e.target.className, e.type === 'mousedown');
  }

  handleKeyboard = (e) => { // fix App as context
    // DEBUG && console.log(e.code, e.type, e);

    if (KEYBOARD_KEYS.hasOwnProperty(e.code)) {
      e.preventDefault();
      this.handleLongAction(KEYBOARD_KEYS[e.code], e.type === 'keydown');
    }
  }

  saveGame(isRunning, state) {
    DEBUG && console.log('saving', isRunning);

    function saveValue(key, v) {
      window.localStorage[STORAGE_PREFFIX + '.game.' + key] = v;
    }

    function saveMatrix(key, m) {
      for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[0].length; j++) {
          saveValue(key + '.' + i + '.' + j, m[i][j]);
        }
      }

      saveValue(key + '.w', m[0].length);
      saveValue(key + '.h', m.length);
    }

    if (!supportsLocalStorage()) return;

    saveValue('running', isRunning ? '1' : '');

    if (!isRunning) return;

    saveMatrix('board',   state.board);
    saveMatrix('current', state.current.figure);
    saveMatrix('next',    state.next);
    saveValue('score',    state.score);
    saveValue('speed0',   this.initialSpeed);
    saveValue('level',    this.state.level);
    saveValue('rotation', this.state.rotation);
  }

  resumeGame() {
    function loadValue(key) {
      return parseInt(window.localStorage[STORAGE_PREFFIX + '.game.' + key], 10);
    }

    function loadMatrix(key) {
      const w = loadValue(key + '.w');
      const h = loadValue(key + '.h');
      const m = createMatrix(h, w);

      for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
          m[i][j] = loadValue(key + '.' + i + '.' + j);
        }
      }

      return m;
    }

    if (!supportsLocalStorage() || !loadValue('running')) return false;

    const score = loadValue('score');
    const initialSpeed = loadValue('speed0');

    this.setState({
      state: STATE_PAUSE,
      board: loadMatrix('board'),
      current: this._getFigureWithOffsets(loadMatrix('current')),
      next: loadMatrix('next'),
      score: score,
      speed: this._getSpeedByScore(score, initialSpeed),
      level: loadValue('level'),
      rotation: loadValue('rotation')
    });

    this.initialSpeed = initialSpeed;

    return true;
  }

  saveHighScore(score) {
    this.highscore = score;

    if (!supportsLocalStorage()) return;
    window.localStorage[STORAGE_PREFFIX + '.highscore'] = score;
  }

  loadHighScore() {
    if (!supportsLocalStorage()) return 0;
    return parseInt(window.localStorage[STORAGE_PREFFIX + '.highscore'], 10) || 0;
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
          gamestate={this.state.state}
          board={boardState}
          next={this.state.next}
          score={this.state.score}
          speed={this.state.speed}
          level={this.state.level}
          rotation={this.state.rotation > 0 ? 'cw' : 'ccw'}
          highscore={this.highscore}
        />

        <div className="controls">
          <div className="game-controls">
            <Button type="start" onPress={this.handleButtonPress} />
          </div>

          <div className="move-controls">
            <Button type="left" onPress={this.handleButtonPress} />
            <Button type="down" onPress={this.handleButtonPress} />
            <Button type="right" onPress={this.handleButtonPress} />
          </div>

          <div className="action-controls">
            <Button type="rotate" onPress={this.handleButtonPress} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
