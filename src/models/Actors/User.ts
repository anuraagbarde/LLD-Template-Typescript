import { UserSymbol } from '../../utils/constants';
class User {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

class PlayingUserMeta {
  assignedSymbol: UserSymbol;

  constructor(assignedSymbol: UserSymbol) {
    this.assignedSymbol = assignedSymbol;
  }
}

type PlayingUserInterface = User & PlayingUserMeta;

export class PlayingUser implements PlayingUserInterface {
  id: string;
  name: string;
  assignedSymbol: UserSymbol;

  constructor(id: string, name: string, assignedSymbol: UserSymbol) {
    this.id = id;
    this.name = name;
    this.assignedSymbol = assignedSymbol;
  }
}
