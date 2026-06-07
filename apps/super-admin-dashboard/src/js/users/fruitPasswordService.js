import { fruitOptions } from "../../../../../packages/shared/constants/admin.js?v=1.1.124-location-icon-upload";

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
