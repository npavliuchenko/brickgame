const STATE_OFF = 0;
const STATE_BUSY = -1;
const STATE_PLAY = 1;
const STATE_PAUSE = 2

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const SPEED_DELAY_BASIC = 500;
const SPEED_DELAY_CHANGE = 45;
const SPEED_SWITCH_SCORE = 200; // 100000;
const CONTROLS_SENSIVITY = 5;
const CONTROLS_REPEAT_DELAY = 100;

const MAX_SPEED = 9;
const MAX_LEVEL = 9;

const ROTATION_DEFAULT = 1; // ClockWise

const SCORE_DIGITS = 6;

const STORAGE_PREFFIX = 'tetris';

const FIGURES = [
  [ [0,1,0,0],  // I
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0] ],

  [ [0,1,0],  // J
    [0,1,0],
    [1,1,0] ],

  [ [0,1,0],  // L
    [0,1,0],
    [0,1,1] ],

  [ [0,0,0],  // S
    [0,1,1],
    [1,1,0] ],

  [ [0,0,0],  // T
    [1,1,1],
    [0,1,0] ],

  [ [0,0,0],  // Z
    [1,1,0],
    [0,1,1] ],

  [ [1,1],  // O
    [1,1] ],
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
  CONTROLS_REPEAT_DELAY,
  MAX_SPEED,
  MAX_LEVEL,
  ROTATION_DEFAULT,
  SCORE_DIGITS,
  STORAGE_PREFFIX,
  FIGURES,
  KEYBOARD_KEYS,
  SCORE_BONUS,
};
