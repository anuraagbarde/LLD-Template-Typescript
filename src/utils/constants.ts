import { ObjVals } from './type';

export const OUTCOME = {
  READY: 'READY',
  PROGRESS: 'PROGRESS',
  DRAW: 'DRAW',
  WON: 'WON',
} as const;
export type Outcome = ObjVals<typeof OUTCOME>;

export const USER_SYMBOL = {
  X: 'X',
  O: 'O',
} as const;
export type UserSymbol = ObjVals<typeof USER_SYMBOL>;

export const SYMBOL = {
  ...USER_SYMBOL,
  EMPTY: '_',
} as const;
export type Symbol = ObjVals<typeof SYMBOL>;
