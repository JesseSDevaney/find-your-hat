import promptSync from "prompt-sync";
const prompt = promptSync({ sigint: true });

const HAT = "^";
const HOLE = "O";
const FIELD_CHARACTER = "░";
const PATH_CHARACTER = "*";

const printHorizontalRule = (length) => {
  return "-".repeat(length);
};

class Field {
  constructor(field) {
    this._field = field;
    this._playerX = 0;
    this._playerY = 0;
  }

  get playerCell() {
    if (this.inBounds()) {
      return this._field[this._playerY][this._playerX];
    }
  }

  isFieldCharacter() {
    return this.playerCell === FIELD_CHARACTER;
  }

  isGameOver() {
    if (!this.inBounds()) {
      console.log("Player has abandoned the search. Try again next time.");
      return true;
    }

    if (this.isHat()) {
      this.updatePath();
      this.print();
      console.log("Player has found their hat and won the game!");
      return true;
    }

    if (this.isHole()) {
      this.print();
      console.log("Player has fallen into a hole :(. Try again next time.");
      return true;
    }

    if (this.isFieldCharacter()) {
      this.updatePath();
    }

    console.log(
      "You are visiting a space you have already seen. I hope you remember where you are"
    );
    return false;
  }

  isHat() {
    return this.playerCell === HAT;
  }

  isHole() {
    return this.playerCell === HOLE;
  }

  inBounds() {
    const playerX = this._playerX;
    const playerY = this._playerY;
    const height = this._field.length;
    const width = this._field[0].length;

    return playerY < height && playerY >= 0 && playerX < width && playerX >= 0;
  }

  movePlayer() {
    let move;
    do {
      const userInput = prompt(
        "What is your move ([u]p, [d]own, [l]eft, [r]ight): "
      );
      move = this.parseMove(userInput);

      if (!move) {
        this.printInvalidMove();
      }
    } while (!move);

    if (move === "u") this._playerY -= 1;
    else if (move === "d") this._playerY += 1;
    else if (move === "l") this._playerX -= 1;
    else if (move === "r") this._playerX += 1;
  }

  parseMove(input) {
    let move;

    switch (input) {
      case "l":
      case "left":
        move = "l";
        break;
      case "r":
      case "right":
        move = "r";
        break;
      case "u":
      case "up":
        move = "u";
        break;
      case "d":
      case "down":
        move = "d";
        break;
    }

    return move;
  }

  playGame() {
    console.log("Let's Play! Press (Ctrl + C) to exit the game at any time!");

    let playing = true;
    while (playing) {
      this.print();
      this.movePlayer();

      playing = !this.isGameOver();
    }
  }

  print() {
    const field = this._field;
    let fieldPicture = "";

    field.forEach((row, i, rowsArr) => {
      if (i !== 0) fieldPicture += "\n";
      fieldPicture += printHorizontalRule(2 * row.length + 1) + "\n";

      row.forEach((cell, j, cellsArr) => {
        fieldPicture += "|" + cell;
        if (j === cellsArr.length - 1) fieldPicture += "|";
      });

      if (i === rowsArr.length - 1) {
        fieldPicture += "\n" + printHorizontalRule(2 * row.length + 1);
      }
    });

    console.log(fieldPicture);
  }

  printInvalidMove() {
    console.log(
      "*".repeat(55) +
        `\nThat is not a valid choice. Choose one of [u, d, l, r].\n` +
        "*".repeat(55) +
        "\n"
    );
  }

  updatePath() {
    this._field[this._playerY][this._playerX] = PATH_CHARACTER;
  }

  static generateField(height = 4, width = 4, percentageAsHoles = 40) {
    if (height <= 0) height = 1;
    if (width <= 0) width = 1;
    if (height === 1 && width === 1) {
      return [[PATH_CHARACTER]];
    }

    const field = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push(FIELD_CHARACTER);
      }
      field.push(row);
    }

    field[0][0] = PATH_CHARACTER;

    for (;;) {
      const hatX = Math.floor(Math.random() * width);
      const hatY = Math.floor(Math.random() * height);
      if ((hatX !== 0) | (hatY !== 0)) {
        field[hatY][hatX] = HAT;
        break;
      }
    }

    let numHoles = Math.ceil((height * width - 2) * (percentageAsHoles / 100));
    if (numHoles > height * width - 2) numHoles = height * width - 2;
    else if (numHoles < 0) numHoles = 0;

    while (numHoles > 0) {
      const randHoleX = Math.floor(Math.random() * width);
      const randHoleY = Math.floor(Math.random() * height);
      if (field[randHoleY][randHoleX] === FIELD_CHARACTER) {
        field[randHoleY][randHoleX] = HOLE;
        numHoles--;
      }
    }

    return field;
  }
}

export default Field;
