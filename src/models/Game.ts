import { PlayingUser } from '@models/Actors/User';
import { OUTCOME, Outcome } from '@utils/constants';
import { Board } from '@models/Board/Board';
import { Coordinate, Move } from '@models/Board/Move';

class Game {
  id: string;
  nextPlayerMove: PlayingUser | null; //or just PlayingUser.Id?
  outcome: Outcome;
  board: Board;
  playingUsers: Array<PlayingUser>;
  moveHistory: Array<Move>;

  constructor(players: Array<PlayingUser>, BoardSize: number) {
    this.playingUsers = players;
    this.id = '55'; //should generate from db
    this.nextPlayerMove = this.getRandomPlayer(this.playingUsers); // I think it is better to pass in explicty rather than guess what side effects this.getRandomPlayer will have
    this.outcome = OUTCOME.READY;
    this.moveHistory = [];
    this.board = new Board(BoardSize);
  }

  getRandomPlayer(playingUsers: Array<PlayingUser>): PlayingUser {
    //using this pointer here feels wrong, since we are using global state, inside the class,
    // I think better would be this.getRandomPlayer(this.playingUsers);
    // This will make it pure
    return playingUsers[Math.floor(Math.random() * playingUsers.length)];
  }

  playMove(player: PlayingUser, x: number, y: number) {
    const move = new Move(player, x, y);
    this.moveHistory.push(move); //side effect
    this.board.updateBoard(move); //side effect
  }
}
