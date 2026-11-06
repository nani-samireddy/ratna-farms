import { getProducts } from "../../../lib/catalogue";
import { validQuantity } from "../../../lib/order-quantity";

function error(message, status) {
  return Response.json({ error: message }, { status });
}

function field(value, limit) {
  return typeof value === "string" && value.length <= limit ? value.trim() : "";
}

export async function POST(request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return error("Please place your order from Ratna Farms.", 403);
  }
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
    return error("Invalid order format.", 415);
  }

  const body = await request.json().catch(() => null);
  const name = field(body?.name, 80);
  const phone = field(body?.phone, 24);
  const area = field(body?.area, 80);
  const notes = field(body?.notes, 240);
  const requestId = field(body?.requestId, 36);
  if (!name || !area || !/^\+?[0-9][0-9 ()-]{6,22}[0-9]$/.test(phone) ||
      !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(requestId)) {
    return error("Check your name, phone number and delivery area.", 400);
  }

  const products = await getProducts();
  const options = new Map(products.flatMap((product) => product.options.map((option) =>
    [`${product.slug}:${option.id}`, option]
  )));
  if (!Array.isArray(body.items) || !body.items.length || body.items.length > options.size) {
    return error("Choose at least one available item.", 400);
  }

  const seen = new Set();
  for (const item of body.items) {
    const key = `${item?.slug}:${item?.optionId}`;
    const option = options.get(key);
    if (!option || seen.has(key) || !validQuantity(item.quantity, option)) {
      return error("Check the selected items and quantities.", 400);
    }
    seen.add(key);
  }

  const { FMS_ORDER_URL, FMS_API_KEY, FMS_API_SECRET } = process.env;
  if (!FMS_ORDER_URL || !FMS_API_KEY || !FMS_API_SECRET) {
    return error("Online ordering is temporarily unavailable. Please try again later.", 503);
  }

  try {
    const response = await fetch(FMS_ORDER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${FMS_API_KEY}:${FMS_API_SECRET}`,
      },
      body: JSON.stringify({
        request_id: requestId,
        customer_name: name,
        customer_phone: phone,
        delivery_area: area,
        notes,
        items: body.items.map(({ slug, optionId, quantity }) => ({
          product_slug: slug,
          option_id: optionId,
          quantity,
        })),
      }),
      redirect: "error",
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (response.ok) {
      const result = await response.json();
      const orderId = field(result?.message?.order_id, 140);
      if (orderId) return Response.json({ orderId }, { status: 201 });
    }
    console.error("FMS order intake returned an unexpected response", response.status);
  } catch {
    console.error("FMS order intake could not be reached");
  }

  return error("We couldn’t confirm your order. Please try again.", 502);
}
