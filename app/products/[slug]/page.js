import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "../../../lib/catalogue";
import { ProductGrid } from "../../../components/catalogue";
import { ProductOptions } from "../../../components/cart";
import Gallery from "../../../components/gallery";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProducts()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const product = await getProduct((await params).slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const related = (await getProducts()).filter(({ slug }) => slug !== product.slug);
  return <div className="section-inner detail">
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/shop/">Shop</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span>
    </nav>
    <article className="detail-grid">
      <Gallery photos={product.photos} />
      <div className="detail-copy peach">
        <p className="tag">{product.group}</p>
        <h1>{product.name}</h1>
        <p className="detail-telugu" lang="te">{product.telugu}</p>
        <p>{product.description}</p>
        <ProductOptions product={product} />
        <p className="product-detail">{product.detail}</p>
      </div>
    </article>
    <section className="related">
      <h2>More from the shop</h2>
      <ProductGrid products={related} />
    </section>
  </div>;
}
