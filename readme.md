# Design Tic Tac Toe

## Requirements

### Functional requirements

1. Should show the current state of the game
2. Should be playable by 2 users
3. Should be able to play a valid move
4. Should be able to restart the game
5. Should be able to tell if the game is over and the winner
6. Should be able to undo the previous move by a user

7. Keep count of user wins -> can be optional

### Non functional requirements

1. Leaderboard
2. Comments
3. Analytics
4. User guide on next move / Game analysis
5. Multiple viewership?
6. Multiple players?

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
    nextPlayerMoveIndex: User
    OUTCOME
    Board
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
    PlayingUser,
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
npm i express dotenv typescript @tsconfig/node18 compression  body-parser cors module-alias
npm i -D typescript @types/express @types/node @types/compression @types/cors concurrently nodemon
npx tsc --init
```

## API CONTRACT

### METHOD ROUTE REQBODY RESBODY

```typescript
//get the current state of the game
GET /game/:id/ {
    userIds: Array<string>
    } {
    Game: {
        id: string;
        nextPlayerMoveIndex: number;
        outcome: Outcome;
        board: Board: {
            id: string;
            state: Array<Array<Symbol>>;
            size: number;
        };
        playingUsers: Array<PlayingUser>; //size 2
        moveHistory: Array<Move>;
        winningPlayer: null | PlayingUser;
    }
}

//create a new game
POST /game {
    userIds: Array<string>
} {
id: string
boardState: Array<Array<SYMBOL>>
Map<userId: AssignedSymbol>
}

//make a move
POST /game/:id/move {
userId: string,
moveType: MOVE_TYPE.ADD | MOVE_TYPE.UNDO
movePayload: {
    location: Coordinate
} | null
}{
boardState: Array<Array<SYMBOL>>
outcome: OUTCOME
}

//restart the game
PUT game/:id/restart {
    userId: string,
} {
    boardState: Array<Array<SYMBOL>>
    Map<userId: AssignedSymbol>
    outcome: OUTCOME
}

//undo the previous move by a paritcular user
POST /game/:id/undo {
    userId: string,
} {
    boardState: Array<Array<SYMBOL>>
    Map<userId: AssignedSymbol>
    outcome: OUTCOME
}

```
