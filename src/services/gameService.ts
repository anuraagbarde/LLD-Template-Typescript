import { PlayingUser } from '../models/Actors/User.js';
import { Game } from '../models/Game.js';
import { OUTCOME, Outcome, USER_SYMBOL, UserSymbol, Symbol } from '../utils//constants.js';
import BoardService from '../services/boardService.js';
import * as GameRepo from '../repo/Game.js';
import { BadRequestError } from '../utils//error.js';

const BOARD_SIZE = 3;

type createResponse = {
  gameId: string;
  boardState: Array<Array<Symbol>>;
  userIdVsAssignedSymbol: Record<string, UserSymbol>;
};

type moveParams = { gameId: string; userId: string; x: number; y: number };

class GameService {
  create(input: { userIds: Array<string> }): createResponse {
    const playingUsers = this.#generatePlayingUsers(input.userIds);
    //GameRepo.create()
    const newGame = new Game({
      id: '1', // randomUUID(),
      playingUsers: playingUsers,
      board: BoardService.create(BOARD_SIZE),
      nextPlayerMoveIndex: this.#getRandomPlayerIndex(playingUsers),
      outcome: OUTCOME.READY,
      moveHistory: [],
      winningPlayer: null,
    });

    GameRepo.save(newGame);

    return {
      gameId: newGame.id,
      boardState: newGame.board.state,
      userIdVsAssignedSymbol: this.#generateUserIdVsAssignedSymbol(playingUsers),
    };
  }

  getAllGames(): Array<Game> {
    return GameRepo.getAll();
  }

  getGameById(id: string): Game | undefined {
    return GameRepo.get(id);
  }

  move({ gameId, userId, x, y }: moveParams): Outcome {
    const currGame = this.#getAndValidateGameMove(gameId, userId);

    const move = BoardService.move(currGame.board, currGame.playingUsers[currGame.nextPlayerMoveIndex], x, y);

    currGame.moveHistory.push(move);

    currGame.nextPlayerMoveIndex = (currGame.nextPlayerMoveIndex + 1) % currGame.playingUsers.length;

    currGame.outcome = BoardService.checkOutcome(currGame.board) ?? OUTCOME.PROGRESS;

    if (currGame.outcome === OUTCOME.WON) {
      //winningPlayer.id should go rather than the whole object
      currGame.winningPlayer = currGame.playingUsers[currGame.nextPlayerMoveIndex];
    }

    GameRepo.save(currGame);

    return currGame.outcome;
  }

  #getAndValidateGameMove(gameId: string, userId: string) {
    const currGame = GameRepo.get(gameId);
    if (!currGame) throw new BadRequestError('Game not found!');

    if (!(currGame.outcome === OUTCOME.READY || currGame.outcome === OUTCOME.PROGRESS))
      throw new BadRequestError(`Game already in ${currGame.outcome} status!`);

    if (currGame.nextPlayerMoveIndex !== currGame.playingUsers.findIndex((user) => user.id === userId)) {
      throw new BadRequestError('Not your turn!');
    }
    return currGame;
  }

  #generateUserIdVsAssignedSymbol(playingUsers: Array<PlayingUser>): Record<string, UserSymbol> {
    return playingUsers.reduce((acc, curr) => {
      acc[curr.id] = curr.assignedSymbol;
      return acc;
    }, {} as Record<string, UserSymbol>);
  }

  #generatePlayingUsers(userIds: Array<string>): Array<PlayingUser> {
    return [
      new PlayingUser(userIds[0], 'genericUserName1', USER_SYMBOL.X),
      new PlayingUser(userIds[1], 'genericUserName2', USER_SYMBOL.O),
    ];
  }

  #getRandomPlayerIndex(playingUsers: Array<PlayingUser>): number {
    return Math.floor(Math.random() * playingUsers.length);
  }
}
export default new GameService();
