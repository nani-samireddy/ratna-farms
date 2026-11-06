import samples from "./sample-products.json";

export async function getProducts() {
  return samples;
}

export async function getProduct(slug) {
  return (await getProducts()).find((product) => product.slug === slug);
}
