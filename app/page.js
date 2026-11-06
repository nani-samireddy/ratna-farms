import Link from "next/link";
import Image from "next/image";
import { ProductGrid } from "../components/catalogue";
import { getProducts } from "../lib/catalogue";

export default async function HomePage() {
  const products = await getProducts();
  return <>
    <section className="hero wrap" aria-labelledby="hero-title">
      <Image className="hero-image" src="/assets/farm-hero.jpg" alt="" preload fill />
      <div className="hero-copy">
        <p className="kicker">R. Chandrampalem · East Godavari</p>
        <h1 id="hero-title">From our farm<br /><em>to your table.</em></h1>
        <p>Country chicken and eggs for everyday meals<br className="desktop" /> and the ones you gather around.</p>
        <Link className="pill light" href="/shop/">Shop our produce ↗</Link>
      </div>
      <div className="hero-notes" aria-hidden="true"><span>Country chicken</span><span>East Godavari</span><span>Farm eggs</span></div>
      <p className="hero-caption">Illustrative farm scene</p>
    </section>
    <section className="farm" id="farm">
      <div className="section-inner">
        <p className="tag">The farm</p>
        <h2>A little closer<br />to where food comes from.</h2>
        <p className="intro">From R. Chandrampalem, we offer country chicken and eggs to families in East Godavari.</p>
        <Link className="pill dark section-cta" href="/about/">About Ratna Farms ↗</Link>
      </div>
    </section>
    <section className="produce" id="shop">
      <div className="section-inner">
        <p className="tag">Our produce</p>
        <h2>Meet the flock.</h2>
        <p className="intro">Explore the products, choose a pack or weight, and add what you need to your cart.</p>
        <ProductGrid products={products} />
        <Link className="pill dark section-cta" href="/shop/">Browse and search the shop ↗</Link>
      </div>
    </section>
    <section className="order" id="order">
      <div className="section-inner order-layout">
        <div><p className="tag">Order from the farm</p><h2>Ready to order?</h2><p>Open a product to order directly, or use your cart to order several items together.</p></div>
        <div className="product-actions"><Link className="pill dark" href="/shop/">Shop our produce ↗</Link><Link className="pill light" href="/cart/">View your cart</Link></div>
      </div>
    </section>
  </>;
}
