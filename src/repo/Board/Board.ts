import { Board } from '@models/Board/Board';
import { randomUUID } from 'crypto';

const BOARD_TABLE = new Map<string, Board>();

export function save(board: Board) {
  if (!board.id) {
    board.id = randomUUID();
  }
  BOARD_TABLE.set(board.id, board);
  return board;
}

export function get(id: string): Board | undefined {
  return BOARD_TABLE.get(id);
}
