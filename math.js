class Matrix {

  constructor(data) {
    if (data[0][0] == undefined) throw Error("Must pass in 2D array");
    this.data = data;
    const length = data[0].length;
    const height = data.length;
    data.forEach(row => {
      if (row.length !== length) throw Error('All rows must be same length')
    })
    this.shape = [length, height];
    this.height = height;
    this.length = length;
  }

  multiply(matrixB) {
    if (!(matrixB instanceof Matrix)) throw Error('Argument must be instance of Matrix');
    const matrixA = this; // easier naming

    if (!(matrixA.length === matrixB.height)) {
      throw Error(`Matrices must have matching heigth and length. ${matrixA.length} should equal ${matrixB.height}`)
    };

    const newLength = matrixA.height;
    const newHeight = matrixB.length;
    const newMatrixData = [];

    for (let i = 0; i < newHeight; i++) {
      const row = [];
      for (let j = 0; j < newLength; j++) {
        row.push(null);
      }
      newMatrixData.push(row);
    }
    for (let i = 0; i < matrixA.height; i++) {
      for (let j = 0; j < matrixB.length; j++) {
        // get row of A and column of B
        const rowOfA = matrixA.getRow(i);
        const columnOfB = matrixB.getColumn(j);

        newMatrixData[j][i] = dotProduct(rowOfA, columnOfB);
      }
    }
    return new Matrix(newMatrixData);
  }
  /**
   * 
   * @param {Number} index 0 based column index
   * @return {Number[]} copy of the numbers in that column
   */
  getColumn(index) {
    const height = this.shape[1];
    const column = []
    for (let h = 0; h < height; h++) {
      const row = this.data[h];
      const valueInColumn = row[index];
      column.push(valueInColumn);
    }
    return column;
  }
  /**
   * 
   * @param {*} index 
   * @returns 
   */
  getRow(index) {
    const row = []
    this.data[index].forEach(item => row.push(item));
    return row;
  }

  /**
   * Sets the row of the Matrix object. Modifies the original object.
   * @param {Number} index 
   * @param {Number[]} row 
   */
  setRow(index, row) {
    if (this.length !== row.length) throw Error(`Cannot set row of length ${row.length} to a matrix with length ${this.length}`)
    this.data[index] = row;
  }

  print() {
    for (let h = 0; h < this.height; h++) {
      console.log(this.data[h]);
    }
  }

  /**
   * Tranposes the matrix such that all the columns are now the rows.
   * @returns the transposed matrix
   */
  transpose() {
    let transposedData = [];
    for (let i = 0; i < this.length; i++) {
      const transposedColumnVector = this.getColumn(i);
      transposedData.push(transposedColumnVector);
    }
    return new Matrix(transposedData);
  }

  /**
   * Creates a copy of a matrix
   * @returns 
   */
  copy() {
    const newMatrixData = [];
    for (let i = 0; i < this.height; i++) {
      const row = this.getRow(i);
      newMatrixData.push(row);
    }
    return new Matrix(newMatrixData);
  }

  /**
   * Multiplies a matrix by a constant and returns a copy, does not mutate original array
   * @param {Number} c the constant which the matrix will be multiplied by
   * @returns 
   */
  multiplyByConstant(c) {
    const M = this.copy();
    for (let i = 0; i < M.height; i++) {
      const newRow = []
      for (let j = 0; j < M.length; j++) {
        newRow.push(this.data[i][j] * c);
      }
      M.setRow(i, newRow);
    }
    return M;
  }


  addMatrix(matrixB) {
    if (!(matrixB.height == this.height && matrixB.length == this.length)) throw Error(`Cannot add matrix with dimensions ${matrixB.length} by ${matrixB.height} by this matrix w/ dimensions ${this.shape}`);
    const newMatrixData = [];
    for (let i = 0; i < this.height; i++) {
      const newRow = [];
      for (let j = 0; j < this.length; j++) {
        newRow.push(this.data[i][j] + matrixB.data[i][j]);
      }
      newMatrixData.push(newRow);
    }
    return new Matrix(newMatrixData);
  }

  subtractMatrix(matrixB) {
    return this.addMatrix(matrixB.multiplyByConstant(-1));
  }
}

function dotProduct(vectorA, vectorB) {
  if (vectorA.length !== vectorB.length || !(vectorA && vectorB)) throw Error(`Vectors must be same length, cannot multiply vector A of length ${vectorA.length} with vector B of length ${vectorB.length}`);
  let dotProduct = 0;
  for (let v = 0; v < vectorA.length; v++) {
    dotProduct += vectorA[v] * vectorB[v];
  }
  return dotProduct;
}

function vecToMat(vector) {
  const matrixData = [];
  vector.forEach(vi => matrixData.push([vi]));
  return new Matrix(matrixData);
}




function derivative(xMat, yMat, wVec) {
  // function is 2X^T(Xw-y)
  const leftSide = xMat.multiplyByConstant(2).transpose()
  const Xw = xMat.multiply(vecToMat(wVec)).transpose();
  const rightSide = Xw.subtractMatrix(yMat);
  return leftSide.multiply(rightSide);
}

const X = new Matrix([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12],
  [13, 14, 15],
  [16, 17, 18],
  [19, 20, 21],
  [22, 23, 24],
  [25, 26, 27],
  [28, 29, 30]
]);

const Y = new Matrix([
  [1],
  [2],
  [3],
  [4],
  [5],
  [6],
  [7],
  [8],
  [9],
  [10]
]);


derivative(X, Y, [1, 1, 1]).print()

function smallStep() {
  let counter = 1;
  let w = [1, 1, 1];
  const stepSize = 0.0001;
  while (counter < 2000) {
    const gradient = derivative(X, Y, w);
    const nextGradMat = vecToMat(w).transpose().subtractMatrix(
      gradient.multiplyByConstant(stepSize)
    )
    w = nextGradMat.data[0]
    console.log(dotProduct(w, w));
    counter++;
  }
}

smallStep()