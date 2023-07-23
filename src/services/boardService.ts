import { Board } from '@models/Board/Board';
import { Move } from '@models/Board/Move';
import { SYMBOL, Symbol, UserSymbol } from '@utils/constants';
import { randomUUID } from 'crypto';
class BadrequestError extends Error {}

export function create(size: number): Board {
  const id = randomUUID(); //generate this from db; uuid
  const state = generateState(size);
  const board = new Board(id, size, state);
  return board;
}

function generateState(len: number): Array<Array<Symbol>> {
  return new Array(len).fill(new Array(len).fill(SYMBOL.EMPTY));
}

export function createUpdatedBoard(move: Move, board: Board): Board {
  //have the option of mutuating the board inplace or returning a new board
  //option 1 is mutation
  board.state[move.location.x][move.location.y] = move.user.assignedSymbol;
  return board;

  //option 2 is returning a new board, this shows the design pattern of eventual consistency for objects
  // const newBoard = structuredClone(this.state);
  // newBoard[move.location.x][move.location.y] = move.user.assignedSymbol;
  // return new Board(this.id, this.size, newBoard);
}

export function validateMoveCoordinates(move: Move, board: Board) {
  if (move.location.x < 0 || move.location.y >= board.size) {
    throw new BadrequestError(`Invalid x coordinate)`);
  }
  if (move.location.y < 0 || move.location.y >= board.size) {
    throw new BadrequestError(`Invalid y coordinate)`);
  }
}
