const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const SPEED_TICK = 500;
const CONTROLS_SENSIVITY = 5;

const ROTATION_DIRECTION = 1; // ClockWise

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

const START_X_OFFSET = Math.floor((BOARD_WIDTH - FIGURES[0][0].length) / 2);
const START_Y_OFFSET = -2;

export {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  SPEED_TICK,
  CONTROLS_SENSIVITY,
  ROTATION_DIRECTION,
  FIGURES,
  START_X_OFFSET,
  START_Y_OFFSET
};
