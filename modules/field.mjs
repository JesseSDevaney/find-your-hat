const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

const printHorizontalRule = (length) => {
  return "-".repeat(length);
};

class Field {
  constructor(field) {
    this._field = field;
  }

  get field() {
    return this._field;
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
}

export default Field;
