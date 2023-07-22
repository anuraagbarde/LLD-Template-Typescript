import { SYMBOL, Symbol, USER_SYMBOL } from '../../utils/constants';
import { Move } from './Move';

export class Board {
  id: string;
  state: Array<Array<Symbol>>;
  size: number;

  //assuming that the board is square
  constructor(size: number) {
    this.id = '65'; //generate this from db;
    this.size = size;
    this.state = this.generateState(size);
  }

  generateState(len: number): Array<Array<Symbol>> {
    return new Array(len).fill(new Array(len).fill(SYMBOL.EMPTY));
  }

  updateBoard(move: Move) {
    this.state[move.location.x][move.location.y] = move.user.assignedSymbol;
  }
}
