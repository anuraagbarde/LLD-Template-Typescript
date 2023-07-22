import { SYMBOL } from '../../utils/constants';
class User {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

class PlayingUserMeta {
  assignedSymbol: keyof typeof SYMBOL;

  constructor(assignedSymbol: keyof typeof SYMBOL) {
    this.assignedSymbol = assignedSymbol;
  }
}

type PlayingUserInterface = User & PlayingUserMeta;

class PlayingUser implements PlayingUserInterface {
  id: number;
  name: string;
  assignedSymbol: keyof typeof SYMBOL;

  constructor(id: number, name: string, assignedSymbol: keyof typeof SYMBOL) {
    this.id = id;
    this.name = name;
    this.assignedSymbol = assignedSymbol;
  }
}
