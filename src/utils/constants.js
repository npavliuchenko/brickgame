const STATE_OFF = 0;
const STATE_BUSY = -1;
const STATE_PLAY = 1;
const STATE_PAUSE = 2

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const SPEED_DELAY_BASIC = 500;
const SPEED_DELAY_CHANGE = 50;
const SPEED_SWITCH_SCORE = 200; // 100000;
const CONTROLS_SENSIVITY = 5;

const MAX_SPEED = 9;
const MAX_LEVEL = 9;

const ROTATION_DEFAULT = 1; // ClockWise

const SCORE_DIGITS = 6;

const FIGURES = [
  [ [0,1,0,0],  // I
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0] ],

  [ [0,0,0,0],  // J
    [0,0,1,0],
    [0,0,1,0],
    [0,1,1,0] ],

  [ [0,0,0,0],  // L
    [0,1,0,0],
    [0,1,0,0],
    [0,1,1,0] ],

  [ [0,0,0,0],  // S
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0] ],

  [ [0,0,0,0],  // T
    [1,1,1,0],
    [0,1,0,0],
    [0,0,0,0] ],

  [ [0,0,0,0],  // Z
    [0,1,1,0],
    [0,0,1,1],
    [0,0,0,0] ],

  [ [0,0,0,0],  // O
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0] ],
];

const KEYBOARD_KEYS = {
  Space: 'start',
  KeyA: 'left',
  KeyS: 'down',
  KeyD: 'right',
  KeyW: 'rotate',
  ArrowLeft: 'left',
  ArrowDown: 'down',
  ArrowRight: 'right',
  ArrowUp: 'rotate'
};

const SCORE_BONUS = {
  0: 0,
  1: 100,
  2: 300,
  3: 700,
  4: 1500
};

const START_X_OFFSET = Math.floor((BOARD_WIDTH - FIGURES[0][0].length) / 2);
const START_Y_OFFSET = -2;

export {
  STATE_OFF,
  STATE_BUSY,
  STATE_PLAY,
  STATE_PAUSE,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  SPEED_DELAY_BASIC,
  SPEED_DELAY_CHANGE,
  SPEED_SWITCH_SCORE,
  CONTROLS_SENSIVITY,
  MAX_SPEED,
  MAX_LEVEL,
  ROTATION_DEFAULT,
  SCORE_DIGITS,
  FIGURES,
  KEYBOARD_KEYS,
  SCORE_BONUS,
  START_X_OFFSET,
  START_Y_OFFSET
};
