export type DataSet = {
  price: number;
  area: number;
}[];

export enum DataSetTypeX {
  AREA = "area",
}

export enum DataSetTypeY {
  PRICE = "price",
}

export type Matrix = number[][];

export const dataSet: DataSet = [
  {
    price: 240,
    area: 30,
  },
  {
    price: 249,
    area: 42,
  },
  {
    price: 300,
    area: 50,
  },
  {
    price: 289,
    area: 56,
  },
  {
    price: 315,
    area: 46,
  },
  {
    price: 420,
    area: 57,
  },
  {
    price: 580,
    area: 68,
  },
  {
    price: 889,
    area: 76,
  },
  {
    price: 1212,
    area: 123,
  },
  {
    price: 2030,
    area: 220,
  },
];

const formatData = (data: DataSet) => {
  const yVector: Matrix = [];
  const xMatrix: Matrix = [];
  const yKey = Object.values(DataSetTypeY);
  const xKey = Object.values(DataSetTypeX);
  for (let i = 0; i < data.length; i++) {
    const xItem = [1];
    const yItem = [];
    for (let j = 0; j < xKey.length; j++) {
      xItem.push(data[i][xKey[j]]);
    }

    for (let j = 0; j < yKey.length; j++) {
      yItem.push(data[i][yKey[j]]);
    }
    xMatrix.push(xItem);
    yVector.push(yItem);
  }
  const thetas: Matrix = Array.from({ length: xMatrix[0].length }, () => [1]);
  return [yVector, xMatrix, thetas];
};

export const [yVector, xMatrix, thetas] = formatData(dataSet);
