import { Symbol } from '../../utils/constants.js';

export class Board {
  id: string;
  state: Array<Array<Symbol>>;
  size: number;

  //assuming that the board is square
  constructor(id: string, size: number, state: Array<Array<Symbol>>) {
    this.id = id;
    this.state = state;
    this.size = size;
  }
}
