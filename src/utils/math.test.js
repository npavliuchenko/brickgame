import * as M from './math';
import {BOARD_WIDTH, BOARD_HEIGHT, START_X_OFFSET} from './constants';

test('random(max)', () => {
  // test the random values interval
  const max = 9;
  const counter = Array(max + 2).fill(0);

  for (let i = 0; i < 10000; i++) {
    counter[M.random(max) + 1]++;
  }

  expect(counter[0]).toEqual(0);
  expect(counter[max+1]).toEqual(0);
  for (let i = 1; i <= max; i++) {
    expect(counter[i]).toBeGreaterThan(0);
  }
});

test('div(a, b)', () => {
  expect(M.div(10, 2)).toEqual(5);
  expect(M.div(11, 2)).toEqual(5);
  expect(M.div(12, 2)).toEqual(6);
  expect(M.div(32, 3)).toEqual(10);
  expect(M.div(10, 15)).toEqual(0);
  expect(M.div(12, 1)).toEqual(12);
  expect(M.div(0, 3)).toEqual(0);
  expect(M.div(-9, 2)).toEqual(-4);
});

test('createMatrix(h, w)', () => {
  const m1 = M.createMatrix(1, 1);
  expect(m1).toEqual([[0]]);            // extra size value

  const m2 = M.createMatrix(2, 2);
  expect(m2).toEqual([[0, 0], [0, 0]]); // proper creation
  m2[1][0] = 1;
  expect(m2).toEqual([[0, 0], [1, 0]]); // cells are not connected

  const m3 = M.createMatrix(3, 5);
  expect(m3).toHaveLength(3);           // check for non-square sizes
  for (let i = 0; i < 3; i++) {
    expect(m3[0]).toHaveLength(5);
  }
});

test('rotateMatrix(m, a)', () => {
  const m0 = [[1,0,0,0],[0,1,0,0],[0,0,0,1]];
  expect(M.rotateMatrix(m0, 0)).toEqual(m0);
  expect(M.rotateMatrix(m0, 4)).toEqual(m0);
  const mcw = M.rotateMatrix(m0, 1);
  const mccw = M.rotateMatrix(m0, -1);
  expect(M.rotateMatrix(m0, 3)).toEqual(mccw);
  expect(M.rotateMatrix(m0, -3)).toEqual(mcw);
});

test('copyMatrix(m)', () => {
  const m0 = [[1,0,0,0],[0,1,0,0],[0,0,0,1]];
  const m1 = M.copyMatrix(m0);
  expect(m1).toEqual(m0);     // are equal
  m1[0][0] = 2;
  expect(m1).not.toEqual(m0); // but not connected
});

test('mergeMatrix(container, insertion, yOffset, xOffset)', () => {
  const m0 = [[1,0,0,0],[0,1,0,0],[0,0,0,1]];
  const m1 = [[1,1],[0,1]];
  expect(M.mergeMatrix(m0, m1, 0, 0)).toEqual([[1,1,0,0],[0,1,0,0],[0,0,0,1]]);
  expect(M.mergeMatrix(m0, m1, 0, 1)).toEqual([[1,1,1,0],[0,1,1,0],[0,0,0,1]]);
  expect(M.mergeMatrix(m0, m1, 1, 2)).toEqual([[1,0,0,0],[0,1,1,1],[0,0,0,1]]);
  //@TODO: exceptions (out of border), also <0
});

test('hasOverflow(container, insertion, yOffset, xOffset)', () => {
  const e0 = M.createMatrix(BOARD_HEIGHT, BOARD_WIDTH);
  const e1 = M.createMatrix(10, 5);
  const e2 = M.copyMatrix(e1);
  e2[5] = [0,1,0,1,0];
  const m0 = [[1]];
  const m1 = [[0,0,0],[0,1,0],[0,0,0]];
  const m2 = [[0,1,0],[1,1,0],[0,1,0]];

  // board borders intersections
  // somewhere inside
  expect(M.hasOverflow(e1, m1, 0, 0)).toEqual(false);
  expect(M.hasOverflow(e1, m1, 6, 1)).toEqual(false);
  // left border
  expect(M.hasOverflow(e1, m1, 1, -1)).toEqual(false);
  expect(M.hasOverflow(e1, m1, 1, -2)).toEqual(true);
  expect(M.hasOverflow(e1, m1, 1, -3)).toEqual(true);
  expect(M.hasOverflow(e1, m1, 1, -5)).toEqual(true);
  // top border
  expect(M.hasOverflow(e1, m1, -1, 1)).toEqual(false);
  expect(M.hasOverflow(e1, m1, -2, 1)).toEqual(false);
  expect(M.hasOverflow(e1, m1, -3, 1)).toEqual(false);
  expect(M.hasOverflow(e1, m1, -5, 1)).toEqual(false);
  // right border
  expect(M.hasOverflow(e1, m1, 1, 3)).toEqual(false);
  expect(M.hasOverflow(e1, m1, 1, 4)).toEqual(true);
  expect(M.hasOverflow(e1, m1, 1, 5)).toEqual(true);
  expect(M.hasOverflow(e1, m1, 1, 7)).toEqual(true);
  // bottom border
  expect(M.hasOverflow(e1, m1, 8, 2)).toEqual(false);
  expect(M.hasOverflow(e1, m1, 9, 2)).toEqual(true);
  expect(M.hasOverflow(e1, m1, 10, 2)).toEqual(true);
  expect(M.hasOverflow(e1, m1, 12, 2)).toEqual(true);
  // corners
  expect(M.hasOverflow(e1, m1, -1, -1)).toEqual(false);
  expect(M.hasOverflow(e1, m1, -2, -2)).toEqual(true);
  expect(M.hasOverflow(e1, m1, -1, 3)).toEqual(false);
  expect(M.hasOverflow(e1, m1, -2, 4)).toEqual(true);
  expect(M.hasOverflow(e1, m1, 8, -1)).toEqual(false);
  expect(M.hasOverflow(e1, m1, 9, -2)).toEqual(true);
  expect(M.hasOverflow(e1, m1, 8, 3)).toEqual(false);
  expect(M.hasOverflow(e1, m1, 9, 4)).toEqual(true);

  // the same for more complicated figure
  // somewhere inside
  expect(M.hasOverflow(e1, m2, 6, 1)).toEqual(false);
  // left border
  expect(M.hasOverflow(e1, m2, 1, 0)).toEqual(false);
  expect(M.hasOverflow(e1, m2, 1, -1)).toEqual(true);
  // top border
  expect(M.hasOverflow(e1, m2, 0, 1)).toEqual(false);
  expect(M.hasOverflow(e1, m2, -1, 1)).toEqual(false);
  // right border
  expect(M.hasOverflow(e1, m2, 1, 3)).toEqual(false);
  expect(M.hasOverflow(e1, m2, 1, 4)).toEqual(true);
  // bottom border
  expect(M.hasOverflow(e1, m2, 7, 2)).toEqual(false);
  expect(M.hasOverflow(e1, m2, 8, 2)).toEqual(true);

  // board content intersection
  expect(M.hasOverflow(e2, m2, 2, 0)).toEqual(false);
  expect(M.hasOverflow(e2, m2, 2, 1)).toEqual(false);
  expect(M.hasOverflow(e2, m2, 2, 2)).toEqual(false);
  expect(M.hasOverflow(e2, m2, 2, 3)).toEqual(false);

  expect(M.hasOverflow(e2, m2, 3, 0)).toEqual(true);
  expect(M.hasOverflow(e2, m2, 3, 1)).toEqual(false);
  expect(M.hasOverflow(e2, m2, 3, 2)).toEqual(true);
  expect(M.hasOverflow(e2, m2, 3, 3)).toEqual(false);

  expect(M.hasOverflow(e2, m2, 4, 0)).toEqual(true);
  expect(M.hasOverflow(e2, m2, 4, 1)).toEqual(true);
  expect(M.hasOverflow(e2, m2, 4, 2)).toEqual(true);
  expect(M.hasOverflow(e2, m2, 4, 4)).toEqual(true);

  expect(M.hasOverflow(e2, m2, 5, 0)).toEqual(true);
  expect(M.hasOverflow(e2, m2, 5, 1)).toEqual(false);
  expect(M.hasOverflow(e2, m2, 5, 2)).toEqual(true);
  expect(M.hasOverflow(e2, m2, 5, 3)).toEqual(false);

  expect(M.hasOverflow(e2, m2, 6, 0)).toEqual(false);
  expect(M.hasOverflow(e2, m2, 6, 1)).toEqual(false);
  expect(M.hasOverflow(e2, m2, 6, 2)).toEqual(false);
  expect(M.hasOverflow(e2, m2, 6, 3)).toEqual(false);

  // initial position test
  expect(M.hasOverflow(e0, m0, BOARD_HEIGHT, START_X_OFFSET)).toEqual(true);
});

test('clearLines(m, first, last)', () => {
  const m0 = M.createMatrix(10, 5);
  const m1 = [[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1]];
  const m2 = [[1,0,1],[1,1,1],[0,0,1],[1,1,0],[1,1,1]];

  expect(M.clearLines(m0)).toEqual([0, m0]);

  expect(M.clearLines(m1)).toEqual(      [5, [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]]);
  expect(M.clearLines(m1, -2)).toEqual(  [5, [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]]);
  expect(M.clearLines(m1, 0)).toEqual(   [5, [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]]);
  expect(M.clearLines(m1, 1)).toEqual(   [4, [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[1,1,1]]]);
  expect(M.clearLines(m1, 4)).toEqual(   [1, [[0,0,0],[1,1,1],[1,1,1],[1,1,1],[1,1,1]]]);
  expect(M.clearLines(m1, 5)).toEqual(   [0, m1]);
  expect(M.clearLines(m1, 0, 0)).toEqual([1, [[0,0,0],[1,1,1],[1,1,1],[1,1,1],[1,1,1]]]);
  expect(M.clearLines(m1, 0, 1)).toEqual([2, [[0,0,0],[0,0,0],[1,1,1],[1,1,1],[1,1,1]]]);
  expect(M.clearLines(m1, 1, 3)).toEqual([3, [[0,0,0],[0,0,0],[0,0,0],[1,1,1],[1,1,1]]]);
  expect(M.clearLines(m1, 1, 9)).toEqual([4, [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[1,1,1]]]);

  expect(M.clearLines(m2)).toEqual(      [2, [[0,0,0],[0,0,0],[1,0,1],[0,0,1],[1,1,0]]]);
  expect(M.clearLines(m2, 0, 0)).toEqual([0, m2]);
  expect(M.clearLines(m2, 0, 1)).toEqual([1, [[0,0,0],[1,0,1],[0,0,1],[1,1,0],[1,1,1]]]);
  expect(M.clearLines(m2, 0, 2)).toEqual([1, [[0,0,0],[1,0,1],[0,0,1],[1,1,0],[1,1,1]]]);
  expect(M.clearLines(m2, 0, 3)).toEqual([1, [[0,0,0],[1,0,1],[0,0,1],[1,1,0],[1,1,1]]]);
  expect(M.clearLines(m2, 0, 4)).toEqual([2, [[0,0,0],[0,0,0],[1,0,1],[0,0,1],[1,1,0]]]);
  expect(M.clearLines(m2, 1, 1)).toEqual([1, [[0,0,0],[1,0,1],[0,0,1],[1,1,0],[1,1,1]]]);
  expect(M.clearLines(m2, 1, 2)).toEqual([1, [[0,0,0],[1,0,1],[0,0,1],[1,1,0],[1,1,1]]]);
  expect(M.clearLines(m2, 1, 3)).toEqual([1, [[0,0,0],[1,0,1],[0,0,1],[1,1,0],[1,1,1]]]);
  expect(M.clearLines(m2, 1, 4)).toEqual([2, [[0,0,0],[0,0,0],[1,0,1],[0,0,1],[1,1,0]]]);
  expect(M.clearLines(m2, 2, 2)).toEqual([0, m2]);
  expect(M.clearLines(m2, 2, 3)).toEqual([0, m2]);
  expect(M.clearLines(m2, 2, 4)).toEqual([1, [[0,0,0],[1,0,1],[1,1,1],[0,0,1],[1,1,0]]]);
  expect(M.clearLines(m2, 3, 3)).toEqual([0, m2]);
  expect(M.clearLines(m2, 3, 4)).toEqual([1, [[0,0,0],[1,0,1],[1,1,1],[0,0,1],[1,1,0]]]);
  expect(M.clearLines(m2, 4, 4)).toEqual([1, [[0,0,0],[1,0,1],[1,1,1],[0,0,1],[1,1,0]]]);
});

test('generateLevel(h, w, lvl)', () => {
  function testLevel(m, lvl) {
    const h = m.length;
    const w = m[0].length;
    const row0 =  Array(w).fill(0);
    const row1 =  Array(w).fill(1);

    for (let i = 0; i < h - lvl; i++) {
      expect(m[i]).toEqual(row0);
    }

    for (let i = h - lvl; i < h; i++) {
      expect(m[i]).not.toEqual(row0);
      expect(m[i]).not.toEqual(row1);
    }

  }

  testLevel(M.generateLevel(7, 5, 1), 1);
  testLevel(M.generateLevel(7, 5, 3), 3);
  testLevel(M.generateLevel(7, 5, 8), 7);
  testLevel(M.generateLevel(7, 5, 0), 0);
});
