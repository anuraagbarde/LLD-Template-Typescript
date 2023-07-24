import { PlayingUser } from '@models/Actors/User';
import { Game } from '@models/Game';
import { OUTCOME, Outcome, USER_SYMBOL, UserSymbol, Symbol } from '@utils/constants';
import { randomUUID } from 'crypto';
import * as BoardService from '@services/boardService';
import * as GameRepo from '@repo/Game';
import { BadRequestError } from '@utils/error';

const BOARD_SIZE = 3;

type createResponse = {
  gameId: string;
  boardState: Array<Array<Symbol>>;
  userIdVsAssignedSymbol: Record<string, UserSymbol>;
};

export function create(input: { userIds: Array<string> }): createResponse {
  const playingUsers = generatePlayingUsers(input.userIds);
  //GameRepo.create()
  const newGame = new Game({
    id: '1', // randomUUID(),
    playingUsers: playingUsers,
    board: BoardService.create(BOARD_SIZE),
    nextPlayerMoveIndex: getRandomPlayerIndex(playingUsers),
    outcome: OUTCOME.READY,
    moveHistory: [],
    winningPlayer: null,
  });

  GameRepo.save(newGame);

  return {
    gameId: newGame.id,
    boardState: newGame.board.state,
    userIdVsAssignedSymbol: generateUserIdVsAssignedSymbol(playingUsers),
  };
}

export function getAllGames(): Array<Game> {
  return GameRepo.getAll();
}

export function getGameById(id: string): Game | undefined {
  return GameRepo.get(id);
}

type moveParams = { gameId: string; userId: string; x: number; y: number };

export function move({ gameId, userId, x, y }: moveParams): Outcome {
  const currGame = getAndValidateGameMove(gameId, userId);

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

function getAndValidateGameMove(gameId: string, userId: string) {
  const currGame = GameRepo.get(gameId);
  if (!currGame) throw new BadRequestError('Game not found!');

  if (!(currGame.outcome === OUTCOME.READY || currGame.outcome === OUTCOME.PROGRESS))
    throw new BadRequestError(`Game already in ${currGame.outcome} status!`);

  if (currGame.nextPlayerMoveIndex !== currGame.playingUsers.findIndex((user) => user.id === userId)) {
    throw new BadRequestError('Not your turn!');
  }
  return currGame;
}

function generateUserIdVsAssignedSymbol(playingUsers: Array<PlayingUser>): Record<string, UserSymbol> {
  return playingUsers.reduce((acc, curr) => {
    acc[curr.id] = curr.assignedSymbol;
    return acc;
  }, {} as Record<string, UserSymbol>);
}

function generatePlayingUsers(userIds: Array<string>): Array<PlayingUser> {
  return [
    new PlayingUser(userIds[0], 'genericUserName1', USER_SYMBOL.X),
    new PlayingUser(userIds[1], 'genericUserName2', USER_SYMBOL.O),
  ];
}

function getRandomPlayerIndex(playingUsers: Array<PlayingUser>): number {
  return Math.floor(Math.random() * playingUsers.length);
}
