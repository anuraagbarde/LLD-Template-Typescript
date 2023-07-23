import { PlayingUser } from '@models/Actors/User';
import { OUTCOME, Outcome } from '@utils/constants';
import { Board } from '@models/Board/Board';
import { Coordinate, Move } from '@models/Board/Move';

class Game {
  id: string;
  nextPlayerMoveIndex: number; //or just PlayingUser.Id?
  outcome: Outcome;
  board: Board;
  playingUsers: Array<PlayingUser>;
  moveHistory: Array<Move>;

  constructor(players: Array<PlayingUser>, BoardSize: number) {
    this.playingUsers = players;
    this.id = '55'; //should generate from db
    this.nextPlayerMoveIndex = this.getRandomPlayerIndex(this.playingUsers); // I think it is better to pass in explicty rather than guess what side effects this.getRandomPlayer will have
    this.outcome = OUTCOME.READY;
    this.moveHistory = [];
    this.board = new Board(BoardSize);
  }

  getRandomPlayerIndex(playingUsers: Array<PlayingUser>): number {
    //using this pointer here feels wrong, since we are using global state, inside the class,
    // I think better would be this.getRandomPlayer(this.playingUsers);
    // This will make it pure
    return Math.floor(Math.random() * playingUsers.length);
  }

  playMove(player: PlayingUser, x: number, y: number) {
    const move = new Move(player, x, y);
    this.validateMove(move);
    this.moveHistory.push(move); //side effect
    this.board.updateBoard(move); //side effect
    //check and update outcome
  }

  validateMove(move: Move) {
    if (move.location.x < 0 || move.location.y >= this.board.size) {
      throw new Error(`Invalid x coordinate)`);
    }
    if (move.location.y < 0 || move.location.y >= this.board.size) {
      throw new Error(`Invalid y coordinate)`);
    }
    if (this.playingUsers[this.nextPlayerMoveIndex]?.id !== move.user.id) {
      throw new Error(`Player ${move.user.name} is not allowed to move currently`);
    }
  }

  getBoard() {
    return this.board.state;
  }
}
