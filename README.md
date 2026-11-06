# Ratna Farms

Next.js App Router storefront for country chicken and eggs in R. Chandrampalem. The shop supports search, product variants, a browser-local cart and WhatsApp checkout.

## Development

Use Node.js 24. Run `npm ci` and `npm run dev` and open [localhost:3000](http://localhost:3000). Run `npm run build` to export the storefront to `out/`.

## Catalogue and FMS

The storefront uses sample data from `lib/sample-products.json`. The server-side catalogue functions in `lib/catalogue.js` are the integration point for FMS on Frappe. Map FMS records into the current product shape, including a stable slug, photos and order options with stable IDs, units and optional prices. Cart storage contains option IDs and quantities, and the cart resolves current prices from the catalogue.

The current deployment renders the catalogue at build time. When connecting FMS, keep credentials in the build or server environment. Use a rebuild to refresh a static deployment, or switch to a Next.js server deployment if the catalogue needs runtime updates.

## Home server

Run `docker compose up -d --build --wait` from the repository root. Docker builds the Next.js export and serves it with Nginx. Set `RATNA_BIND` to the server's LAN address to limit the listener to that interface. The default port is 8092 and can be changed with `RATNA_PORT`.

## Images

The product photo sources and licenses are listed in [Photo credits](dist/credits.html). The illustrative hero was made with built-in ImageGen.

> Use case photorealistic-natural. Generate one wide landscape website hero photograph, 2:1 if possible. Scene: a rural East Godavari, Andhra Pradesh small farm, green sunlit grass, distant lush coconut palms and trees, and a clear rich medium blue sky with scattered white clouds occupying the top 55 percent. On the lower central third, a small flock of free-roaming Indian country chickens with red-brown and cream plumage, distinctive rust rooster in front, pecking on a grassy path. Photographed from slightly low angle with a wide lens, candid editorial film still, natural daylight, subtle film grain, muted warm greens, softly analog color like the photographic hero on the provided Homeland style references. Use the references only for composition and visual mood. Keep center of sky fairly clear with mid-tone blue for white overlay typography, ensure the rooster is inside the central 35% for mobile crop. No text, graphic elements, watermark, buildings or logos.
