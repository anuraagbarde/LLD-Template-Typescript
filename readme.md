The game is actually designed in this template. For a more abstract template you can use https://github.com/anuraagbarde/lld-typescript-template/tree/master

# Design Tic Tac Toe

## Requirements

Imagine how your product generate value?

### Functional requirements

1. Should show the current state of the game
2. Should be playable by 2 users
3. Should be able to play a valid move
4. Should be able to tell if the game is over and the winner or draw
5. Should be able to restart the game
6. Should be able to undo the previous move by a user
7. Online game
8. Leaderboard
9. -> freq of updation -> idempotency -> realtime(how much delay is acceptable) -> caching -> number of users ->
10. dont ask -> Locale/Languages/internationalization? Timezone? -> ask things which will infulence the db discussion this will turn in HLD

Ask if you want in-memory->mongo or relational-db-design

<!--
1. online game
2. Match making algorithm
3.  Keep count of user wins -> can be optional
4.  Comments
5.  Analytics
6.  User guide on next move / Game analysis
7.  Multiple viewership?
8.  Multiple players? -->

Optional?

### Non functional requirements

1. Caching
2. Single player

## Bottom up approach

### Actors involved

Players
Users

### Enitites involved

1. Game
2. Board
3. User -> name
4. Player -> attached to a game -> assigned a symbol
5. Move -> transcation

```typescript

Game {
    id
    nextPlayerMoveIndex: User
    Outcome/Status : WON | DRAW | IN_PROGRESS | READY
    board: Board
    Array<PlayingUser>
    history: Array<Move>
    winnerPlayer: null | PlayingUser
}

Board {
    // id is not required as it does not make sense to have it as an independent entity
    state: Array<Array<SYMBOL>>
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
npm i express dotenv typescript @tsconfig/node18 compression body-parser cors module-alias tstl
npm i -D typescript @types/express @types/node @types/compression @types/cors concurrently nodemon
npx tsc --init
```

## API CONTRACT

### METHOD ROUTE REQBODY RESBODY

```typescript
//get the current state of the game
GET /game/:id/ {
    // userIds: Array<string>
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
