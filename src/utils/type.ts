import { AssertionError } from 'assert';

export type ObjVals<T> = T[keyof T];
export type ObjKey<T> = keyof T;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function assertIsConstVal<T extends Object>(CONSTANT: T, val: any): asserts val is ObjVals<T> {
  if (!Object.values(CONSTANT)?.includes(val)) {
    throw new AssertionError({ message: `Found ${val} , expected ${Object.values(CONSTANT)}` });
  }
}

export function assertIsConstKey<T extends Object>(CONSTANT: T, val: any): asserts val is ObjKey<T> {
  if (!Object.keys(CONSTANT)?.includes(val)) {
    throw new AssertionError({ message: `Found ${val} , expected ${Object.keys(CONSTANT)}` });
  }
}
