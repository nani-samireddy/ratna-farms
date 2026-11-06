import { ShopCatalogue } from "../../components/catalogue";
import { getProducts } from "../../lib/catalogue";

export const metadata = { title: "Shop" };

export default async function ShopPage() {
  return <section className="section-inner storefront">
    <p className="tag">The farm shop</p>
    <h1>Shop our produce.</h1>
    <p className="page-intro">Country chicken and eggs from East Godavari. Browse the catalogue and choose how much you need.</p>
    <ShopCatalogue products={await getProducts()} />
  </section>;
}
