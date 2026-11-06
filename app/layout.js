import Link from "next/link";
import { CartProvider, CartLink } from "../components/cart";
import "./globals.css";

export const metadata = {
  title: { default: "Ratna Farms | Country chicken & eggs", template: "%s | Ratna Farms" },
  description: "Shop country chicken and eggs from Ratna Farms in R. Chandrampalem, East Godavari.",
  icons: { icon: "/assets/mark.svg" },
};

export default function Layout({ children }) {
  return <html lang="en"><body>
    <CartProvider>
      <a className="skip" href="#main">Skip to content</a>
      <header className="top wrap">
        <Link className="brand" href="/">Ratna Farms<span>.</span></Link>
        <nav aria-label="Main navigation">
          <Link className="nav-link" href="/about/">The farm</Link>
          <Link className="nav-link" href="/shop/">Shop</Link>
          <CartLink />
        </nav>
      </header>
      <main id="main">{children}</main>
      <footer className="footer">
        <div className="section-inner">
          <Link className="footer-brand" href="/" aria-label="Ratna Farms home">
            <svg viewBox="0 0 1120 174" aria-hidden="true" focusable="false">
              <text x="0" y="141" textLength="1030" lengthAdjust="spacingAndGlyphs">Ratna Farms</text>
              <circle className="footer-brand-dot" cx="1084" cy="126" r="16" />
            </svg>
          </Link>
          <div className="footer-main">
            <p>R. Chandrampalem, East Godavari, Andhra Pradesh</p>
            <a className="pill light" href="tel:+919493981264">Call the farm ↗</a>
          </div>
          <div className="footer-base"><span>Country chicken &amp; eggs</span><a href="/credits.html">Photo credits</a></div>
        </div>
      </footer>
    </CartProvider>
  </body></html>;
}
