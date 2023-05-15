import * as math from "mathjs";
import { Matrix } from "../data/data";

export const normalFunction = (yVector: Matrix, xMatrix: Matrix) => {
  const mathYM = math.matrix(yVector);
  const mathXM = math.matrix(xMatrix);
  const mathXM_T = math.transpose(mathXM);
  const mathXM_INV = math.inv(math.multiply(mathXM_T, mathXM))
  return math.multiply(math.multiply(mathXM_INV, mathXM_T), mathYM).valueOf()
};
