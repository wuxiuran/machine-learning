import Decimal from "decimal.js";
import { Matrix } from "../data/data";
export const fixed = (n: number | Decimal, num: number) =>
  new Decimal(new Decimal(n).toFixed(num)).toNumber();

export const hypothesis = (
  thetaItems: Matrix,
  xMatrixItems: number[]
): number => {
  let result = 0;
  for (let i = 0; i < thetaItems.length; i++) {
    result = Decimal.add(
      result,
      Decimal.mul(thetaItems[i][0], xMatrixItems[i])
    ).toNumber();
  }
  return result;
};

// const cost = (yVector: Matrix, xMatrix: Matrix, thetas: number[]) => {
//   return J(yVector, xMatrix, thetas) / 2 / length;
// };

// 代价函数
// const J = (yVector: Matrix, xMatrix: Matrix, thetas: number[]) => {
//   const length = yVector.length;
//   let value = 0;
//   for (let i = 0; i < length; i++) {
//     const difference = Decimal.sub(
//       hypothesis(thetas, xMatrix[i]),
//       yVector[i][0]
//     ).toNumber();

//     value = Decimal.add(value, Decimal.pow(difference, 2)).toNumber();
//   }

//   return fixed3(value);
// };

// 求出每个theta的偏导数
const calculateFn = (
  yVector: Matrix,
  xMatrix: Matrix,
  thetas: Matrix,
  index: number
) => {
  const length = yVector.length;
  let value = 0;
  for (let i = 0; i < length; i++) {
    const difference = Decimal.sub(
      hypothesis(thetas, xMatrix[i]),
      yVector[i][0]
    ).toNumber();

    value = Decimal.add(
      value,
      Decimal.mul(difference, xMatrix[i][index])
    ).toNumber();
  }

  return Decimal.div(value, length).toNumber();
};

let isFinished = false

export const startIterate = (
  yVector: Matrix,
  xMatrix: Matrix,
  thetas: Matrix,
  rate: number,
  process?: (obj: {
    derivatives: number[];
    localThetas: Matrix;
    timestamp: number;
  }) => void
) =>
  new Promise<Matrix>((resolve, reject) => {
    isFinished = false
    let localThetas = thetas.map((item) => [...item]);
    let count = 0;
    const derivatives = Array.from({ length: thetas.length }, () => 1);
    const length = yVector.length;

    const action = () => {
      const nextThetas = [];
      for (let i = 0; i < thetas.length; i++) {
        if (fixed(derivatives[i], 8) === 0) {
          derivatives[i] = 0
          nextThetas[i] = localThetas[i];
        } else {
          derivatives[i] = calculateFn(yVector, xMatrix, localThetas, i);
          nextThetas[i] = [Decimal.sub(
            localThetas[i][0],
            Decimal.div(Decimal.mul(rate, derivatives[i]), length)
          ).toNumber()];
          if (derivatives[i] === 0) {
            count++;
          }
        }
      }
      localThetas = nextThetas;
      if (process) {
        process({
          derivatives,
          localThetas,
          timestamp: Date.now(),
        });
      }
      if (count === localThetas.length) {
        isFinished = true
        resolve(localThetas);
        return;
      }
      !isFinished ? requestAnimationFrame(action) : reject('终止迭代');
    };
    action();
  });

export const stopIterate = () => {
  isFinished = true
}

// console.log(yVector, xMatrix, thetas, .01)

// [-121.42889498, 10.07589772] 第一次渲染的结果
