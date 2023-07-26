import { Game } from '../models/Game.js';
import * as BoardRepo from '../repo/Board/Board.js';
import { PartialBy } from '../utils//type.js';
import { randomUUID } from 'crypto';
interface boardId {
  boardId: string;
}
type GAME = Omit<Game, 'Board'> & boardId;

const GAME_TABLE = new Map<string, GAME>();

export const save = (game: Game) => {
  if (!game.id) {
    game.id = randomUUID();
  }
  const updatedBoard = BoardRepo.save(game.board);
  GAME_TABLE.set(game.id, { ...game, boardId: updatedBoard.id });
};

export const get = (id: string): Game | undefined => {
  const game = GAME_TABLE.get(id);
  if (!game) return undefined;
  const board = BoardRepo.get(game.boardId);
  if (!board) return undefined;
  const a: PartialBy<GAME, 'boardId'> = { ...game };
  delete a.boardId;
  const populatedGame = { ...game, board: board };
  return populatedGame;
};

export const getAll = (): Array<Game> => {
  const res: Array<Game> = [];
  GAME_TABLE.forEach((unpopulatedGame, gameId) => {
    const populatedGame = get(gameId);
    if (populatedGame) {
      res.push(populatedGame);
    }
  });
  return res;
};
