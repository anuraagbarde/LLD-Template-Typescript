import { PlayingUser } from '../Actors/User.js';

export class Move {
  user: PlayingUser;
  location: Coordinate;

  constructor(user: PlayingUser, x: number, y: number) {
    this.user = user;
    this.location = new Coordinate(x, y);
  }
}

export class Coordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
