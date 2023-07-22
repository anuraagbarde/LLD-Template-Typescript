import { AssertionError } from 'assert';

export const OUTCOME = {
  READY: 'READY',
  PROGRESS: 'PROGRESS',
  DRAW: 'DRAW',
  WON: 'WON',
} as const;

export const SYMBOL = {
  X: 'X1',
  O: 'O',
} as const;
type Symbol = (typeof SYMBOL)[keyof typeof SYMBOL];

type ObjVals<T> = T[keyof T];
type ObjKey<T> = keyof T;

export function assertIsConstVal<T extends Object>(val: any, CONSTANT: T): asserts val is ObjVals<T> {
  if (!Object.values(CONSTANT)?.includes(val)) {
    throw new AssertionError({ message: `Found ${val} , expected ${Object.values(CONSTANT)}` });
  }
}

export function assertIsConstKey<T extends Object>(val: any, CONSTANT: T): asserts val is ObjKey<T> {
  if (!Object.keys(CONSTANT)?.includes(val)) {
    throw new AssertionError({ message: `Found ${val} , expected ${Object.keys(CONSTANT)}` });
  }
}

const a: string = 'X';
const b = (x: Symbol) => {
  console.log(x);
};
assertIsConstVal(a, SYMBOL);

b(a);
b(SYMBOL.X);
