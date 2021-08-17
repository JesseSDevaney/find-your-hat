import promptSync from "prompt-sync";
import Field from "./modules/field.mjs";
const prompt = promptSync({ sigint: true });

const myField = new Field([
  ["*", "░", "O"],
  ["░", "O", "░"],
  ["░", "^", "░"],
]);

console.log("Let's Play! Press (Ctrl + C) to exit the game at any time.");

while (!myField.isGameOver) {
  myField.print();
  const userInput = prompt(
    "What is your move ([u]p, [d]own, [l]eft, [r]ight): "
  );
  myField.movePlayer(userInput);
}
