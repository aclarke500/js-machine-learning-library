class Matrix {
    // public columns;
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
        const [aLength, aHeight] = matrixA.shape;
        const [bLength, bHeight] = matrixB.shape;
        if (!(aLength === bHeight)) {
            console.log('egg')
            throw Error(`Matrices must have matching heigth and length. ${aHeight} should equal ${bLength}`)
        };
        console.log(aLength, aHeight, bHeight, bLength)
        const newLength = aHeight;
        const newHeight = bLength;
        const newMatrixData = [];

        for (let i = 0; i < newHeight; i++) {
            const row = [];
            for (let j = 0; j < newLength; j++) {
                row.push(null);
            }
            newMatrixData.push(row);
        }

        console.log(newMatrixData)
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

    getRow(index) {
        const row = []
        this.data[index].forEach(item => row.push(item));
        return row;
    }

    print() {
        for (let h = 0; h < this.height; h++) {
            console.log(this.data[h]);
        }
    }
}

function dotProduct(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) throw Error(`Vectors must be same length, cannot multiply vector A of length ${vectorA.length} with vector B of length ${vectorB.length}`);
    let dotProduct = 0;
    for (let v = 0; v < vectorA.length; v++) {
        dotProduct += vectorA[v] * vectorB[v];
    }
    return dotProduct;
}

const data = [
    [1, 2, 3],
    [4, 5, 6]
];

const secondData = [
    [1],
    [2],
    [3]
]


const M = new Matrix(data);
const M2 = new Matrix(secondData);
console.log(M.shape)
console.log(M2.shape)

M.multiply(M2)
console.log(M.getColumn(0))
// M2.multiply(M)

M.print()