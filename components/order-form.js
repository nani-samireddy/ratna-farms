"use client";

import { useRef, useState } from "react";

export function useOrderSubmission() {
  const attempt = useRef(null);
  const inFlight = useRef(false);
  const [result, setResult] = useState({});

  async function submit(form, items) {
    if (inFlight.current || result.orderId) return false;
    const fields = new FormData(form);
    const payload = {
      name: fields.get("name"),
      phone: fields.get("phone"),
      area: fields.get("area"),
      notes: fields.get("notes"),
      items,
    };
    const fingerprint = JSON.stringify(payload);
    if (attempt.current?.fingerprint !== fingerprint) {
      attempt.current = { fingerprint, requestId: crypto.randomUUID() };
    }
    inFlight.current = true;
    setResult({ pending: true });
    try {
      const response = await fetch("/api/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, requestId: attempt.current.requestId }),
      });
      const result = await response.json();
      if (!response.ok || !result.orderId) {
        setResult({ error: result.error ?? "We couldn’t confirm your order. Please try again." });
        return false;
      }
      setResult({ orderId: result.orderId });
      return true;
    } catch {
      setResult({ error: "We couldn’t confirm your order. Please try again." });
      return false;
    } finally {
      inFlight.current = false;
    }
  }

  return { ...result, submit };
}

export function CustomerFields({ prefix }) {
  return <>
    <label htmlFor={`${prefix}-name`}>Your name</label>
    <input id={`${prefix}-name`} name="name" autoComplete="name" maxLength={80} pattern=".*\S.*" required />
    <label htmlFor={`${prefix}-phone`}>Phone number</label>
    <input id={`${prefix}-phone`} type="tel" name="phone" autoComplete="tel" maxLength={24} required />
    <label htmlFor={`${prefix}-area`}>Delivery area</label>
    <input id={`${prefix}-area`} name="area" autoComplete="address-level2" maxLength={80} pattern=".*\S.*" placeholder="Town or village" required />
    <label htmlFor={`${prefix}-notes`}>Order notes (optional)</label>
    <textarea id={`${prefix}-notes`} name="notes" maxLength={240} rows={2} />
  </>;
}

export function OrderConfirmation({ orderId }) {
  return <p role="status">Order received. Your reference is <strong>{orderId}</strong>. We’ll contact you to confirm availability and delivery.</p>;
}
