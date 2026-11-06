# Ratna Farms

An alternate storefront for the Ratna Country Chicken business in R. Chandrampalem. The site uses plain HTML, CSS and JavaScript. The order form prepares a WhatsApp enquiry so the farm can confirm availability, pricing and delivery.

## Preview

Run `python3 -m http.server 8092 --directory dist` from the repository root and open [localhost:8092](http://localhost:8092).

## Home server

Run `docker compose up -d --build --wait` from the repository root. The default port is 8092. Set `RATNA_BIND` to the server's LAN address to limit the listener to that interface. Set `RATNA_PORT` if a different port is needed.

## Images

The product photo sources and licenses are listed in [Photo credits](dist/credits.html). The illustrative hero was made with built-in ImageGen.

> Use case photorealistic-natural. Generate one wide landscape website hero photograph, 2:1 if possible. Scene: a rural East Godavari, Andhra Pradesh small farm, green sunlit grass, distant lush coconut palms and trees, and a clear rich medium blue sky with scattered white clouds occupying the top 55 percent. On the lower central third, a small flock of free-roaming Indian country chickens with red-brown and cream plumage, distinctive rust rooster in front, pecking on a grassy path. Photographed from slightly low angle with a wide lens, candid editorial film still, natural daylight, subtle film grain, muted warm greens, softly analog color like the photographic hero on the provided Homeland style references. Use the references only for composition and visual mood. Keep center of sky fairly clear with mid-tone blue for white overlay typography, ensure the rooster is inside the central 35% for mobile crop. No text, graphic elements, watermark, buildings or logos.
