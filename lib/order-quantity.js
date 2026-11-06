export function validQuantity(quantity, option) {
  return Number.isFinite(quantity) && quantity >= option.step && quantity <= 99 &&
    Number.isInteger(quantity / option.step);
}
