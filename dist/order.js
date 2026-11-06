const form = document.querySelector("#order-form");
const product = form.elements.product;
const amount = form.elements.amount;
const area = form.elements.area;
const examples = {
  "Natu Kodi": "e.g. 1 kg or 1 whole bird",
  Aseel: "e.g. 1 bird",
  Kadaknath: "e.g. 1 bird",
  "Natu Kodi Eggs": "e.g. 12 eggs",
};

function updateExample() {
  amount.placeholder = examples[product.value];
}

product.addEventListener("change", updateExample);
document.querySelectorAll("[data-product]").forEach((link) => {
  link.addEventListener("click", () => {
    product.value = link.dataset.product;
    updateExample();
  });
});

for (const field of [amount, area]) {
  field.addEventListener("input", () => {
    field.setCustomValidity(field.value && !field.value.trim() ? "Please enter a value." : "");
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = [
    "Hello Ratna Farms! I’d like to check availability for an order.",
    "",
    `Produce: ${product.value}`,
    `Quantity: ${amount.value.trim()}`,
    `Delivery area: ${area.value.trim()}`,
    "",
    "Please confirm availability, price and delivery options.",
  ].join("\n");
  const destination = new URL("https://wa.me/919493981264");
  destination.searchParams.set("text", message);
  window.location.assign(destination.href);
});
