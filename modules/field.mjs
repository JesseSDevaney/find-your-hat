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
    this._currentPosition = [0, 0]; // [x, y]
    this._isGameOver = false;
  }

  get currentPosition() {
    return this._currentPosition;
  }

  get field() {
    return this._field;
  }

  get isGameOver() {
    return this._isGameOver;
  }

  endGame() {
    this._isGameOver = true;
  }

  moveDown() {
    this._currentPosition[1] += 1;
  }
  moveLeft() {
    this._currentPosition[0] -= 1;
  }
  moveRight() {
    this._currentPosition[0] += 1;
  }
  moveUp() {
    this._currentPosition[1] -= 1;
  }

  movePlayer(input) {
    const move = this.parseMove(input);
    if (!move) {
      console.log(
        "*".repeat(55) +
          `\n${input} is not a valid choice. Choose one of [u, d, l, r].\n` +
          "*".repeat(55) +
          "\n"
      );
      return;
    }

    if (move === "u") this.moveUp();
    else if (move === "d") this.moveDown();
    else if (move === "l") this.moveLeft();
    else if (move === "r") this.moveRight();

    this.updateField();
  }

  print() {
    const field = this.field;
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

  updateField() {
    const [playerX, playerY] = this.currentPosition;
    const numRows = this._field.length;
    const numCols = this._field[0].length;
    if (
      playerY >= numRows ||
      playerY < 0 ||
      playerX >= numCols ||
      playerX < 0
    ) {
      console.log("Player has abandoned the search. Try again next time.");
      this.endGame();
      return;
    }

    const currentCell = this._field[playerY][playerX];
    if (currentCell === FIELD_CHARACTER) {
      this._field[playerY][playerX] = PATH_CHARACTER;
    } else if (currentCell === HAT) {
      this._field[playerY][playerX] = PATH_CHARACTER;
      this.print();
      console.log("Player has found their hat and won the game!");
      this.endGame();
    } else if (currentCell === HOLE) {
      this.print();
      console.log("Player has fallen into a hole :(. Try again next time.");
      this.endGame();
    } else {
      console.log(
        "You are visiting a space you have already seen. I hope you remember where you are"
      );
    }
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
