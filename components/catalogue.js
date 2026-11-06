"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function priceLabel(product) {
  const option = product.options.find((option) => option.price);
  return option ? `₹${option.price} / ${option.unit}` : "Price on request";
}

export function ProductGrid({ products }) {
  return <div className="shop-grid">
    {products.map((product) => <article className="product shop-card" key={product.slug}>
      <Link href={`/products/${product.slug}/`} aria-label={`View ${product.name}`}>
        <Image src={product.photos[0].src} alt={product.photos[0].alt} width={420} height={300} />
      </Link>
      <div>
        <p className="kicker">{product.group}</p>
        <h3><Link href={`/products/${product.slug}/`}>{product.name}</Link></h3>
        <p>{priceLabel(product)}</p>
      </div>
    </article>)}
  </div>;
}

export function ShopCatalogue({ products }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = products.filter((product) => {
    const text = [product.name, product.telugu, product.group, product.description, product.keywords].join(" ").toLowerCase();
    return (group === "All" || product.group === group) && terms.every((term) => text.includes(term));
  });

  return <>
    <div className="shop-controls">
      <div role="search" aria-label="Search our produce">
        <label htmlFor="catalogue-search">Search our produce</label>
        <input id="catalogue-search" type="search" placeholder="Try Natu Kodi, Aseel or eggs" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select id="category" value={group} onChange={(event) => setGroup(event.target.value)}>
          {["All", ...new Set(products.map((product) => product.group))].map((group) => <option key={group}>{group}</option>)}
        </select>
      </div>
    </div>
    <p role="status" className="result-count">{results.length ? `${results.length} ${results.length === 1 ? "product" : "products"}` : "No products found. Try a different search or category."}</p>
    <ProductGrid products={results} />
  </>;
}
