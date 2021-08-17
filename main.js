import promptSync from "prompt-sync";
import Field from "./modules/field.mjs";
const prompt = promptSync({ sigint: true });

const myField = new Field([
  ["*", "░", "O"],
  ["░", "O", "░"],
  ["░", "^", "░"],
]);

myField.print();
