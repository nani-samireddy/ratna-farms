"use client";

import { useState } from "react";
import Image from "next/image";

export default function Gallery({ photos }) {
  const [selected, setSelected] = useState(0);
  return <figure className="product-gallery">
    <Image src={photos[selected].src} alt={photos[selected].alt} width={760} height={760} />
    {photos.length > 1 && <div className="gallery-thumbnails" aria-label="Product photos">
      {photos.map((photo, index) => <button type="button" key={photo.src} aria-label={`Show photo ${index + 1}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
        <Image src={photo.src} alt="" width={64} height={64} />
      </button>)}
    </div>}
    <figcaption>Illustrative photos · <a href="/credits.html">Photo credits</a></figcaption>
  </figure>;
}
