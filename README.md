# Ratna Farms

Next.js App Router storefront for country chicken and eggs in R. Chandrampalem. Customers can place an order on a product page or check out several items together.

## Development

Use Node.js 24. Run `npm ci` and `npm run dev` and open [localhost:3000](http://localhost:3000). Run `npm run build` to build the standalone Next.js server.

## Frappe FMS integration

The storefront uses sample catalogue data from `lib/sample-products.json`. The server-side catalogue functions in `lib/catalogue.js` are the integration point for an FMS catalogue.

Set `FMS_ORDER_URL` to the Frappe order intake method URL and set `FMS_API_KEY` and `FMS_API_SECRET` in the server environment. Use an integration user with access to the intake method. Configure these values in the deployment's untracked `.env` for Docker Compose.

The storefront calls the method with JSON containing `request_id`, `customer_name`, `customer_phone`, `delivery_area`, `notes`, and `items`. Each item has `product_slug`, `option_id`, and `quantity`. The Frappe response must include `{"message":{"order_id":"<saved order reference>"}}`. The storefront only displays a confirmation after receiving that reference.

The FMS method must validate availability and pricing, store the order with a unique `request_id`, and return the existing reference when a request is retried. After committing a new order, FMS should queue WhatsApp and email notifications to the configured administrators. Handle notification retries independently of order acceptance and rate limit public intake before enabling the checkout.

## Home server

After configuring and verifying FMS order intake, run `docker compose up -d --build --wait` from the repository root. Docker builds and serves the standalone Next.js app. Set `RATNA_BIND` to the server's LAN address to limit the listener to that interface. The default port is 8092 and can be changed with `RATNA_PORT`.

## Images

The product photo sources and licenses are listed in [Photo credits](dist/credits.html). The illustrative hero was made with built-in ImageGen.

> Use case photorealistic-natural. Generate one wide landscape website hero photograph, 2:1 if possible. Scene: a rural East Godavari, Andhra Pradesh small farm, green sunlit grass, distant lush coconut palms and trees, and a clear rich medium blue sky with scattered white clouds occupying the top 55 percent. On the lower central third, a small flock of free-roaming Indian country chickens with red-brown and cream plumage, distinctive rust rooster in front, pecking on a grassy path. Photographed from slightly low angle with a wide lens, candid editorial film still, natural daylight, subtle film grain, muted warm greens, softly analog color like the photographic hero on the provided Homeland style references. Use the references only for composition and visual mood. Keep center of sky fairly clear with mid-tone blue for white overlay typography, ensure the rooster is inside the central 35% for mobile crop. No text, graphic elements, watermark, buildings or logos.
