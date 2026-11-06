import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "The farm" };

export default function AboutPage() {
  return <section className="section-inner storefront">
    <p className="tag">R. Chandrampalem · East Godavari</p>
    <h1>The farm.</h1>
    <p className="page-intro">Ratna Farms offers country chicken and eggs for families in East Godavari.</p>
    <Image className="about-photo" src="/assets/farm-hero.jpg" alt="Illustrative countryside scene with country chickens" width={1774} height={887} />
    <h2>Delivery and enquiries</h2>
    <p className="page-intro">Serving Kakinada, Pithapuram, Peddapuram, Samarlakota and nearby villages. We confirm stock, preparation and delivery through WhatsApp.</p>
    <Link className="pill dark section-cta" href="/shop/">Explore the shop ↗</Link>
  </section>;
}
