import Decimal from "decimal.js";
import {
  dataSet,
  DataSetTypeX,
  DataSetTypeY,
  DataSet,
  Matrix,
  yVector,
  xMatrix,
  thetas,
} from "../data/data";

export const fixed3 = (n: number | Decimal) =>
  new Decimal(new Decimal(n).toFixed(4)).toNumber();

export const hypothesis = (
  thetaItems: number[],
  xMatrixItems: number[]
): number => {
  let result = 0;
  for (let i = 0; i < thetaItems.length; i++) {
    result = Decimal.add(
      result,
      Decimal.mul(thetaItems[i], xMatrixItems[i])
    ).toNumber();
  }
  return fixed3(result);
};

const cost = (yVector: Matrix, xMatrix: Matrix, thetas: number[]) => {
  return J(yVector, xMatrix, thetas) / 2 / length;
};

const J = (yVector: Matrix, xMatrix: Matrix, thetas: number[]) => {
  const length = yVector.length;
  let value = 0;
  for (let i = 0; i < length; i++) {
    const difference = Decimal.sub(
      hypothesis(thetas, xMatrix[i]),
      yVector[i][0]
    ).toNumber();

    value = Decimal.add(value, Decimal.pow(difference, 2)).toNumber();
  }

  return fixed3(value);
};

const calculateFn = (
  yVector: Matrix,
  xMatrix: Matrix,
  thetas: number[],
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

  return fixed3(Decimal.div(value, length).toNumber());
};

export const debuggerParams = (
  yVector: Matrix,
  xMatrix: Matrix,
  thetas: number[],
  rate: number,
  process?: (obj: {
    derivatives: number[];
    localThetas: number[];
    timestamp: number;
  }) => void
) =>
  new Promise<number[]>((resolve) => {
    let localThetas = [...thetas];
    let count = 0;
    const derivatives = Array.from({ length: thetas.length }, () => 1);
    const length = yVector.length;

    const action = () => {
      const nextThetas = [];
      for (let i = 0; i < thetas.length; i++) {
        if (derivatives[i] === 0) {
          nextThetas[i] = localThetas[i];
        } else {
          derivatives[i] = calculateFn(yVector, xMatrix, localThetas, i);
          nextThetas[i] = Decimal.sub(
            localThetas[i],
            Decimal.div(Decimal.mul(rate, derivatives[i]), length)
          ).toNumber();
          if (derivatives[i] === 0) {
            count++;
          }
        }
      }
      localThetas = [...nextThetas];
      if (process) {
        process({
          derivatives,
          localThetas,
          timestamp: Date.now(),
        });
      }
      if (count === localThetas.length) {
        resolve(localThetas);
        return;
      }
      requestAnimationFrame(action);
      // console.log(derivatives);
    };
    action();
  });

// console.log(yVector, xMatrix, thetas, .01)

// [-121.42889498, 10.07589772] 第一次渲染的结果
