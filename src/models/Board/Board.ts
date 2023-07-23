import { SYMBOL, Symbol, USER_SYMBOL } from '../../utils/constants';
import { Move } from './Move';
import { randomUUID } from 'crypto';
class BadrequestError extends Error {}
export class Board {
  id: string;
  state: Array<Array<Symbol>>;
  size: number;

  //assuming that the board is square
  private constructor(id: string, size: number, state: Array<Array<Symbol>>) {
    this.id = id;
    this.state = state;
    this.size = size;
  }

  static create(size: number) {
    const id = randomUUID(); //generate this from db; uuid
    const state = Board.generateState(size);
    const board = new Board(id, size, state);
  }

  static generateState(len: number): Array<Array<Symbol>> {
    return new Array(len).fill(new Array(len).fill(SYMBOL.EMPTY));
  }

  createUpdatedBoard(move: Move): Board {
    //have the option of mutuating the board inplace or returning a new board
    //option 1 is mutation
    this.state[move.location.x][move.location.y] = move.user.assignedSymbol;
    return this;

    //option 2 is returning a new board
    // const newBoard = structuredClone(this.state);
    // newBoard[move.location.x][move.location.y] = move.user.assignedSymbol;
    // return new Board(this.id, this.size, newBoard);
  }

  validateMoveCoordinates(move: Move) {
    if (move.location.x < 0 || move.location.y >= this.size) {
      throw new BadrequestError(`Invalid x coordinate)`);
    }
    if (move.location.y < 0 || move.location.y >= this.size) {
      throw new BadrequestError(`Invalid y coordinate)`);
    }
  }
}
