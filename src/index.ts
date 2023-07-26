import * as readline from 'node:readline/promises'; // This uses the promise-based APIs
import { stdin as input, stdout as output } from 'node:process';
const rl = readline.createInterface({ input, output });

import GameService from './services/gameService.js';
import { OUTCOME, Outcome } from './utils/constants.js';

function print(gameId: string) {
  const g = GameService.getGameById(gameId)?.board.state;
  if (!g) throw new Error('game not found');
  for (const i of g) {
    console.log(i);
  }
}

async function main(): Promise<void> {
  const newGame = GameService.create({
    userIds: ['1', '2'],
  });
  let game = GameService.getGameById(newGame.gameId);
  if (!game) throw new Error('game not found');
  let currOutcome: Outcome = OUTCOME.READY;
  while (currOutcome === OUTCOME.READY || currOutcome === OUTCOME.PROGRESS) {
    print(game.id);
    console.log(`Next player: ${game.playingUsers[game.nextPlayerMoveIndex].name}`);
    const answer = await rl.question('What is your move? (x,y) ');
    const [x, y] = answer.split(',');
    const req = {
      gameId: game.id,
      userId: game.playingUsers[game.nextPlayerMoveIndex].id,
      x: parseInt(x),
      y: parseInt(y),
    };
    GameService.move(req);
    game = GameService.getGameById(game.id)!;
    currOutcome = game?.outcome ?? OUTCOME.READY;
  }

  console.log(`Game over! Outcome: ${game.winningPlayer?.name} ${currOutcome}`);
}
await main();
rl.close();
