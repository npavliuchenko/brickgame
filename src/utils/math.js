function random(max) {
  return Math.floor(Math.random() * max);
}

function div(a, b) {
  const sign = a >= 0 ? 1 : -1;
  return Math.floor(Math.abs(a) / b) * sign;
}

//@TEST: sizes 1x2,3x5, check that cells are not pointed
function createMatrix(height, width) {
  const tmpArr = Array(width).fill(0);

  return Array(height).fill(0).map(() => {
    return tmpArr.slice();
  });
}

// @TEST: matrix are independend and equal
function copyMatrix(m) {
  return Array(m.length).fill(0).map((value, index) => {
    return m[index].slice();
  });
}

function _rotateMatrixAbstract(m, fx, fy) {
  const mHeight = m.length;
  const mWidth = m[0].length;
  const result = createMatrix(mWidth, mHeight);

  for (let i = 0; i < mWidth; i++) {
    for (let j = 0; j < mHeight; j++) {
      result[i][j] = m[fx(i,j)][fy(i,j)];
    }
  }

  return result;
}

function rotateMatrixCW(m) {
  return _rotateMatrixAbstract(m,
    (i,j) => (m.length - j - 1),
    (i,j) => i
  );
}

function rotateMatrixCCW(m) {
  return _rotateMatrixAbstract(m,
    (i,j) => j,
    (i,j) => (m[0].length - i - 1)
  );
}

//@TEST: angle 0 - no changes, 1CW = 3CCW, 3CW = 1CCW, 4CW = m, 4CCW = m, 1CW manual check
function rotateMatrix(m, angle) { // angle > 0 ? CW : CCW
  let result = copyMatrix(m);

  for (let i = 0 ; i < Math.abs(angle); i++) {
    result = angle > 0 ? rotateMatrixCW(result) : rotateMatrixCCW(result);
  }

  return result;
}

function mergeMatrix(environment, insertion, yOffset, xOffset) {
  const result = copyMatrix(environment);
  const width = environment[0].length;
  const height = environment.length;

  for (let i = 0; i < insertion.length; i++) {
    for (let j = 0; j < insertion[0].length; j++) {
      if ((yOffset + i >= 0) && (yOffset + i < height)
        && (xOffset + j >= 0) && (xOffset + j <width)
      ) {
        result[yOffset + i][xOffset + j] = Math.max(result[yOffset + i][xOffset + j], insertion[i][j]);
      }
    }
  }

  // console.log(result);

  return result;
}

// function canMergeMatrix()

export {random, div, createMatrix, copyMatrix, rotateMatrix, mergeMatrix};
