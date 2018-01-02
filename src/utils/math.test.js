import * as M from './math';

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

test('mergeMatrix(environment, insertion, yOffset, xOffset)', () => {
  const m0 = [[1,0,0,0],[0,1,0,0],[0,0,0,1]];
  const m1 = [[1,1],[0,1]];
  expect(M.mergeMatrix(m0, m1, 0, 0)).toEqual([[1,1,0,0],[0,1,0,0],[0,0,0,1]]);
  expect(M.mergeMatrix(m0, m1, 0, 1)).toEqual([[1,1,1,0],[0,1,1,0],[0,0,0,1]]);
  expect(M.mergeMatrix(m0, m1, 1, 2)).toEqual([[1,0,0,0],[0,1,1,1],[0,0,0,1]]);
  //@TODO: exceptions (out of border), also <0
});

test('getFloorDistance(environment, insertion, yOffset, xOffset)', () => {
  const e1 = M.createMatrix(10, 5);
  const e2 = M.copyMatrix(e1);
  e2[9] = [0,0,1,1,0];
  const e3 = M.copyMatrix(e1);
  e3[5] = [0,1,0,1,0];
  const m1 = [[0,0,0],[0,1,0],[0,0,0]];
  const m2 = [[0,1,0],[1,1,0],[0,1,0]];

  expect(M.getFloorDistance(e1, m1, 0, 1)).toEqual(8);
  expect(M.getFloorDistance(e1, m1, 2, 3)).toEqual(6);
  expect(M.getFloorDistance(e1, m2, 0, 1)).toEqual(7);
  expect(M.getFloorDistance(e1, m2, 1, 1)).toEqual(6);

  expect(M.getFloorDistance(e2, m1, 0, 1)).toEqual(7);
  expect(M.getFloorDistance(e2, m1, 2, 3)).toEqual(6);
  expect(M.getFloorDistance(e2, m2, 0, 0)).toEqual(7);
  expect(M.getFloorDistance(e2, m2, 0, 1)).toEqual(6);
  expect(M.getFloorDistance(e2, m2, 0, 3)).toEqual(7);

  expect(M.getFloorDistance(e3, m1, 1, -1)).toEqual(7);
  expect(M.getFloorDistance(e3, m1, 1, 0)).toEqual(2);
  expect(M.getFloorDistance(e3, m2, 0, 0)).toEqual(2);
  expect(M.getFloorDistance(e3, m2, 0, 1)).toEqual(3);
  expect(M.getFloorDistance(e3, m2, 1, 3)).toEqual(2);
  expect(M.getFloorDistance(e3, m2, 3, 3)).toEqual(0);
});
