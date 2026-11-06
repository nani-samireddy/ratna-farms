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
const requestedProduct = new URLSearchParams(window.location.search).get("product");
if (Object.hasOwn(examples, requestedProduct)) {
  product.value = requestedProduct;
}
updateExample();

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

const search = document.querySelector("#catalogue-search");
const status = document.querySelector("#catalogue-status");
const cards = document.querySelectorAll("[data-search]");

function filterProducts() {
  const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  let count = 0;

  for (const card of cards) {
    const text = card.dataset.search.toLowerCase();
    card.hidden = !terms.every((term) => text.includes(term));
    if (!card.hidden) count += 1;
  }

  status.textContent = !terms.length ? "" : count
    ? `${count} ${count === 1 ? "product" : "products"} found`
    : "No products found. Try another search.";
}

search.closest('[role="search"]').hidden = false;
search.addEventListener("input", filterProducts);
window.addEventListener("pageshow", filterProducts);
filterProducts();
