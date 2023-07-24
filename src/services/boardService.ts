import { PlayingUser } from '@models/Actors/User';
import { Board } from '@models/Board/Board';
import { Move } from '@models/Board/Move';
import { OUTCOME, Outcome, SYMBOL, Symbol, UserSymbol } from '@utils/constants';
import * as BoardRepo from '@repo/Board/Board';
import { BadRequestError } from '@utils/error';
import { randomUUID } from 'crypto';

export function create(size: number): Board {
  const id = randomUUID(); //generate this from db; uuid
  const state = generateState(size);

  //BoardRepo.create(id, size, state);
  const board = new Board(id, size, state);
  return board;
}

function generateState(len: number): Array<Array<Symbol>> {
  return Array.from(Array(len), () => {
    return new Array(len).fill(SYMBOL.EMPTY);
  });
}

export function move(board: Board, playingUser: PlayingUser, x: number, y: number): Move {
  const move = new Move(playingUser, x, y);
  validateMoveCoordinates(board, move);
  validateMoveEligiblity(board, move);
  board = createUpdatedBoard(move, board);
  BoardRepo.save(board);
  return move;
}

type Won = typeof OUTCOME.WON;
type Draw = typeof OUTCOME.DRAW;

function validateMoveEligiblity(board: Board, move: Move) {
  if (board.state[move.location.x][move.location.y] !== SYMBOL.EMPTY) {
    throw new BadRequestError('Invalid move, space already taken');
  }
}

export function checkOutcome(board: Board): Won | Draw | null {
  return checkRows(board.state) || checkColumns(board.state) || checkDiagonals(board.state) || checkDraw(board.state) || null;
}

function checkRows(state: Board['state']): Won | null {
  for (let i = 0; i < state.length; i++) {
    const row = state[i];
    const isLine = checkLine(row);
    if (isLine) {
      return OUTCOME.WON;
    }
  }
  return null;
}

function checkLine(row: Array<Symbol>): boolean {
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

function checkColumns(state: Board['state']): Won | null {
  for (let i = 0; i < state.length; i++) {
    const column = state.map((row) => row[i]);
    const isLine = checkLine(column);
    if (isLine) {
      return OUTCOME.WON;
    }
  }
  return null;
}

function checkDiagonals(state: Board['state']): Won | null {
  const diagonal1 = state.map((row, i) => row[i]);
  const diagonal2 = state.map((row, i) => row[row.length - 1 - i]);
  const isLine1 = checkLine(diagonal1);
  const isLine2 = checkLine(diagonal2);
  if (isLine1 || isLine2) {
    return OUTCOME.WON;
  }
  return null;
}

function checkDraw(state: Board['state']): Draw | null {
  const isDraw = state.every((row) => row.every((symbol) => symbol !== SYMBOL.EMPTY));
  if (isDraw) {
    return OUTCOME.DRAW;
  }
  return null;
}

export function createUpdatedBoard(move: Move, board: Board): Board {
  //have the option of mutuating the board inplace or returning a new board
  //option 1 is mutation
  console.log(board.state);
  console.log(board.state[0]);
  console.log(board.state[0][0]);
  console.log('move.location.y:', move.location.y);
  console.log('move.location.x:', move.location.x);
  board.state[move.location.x][move.location.y] = move.user.assignedSymbol;
  console.log(board.state);
  console.log(board.state[0]);
  console.log(board.state[0][0]);
  return board;

  //option 2 is returning a new board, this shows the design pattern of eventual consistency for objects
  // const newBoard = structuredClone(this.state);
  // newBoard[move.location.x][move.location.y] = move.user.assignedSymbol;
  // return new Board(this.id, this.size, newBoard);
}

export function validateMoveCoordinates(board: Board, move: Move) {
  if (move.location.x < 0 || move.location.x > board.size - 1) {
    throw new BadRequestError(`Invalid x coordinate!`);
  }
  if (move.location.y < 0 || move.location.y > board.size - 1) {
    throw new BadRequestError(`Invalid y coordinate!`);
  }
}
