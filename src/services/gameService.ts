import { PlayingUser } from '@models/Actors/User';
import { Game } from '@models/Game';
import { OUTCOME, Outcome, USER_SYMBOL, UserSymbol, Symbol } from '@utils/constants';
import { randomUUID } from 'crypto';
import * as BoardService from '@services/boardService';

const BOARD_SIZE = 3;

interface createResponse {
  id: string;
  boardState: Array<Array<Symbol>>;
  userIdVsAssignedSymbol: Record<string, UserSymbol>;
}

export function create(input: { userIds: Array<string> }): createResponse {
  const playingUsers = generatePlayingUsers(input.userIds);
  const newGame = new Game({
    id: randomUUID(),
    playingUsers: playingUsers,
    board: BoardService.create(BOARD_SIZE),
    nextPlayerMoveIndex: getRandomPlayerIndex(playingUsers),
    outcome: OUTCOME.READY,
    moveHistory: [],
    winningPlayer: null,
  });

  //GameRepository.save(newGame);

  return {
    id: newGame.id,
    boardState: newGame.board.state,
    userIdVsAssignedSymbol: generateUserIdVsAssignedSymbol(playingUsers),
  };
}

function generateUserIdVsAssignedSymbol(playingUsers: Array<PlayingUser>): Record<string, UserSymbol> {
  return playingUsers.reduce((acc, curr) => {
    acc[curr.id] = curr.assignedSymbol;
    return acc;
  }, {} as Record<string, UserSymbol>);
}

function generatePlayingUsers(userIds: Array<string>): Array<PlayingUser> {
  return [
    new PlayingUser(randomUUID(), 'genericUserName1', USER_SYMBOL.X),
    new PlayingUser(randomUUID(), 'genericUserName2', USER_SYMBOL.O),
  ];
}

function getRandomPlayerIndex(playingUsers: Array<PlayingUser>): number {
  return Math.floor(Math.random() * playingUsers.length);
}
