import { PlayingUser } from './Actors/User.js';
import { OUTCOME, Outcome } from '../utils/constants.js';
import { Board } from './Board/Board.js';
import { Coordinate, Move } from './Board/Move.js';

export class Game {
  id: string;
  nextPlayerMoveIndex: number;
  outcome: Outcome;
  board: Board;
  playingUsers: Array<PlayingUser>; //size 2
  moveHistory: Array<Move>;
  winningPlayer: null | PlayingUser;

  constructor({ id, playingUsers, board, nextPlayerMoveIndex, outcome, moveHistory, winningPlayer }: Game) {
    this.id = id;
    this.playingUsers = playingUsers;
    this.board = board;
    this.nextPlayerMoveIndex = nextPlayerMoveIndex;
    this.outcome = outcome;
    this.moveHistory = moveHistory;
    this.winningPlayer = winningPlayer;
  }

  // constructor(players: Array<PlayingUser>, BoardSize: number) {
  //   this.playingUsers = players;
  //   this.id = '55'; //should generate from db
  //   this.nextPlayerMoveIndex = this.getRandomPlayerIndex(this.playingUsers); // I think it is better to pass in explicty rather than guess what side effects this.getRandomPlayer will have
  //   this.outcome = OUTCOME.READY;
  //   this.moveHistory = [];
  //   this.board = Board.create(BoardSize);
  // }

  // playMove(player: PlayingUser, x: number, y: number) {
  //   const move = new Move(player, x, y);
  //   this.validateMove(move);
  //   this.moveHistory.push(move); //side effect
  //   this.board = this.board.createUpdatedBoard(move); //side effect
  //   //check and update outcome
  // }

  // validateMove(move: Move) {
  //   if (move.location.x < 0 || move.location.y >= this.board.size) {
  //     throw new Error(`Invalid x coordinate)`);
  //   }
  //   if (move.location.y < 0 || move.location.y >= this.board.size) {
  //     throw new Error(`Invalid y coordinate)`);
  //   }
  //   if (this.playingUsers[this.nextPlayerMoveIndex]?.id !== move.user.id) {
  //     throw new Error(`Player ${move.user.name} is not allowed to move currently`);
  //   }
  // }

  // getBoard() {
  //   return this.board.state;
  // }
}
