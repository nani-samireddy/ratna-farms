import { CartContents } from "../../components/cart";
import { getProducts } from "../../lib/catalogue";

export const metadata = { title: "Checkout" };

export default async function Page() {
  return <section className="section-inner storefront">
    <h1>Checkout</h1>
    <CartContents products={await getProducts()} checkout />
  </section>;
}
