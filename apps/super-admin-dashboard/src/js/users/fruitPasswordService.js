import { fruitOptions } from "../shared/constants.js";

export function createRandomFruitPassword() {
  var values = [];

  while (values.length < 4) {
    values.push(fruitOptions[Math.floor(Math.random() * fruitOptions.length)]);
  }

  return values;
}

export async function resetFruitPassword(payload, context) {
  if (!context || typeof context.resetFruitPassword !== "function") {
    return {
      fruitPassword: createRandomFruitPassword(),
      delegated: false
    };
  }

  return context.resetFruitPassword(payload);
}
