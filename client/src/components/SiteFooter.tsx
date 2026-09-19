import { Instagram } from "lucide-react";
import { toast } from "sonner";

const PHONE = "725 480 018";
const PHONE_HREF = "tel:+420725480018";

export default function SiteFooter() {
  const showComingSoon = () => {
    toast("Ceník připravujeme", {
      description: "Samostatnou stránku doplníme v další fázi webu.",
    });
  };

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <a href="/" className="brand brand--footer" aria-label="K2 garage — úvod">
            <img className="brand__logo" src="/assets/K2-GARAGE-mlecna.webp" alt="K2 garage" />
          </a>
          <p>Automobily, motocykly,<br />a pomoc před koupí.</p>
        </div>
        <div>
          <span className="footer-label">KONTAKT</span>
          <a className="footer-phone" href={PHONE_HREF}>{PHONE}</a>
          <a href="mailto:k2garage@seznam.cz">k2garage@seznam.cz</a>
          <p>Po–Pá 8:00–17:00<br />po telefonické domluvě</p>
        </div>
        <div>
          <span className="footer-label">NAVIGACE</span>
          <a href="/sluzby">Služby</a>
          <a href="/#o-nas">O nás</a>
          <button className="footer-nav-button" type="button" onClick={showComingSoon}>Ceník</button>
          <a href="/#kontakt">Kontakt</a>
          <a href="/rezervace">Rezervace</a>
          <div className="footer-socials" aria-label="Sociální sítě">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><span className="social-fallback">f</span></a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
          </div>
        </div>
        <div>
          <span className="footer-label">FIRMA</span>
          <p>K2 garage s.r.o.<br />IČO: 29956641<br />Svépomoc III 2044/21<br />Přerov</p>
        </div>
      </div>
      <div className="container site-footer__bottom"><span>K2 garage s.r.o.</span><span>Sídlo společnosti · dílna není na webu uvedena</span></div>
    </footer>
  );
}
