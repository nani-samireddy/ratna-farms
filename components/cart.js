"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { validQuantity } from "../lib/order-quantity";
import { CustomerFields, OrderConfirmation, useOrderSubmission } from "./order-form";

const CartContext = createContext(null);
const storageKey = "ratna-farms-cart";

function readCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
    return Object.fromEntries(Object.entries(stored).filter(([, quantity]) =>
      Number.isFinite(quantity) && quantity > 0 && quantity <= 99
    ));
  } catch {
    return {};
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(null);

  useEffect(() => setItems(readCart()), []);
  useEffect(() => {
    if (!items) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // The cart remains usable during this visit if storage is unavailable.
    }
  }, [items]);

  function change(key, quantity, append = false) {
    setItems((current) => {
      const next = { ...(current ?? readCart()) };
      if (quantity === 0) delete next[key];
      else next[key] = Math.min(99, quantity + (append ? next[key] ?? 0 : 0));
      return next;
    });
  }

  return <CartContext.Provider value={{ items, change }}>{children}</CartContext.Provider>;
}

export function CartLink() {
  const { items } = useContext(CartContext);
  const count = Object.keys(items ?? {}).length;
  return <Link className="pill dark" href="/cart/">Cart{count > 0 && <span className="cart-count">{count}</span>}</Link>;
}

function optionPrice(option) {
  return option.price ? `₹${option.price} / ${option.unit}` : "Price on request";
}

export function ProductOptions({ product }) {
  const { change } = useContext(CartContext);
  const [optionId, setOptionId] = useState(product.options[0].id);
  const [notice, setNotice] = useState("");
  const option = product.options.find(({ id }) => id === optionId);
  const submission = useOrderSubmission();

  function add(event) {
    const field = event.currentTarget.form.elements.quantity;
    if (!field.reportValidity()) return;
    const quantity = field.valueAsNumber;
    if (!validQuantity(quantity, option)) return;
    change(`${product.slug}:${option.id}`, quantity, true);
    setNotice(`${product.name} added to your cart.`);
  }

  function order(event) {
    event.preventDefault();
    const quantity = event.currentTarget.elements.quantity.valueAsNumber;
    if (!validQuantity(quantity, option)) return;
    void submission.submit(event.currentTarget, [{ slug: product.slug, optionId, quantity }]);
  }

  if (submission.orderId) return <OrderConfirmation orderId={submission.orderId} />;
  return <form className="purchase-form" onSubmit={order} onChange={() => setNotice("")}>
    <label htmlFor="purchase-option">Choose an option</label>
    <select id="purchase-option" value={optionId} onChange={(event) => setOptionId(event.target.value)}>
      {product.options.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
    </select>
    <p className="option-price">{optionPrice(option)}</p>
    <label htmlFor="purchase-quantity">Quantity ({option.unit})</label>
    <input key={option.id} id="purchase-quantity" type="number" name="quantity" min={option.step} max="99" step={option.step} defaultValue={1} required />
    <CustomerFields prefix="product" />
    <div className="product-actions">
      <button className="pill dark" type="submit" disabled={submission.pending}>{submission.pending ? "Placing order…" : "Place order"}</button>
      <button className="pill light" type="button" onClick={add}>Add to cart</button>
    </div>
    {submission.error && <p role="alert">{submission.error}</p>}
    <p role="status">{notice}</p>
    {notice && <Link className="text-link" href="/cart/">View cart ↗</Link>}
  </form>;
}

function quantityLabel(quantity, unit) {
  return `${quantity} ${quantity === 1 && unit !== "kg" ? unit.slice(0, -1) : unit}`;
}

function cartLines(products, items) {
  return products.flatMap((product) => product.options.flatMap((option) => {
    const key = `${product.slug}:${option.id}`;
    const quantity = items[key];
    return validQuantity(quantity, option) ? [{ key, product, option, quantity }] : [];
  }));
}

export function CartContents({ products, checkout = false }) {
  const { items, change } = useContext(CartContext);
  const submission = useOrderSubmission();
  if (submission.orderId) return <OrderConfirmation orderId={submission.orderId} />;
  if (!items) return <p role="status">Loading your cart…</p>;
  const lines = cartLines(products, items);
  if (!lines.length) return <div className="empty-cart">
    <p>Your cart is empty.</p>
    <Link className="pill dark" href="/shop/">Browse the shop ↗</Link>
  </div>;

  const subtotal = lines.reduce((total, { option, quantity }) => total + (option.price ?? 0) * quantity, 0);
  const pendingPrices = lines.some(({ option }) => !option.price);

  async function submit(event) {
    event.preventDefault();
    const orderItems = lines.map(({ product, option, quantity }) => ({
      slug: product.slug, optionId: option.id, quantity,
    }));
    if (await submission.submit(event.currentTarget, orderItems)) {
      for (const { key } of lines) change(key, 0);
    }
  }

  return <div className="cart-layout">
    <ul className="cart-list" aria-label="Cart items">
      {lines.map(({ key, product, option, quantity }) => <li className="cart-line" key={key}>
        <Image src={product.photos[0].src} alt={product.photos[0].alt} width={100} height={100} />
        <div>
          <Link href={`/products/${product.slug}/`}>{product.name}</Link>
          <p>{option.name} · {quantityLabel(quantity, option.unit)}</p>
          <p>{option.price ? `₹${option.price * quantity}` : "Price on request"}</p>
          {!checkout && <div className="line-actions">
            <form key={quantity} onSubmit={(event) => {
              event.preventDefault();
              const value = Number(new FormData(event.currentTarget).get("quantity"));
              if (validQuantity(value, option)) change(key, value);
            }}>
              <input type="number" name="quantity" aria-label={`Quantity for ${product.name}, ${option.name}`} min={option.step} step={option.step} max="99" defaultValue={quantity} required />
              <button className="plain-button" type="submit">Update</button>
            </form>
            <button className="plain-button" type="button" onClick={() => change(key, 0)}>Remove</button>
          </div>}
        </div>
      </li>)}
    </ul>
    <div className="cart-summary">
      <h2>Order summary</h2>
      {subtotal > 0 && <p>Priced items subtotal <strong>₹{subtotal}</strong></p>}
      <p>{pendingPrices ? "Some items are priced on request. We’ll confirm the final total and delivery." : "We’ll confirm availability and delivery charges."}</p>
      {checkout ? <form className="purchase-form" onSubmit={submit}>
        <CustomerFields prefix="checkout" />
        <button className="pill dark" type="submit" disabled={submission.pending}>{submission.pending ? "Placing order…" : "Place order"}</button>
        {submission.error && <p role="alert">{submission.error}</p>}
        <Link className="text-link" href="/cart/">Edit cart</Link>
      </form> : <Link className="pill dark section-cta" href="/checkout/">Go to checkout ↗</Link>}
    </div>
  </div>;
}
