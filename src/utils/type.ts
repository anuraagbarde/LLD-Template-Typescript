import { AssertionError } from 'assert';

export type ObjVals<T> = T[keyof T];
export type ObjKey<T> = keyof T;

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
