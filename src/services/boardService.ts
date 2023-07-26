import { PlayingUser } from '../models/Actors/User.js';
import { Board } from '../models/Board/Board.js';
import { Move } from '../models/Board/Move.js';
import { OUTCOME, SYMBOL, Symbol } from '../utils/constants.js';
import * as BoardRepo from '../repo/Board/Board.js';
import { BadRequestError } from '../utils/error.js';
import { randomUUID } from 'crypto';

type Won = typeof OUTCOME.WON;
type Draw = typeof OUTCOME.DRAW;

class BoardService {
  create(size: number): Board {
    const id = randomUUID(); //generate this from db; uuid
    const state = this.#generateState(size);

    //BoardRepo.create(id, size, state);
    const board = new Board(id, size, state);
    return board;
  }

  #generateState(len: number): Array<Array<Symbol>> {
    return Array.from(Array(len), () => {
      return new Array(len).fill(SYMBOL.EMPTY);
    });
  }
  #validateMoveCoordinates(board: Board, move: Move) {
    if (move.location.x < 0 || move.location.x > board.size - 1) {
      throw new BadRequestError(`Invalid x coordinate!`);
    }
    if (move.location.y < 0 || move.location.y > board.size - 1) {
      throw new BadRequestError(`Invalid y coordinate!`);
    }
  }

  #validateMoveEligiblity(board: Board, move: Move) {
    if (board.state[move.location.x][move.location.y] !== SYMBOL.EMPTY) {
      throw new BadRequestError('Invalid move, space already taken');
    }
  }

  createUpdatedBoard(move: Move, board: Board): Board {
    //have the option of mutuating the board inplace or returning a new board
    //option 1 is mutation
    board.state[move.location.x][move.location.y] = move.user.assignedSymbol;
    return board;

    //option 2 is returning a new board, this shows the design pattern of eventual consistency for objects
    // const newBoard = structuredClone(this.state);
    // newBoard[move.location.x][move.location.y] = move.user.assignedSymbol;
    // return new Board(this.id, this.size, newBoard);
  }

  move(board: Board, playingUser: PlayingUser, x: number, y: number): Move {
    const move = new Move(playingUser, x, y);
    this.#validateMoveCoordinates(board, move);
    this.#validateMoveEligiblity(board, move);
    board = this.createUpdatedBoard(move, board);
    BoardRepo.save(board);
    return move;
  }

  checkOutcome(board: Board): Won | Draw | null {
    return (
      this.#checkRows(board.state) ||
      this.#checkColumns(board.state) ||
      this.#checkDiagonals(board.state) ||
      this.#checkDraw(board.state) ||
      null
    );
  }

  #checkRows(state: Board['state']): Won | null {
    for (let i = 0; i < state.length; i++) {
      const row = state[i];
      const isLine = this.#checkLine(row);
      if (isLine) {
        return OUTCOME.WON;
      }
    }
    return null;
  }

  #checkLine(row: Array<Symbol>): boolean {
    const firstSymbol = row[0];
    if (firstSymbol === SYMBOL.EMPTY) {
      return false;
    }
    for (let i = 1; i < row.length; i++) {
      if (row[i] !== firstSymbol) {
        return false;
      }
    }
    return true;
  }

  #checkColumns(state: Board['state']): Won | null {
    for (let i = 0; i < state.length; i++) {
      const column = state.map((row) => row[i]);
      const isLine = this.#checkLine(column);
      if (isLine) {
        return OUTCOME.WON;
      }
    }
    return null;
  }

  #checkDiagonals(state: Board['state']): Won | null {
    const diagonal1 = state.map((row, i) => row[i]);
    const diagonal2 = state.map((row, i) => row[row.length - 1 - i]);
    const isLine1 = this.#checkLine(diagonal1);
    const isLine2 = this.#checkLine(diagonal2);
    if (isLine1 || isLine2) {
      return OUTCOME.WON;
    }
    return null;
  }

  #checkDraw(state: Board['state']): Draw | null {
    const isDraw = state.every((row) => row.every((symbol) => symbol !== SYMBOL.EMPTY));
    if (isDraw) {
      return OUTCOME.DRAW;
    }
    return null;
  }
}

export default new BoardService();
