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

function rotateMatrix(m, angle) { // angle > 0 ? CW : CCW
  let result = copyMatrix(m);

  for (let i = 0 ; i < Math.abs(angle); i++) {
    result = angle > 0 ? rotateMatrixCW(result) : rotateMatrixCCW(result);
  }

  return result;
}

function mergeMatrix(container, insertion, yOffset, xOffset) {
  const result = copyMatrix(container);
  const width = container[0].length;
  const height = container.length;

  // for each cell AND() `container` and `insertion`
  for (let i = 0; i < insertion.length; i++) {
    for (let j = 0; j < insertion[0].length; j++) {
      if ((yOffset + i >= 0) && (yOffset + i < height)
        && (xOffset + j >= 0) && (xOffset + j <width)
      ) {
        result[yOffset + i][xOffset + j] = Math.max(result[yOffset + i][xOffset + j], insertion[i][j]);
      }
    }
  }

  return result;
}

function hasOverflow(container, insertion, yOffset, xOffset) {
  const conWidth = container[0].length;
  const conHeight = container.length;
  const insWidth = insertion[0].length;
  const insHeight = insertion.length;
  // console.log(insertion);

  //@TODO: can optimize ?
  for (let i = 0; i < insHeight; i++) {
    for (let j = 0; j < insWidth; j++) {
      if (insertion[i][j]) {
        let iContainer = i + yOffset;
        let jContainer = j + xOffset;
        // console.log(yOffset, xOffset,':',i,j,' - ',iContainer,jContainer);

        if ( iContainer >= conHeight // exclude top border
          || jContainer >= conWidth || jContainer < 0
          || (iContainer >= 0 && container[iContainer][jContainer])
        ) return true;
      }
    }
  }

  return false;
}

function clearLines(m, first, last) {
  const rowToStart = (first === undefined || first < 0) ? 0 : first;
  const rowToFinish = (last === undefined || last > m.length - 1) ? m.length - 1 : last;
  const result = copyMatrix(m);
  const rowLength = m[0].length;
  const linesToClear = [];

  // get the lines to clear
  for (let i = rowToStart; i <= rowToFinish; i++) {
    let flag = true;
    for (let j = 0; j < m[0].length; j++) {
      flag = flag && m[i][j];
    }
    if (flag) {
      linesToClear.push(i);
    }
  }

  // update matrix
  //@TODO: refactor ?
  for (let i = 0; i < linesToClear.length; i++) {
    result.splice(linesToClear[i], 1);
    result.unshift(Array(rowLength).fill(0));
  }

  return [linesToClear.length, result];
}

export {
  random,
  div,
  createMatrix,
  copyMatrix,
  rotateMatrix,
  mergeMatrix,
  hasOverflow,
  clearLines
};
