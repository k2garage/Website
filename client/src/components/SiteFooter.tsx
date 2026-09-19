import {
  ArrowRight,
  Clock3,
  Facebook,
  House,
  Instagram,
  Mail,
  Phone,
} from "lucide-react";
import { Link } from "wouter";

const PHONE = "725 480 018";
const PHONE_HREF = "tel:+420725480018";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <a href="/" className="brand brand--footer" aria-label="K2 garage — úvod">
            <img className="brand__logo" src="/assets/K2-GARAGE-mlecna.webp" alt="K2 garage" />
          </a>
          <p>
            Poctivý autoservis pro automobily i motocykly. Pomůžeme s běžným servisem,
            kontrolou vozu před koupí i výběrem a dovozem dalšího auta.
          </p>
        </div>

        <nav className="site-footer__nav" aria-label="Navigace v patičce">
          <span className="footer-label">NAVIGACE</span>
          <Link href="/sluzby">Služby</Link>
          <a href="/#o-nas">O nás</a>
          <Link href="/cenik">Ceník</Link>
          <Link href="/kontakt">Kontakt</Link>
        </nav>

        <address className="site-footer__contact">
          <span className="footer-label">KONTAKT</span>
          <a href={PHONE_HREF}><Phone size={16} strokeWidth={1.8} /><span>{PHONE}</span></a>
          <a href="mailto:k2garage@seznam.cz"><Mail size={16} strokeWidth={1.8} /><span>k2garage@seznam.cz</span></a>
          <p><House size={16} strokeWidth={1.8} /><span><strong>Pouze sídlo společnosti</strong><br />Svépomoc III 2044/21<br />Přerov</span></p>
          <p><Clock3 size={16} strokeWidth={1.8} /><span>Po–Pá 8:00–17:00<br />po telefonické domluvě</span></p>
        </address>
      </div>

      <div className="container footer-actions">
        <Link className="footer-contact" href="/kontakt"><Phone size={16} /> Kontaktovat</Link>
        <Link className="footer-reservation" href="/rezervace">Rezervace <ArrowRight size={16} /></Link>
      </div>

      <div className="container site-footer__bottom">
        <span>© {new Date().getFullYear()} K2 garage s.r.o.</span>
        <div className="footer-socials" aria-label="Sociální sítě">
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17} /></a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a>
        </div>
      </div>
    </footer>
  );
}
