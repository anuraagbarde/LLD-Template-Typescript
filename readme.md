# Design Tic Tac Toe

## Functional requirements

1. Should show the current state of the game
2. Should be playable by 2 users
3. Should be able to play a valid move
4. Should be able to restart the game
5. Should be able to undo the previous move by a user
6. Should be able to tell if the game is over and the winner

## Non functional requirements

1. Keep count of user wins
2. Leaderboard
3. Comments
4. Analytics
5. User guide on next move / Game analysis
6. Multiple viewership?
7. Multiple players?

## Bottom up approach

### Enitites involved

1. Game
2. Board
3. User
4. Player
5. Move

```typescript

Game {
    id
    nextPlayerMove: userId
    outcome
    boardId
    Array<PlayingUser>
    Array<Move>
}

Board {
    id
    Array<Array<SYMBOL>>
    size
}

User {
    id
    name
}

PlayingUserMeta {
    assignedSymbol: SYMBOL
}

PlayingUser = User & PlayingUserMeta;

Move {
    userId implements playing,
    location: Coordinate,
}

//0th indexed
Coordinate {
    x
    y
}

```

```bash
npm init -y
npm i express dotenv typescript @tsconfig/node18 compression  body-parser cors
npm i -D typescript @types/express @types/node @types/compression @types/cors concurrently nodemon
npx tsc --init
```
