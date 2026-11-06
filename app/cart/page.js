import { CartContents } from "../../components/cart";
import { getProducts } from "../../lib/catalogue";

export const metadata = { title: "Your cart" };

export default async function Page() {
  return <section className="section-inner storefront">
    <h1>Your cart</h1>
    <CartContents products={await getProducts()} />
  </section>;
}
