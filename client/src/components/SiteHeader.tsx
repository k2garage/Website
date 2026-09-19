import { ArrowRight, Instagram, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

type SiteHeaderProps = {
  lockPage?: boolean;
};

export default function SiteHeader({ lockPage = false }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 36);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || lockPage ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, lockPage]);

  const closeMenu = () => setMenuOpen(false);
  const navigateFromTop = () => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className={`site-header ${menuOpen ? "site-header--menu-open" : ""} ${isScrolled ? "site-header--scrolled" : ""}`}>
      <div className="container site-header__inner">
        <a href="/" className="brand" aria-label="K2 garage — úvod">
          <img className="brand__logo" src="/assets/K2-GARAGE-mlecna.webp" alt="K2 garage" />
        </a>

        <nav className={`site-nav ${menuOpen ? "site-nav--open" : ""}`} aria-label="Hlavní navigace">
          <div className="site-nav__core">
            <Link className="site-nav__link" href="/sluzby" onClick={navigateFromTop}>Služby</Link>
            <Link className="site-nav__link" href="/inzeraty" onClick={navigateFromTop}>Vozidla</Link>
            <Link className="site-nav__link" href="/o-nas" onClick={navigateFromTop}>O nás</Link>
            <Link className="site-nav__link" href="/cenik" onClick={navigateFromTop}>Ceník</Link>
            <Link className="site-nav__link" href="/kontakt" onClick={navigateFromTop}>Kontakt</Link>
          </div>
          <Link className="site-nav__contact--mobile" href="/kontakt" onClick={navigateFromTop}><Phone size={17} /> Kontaktovat</Link>
          <Link className="site-nav__reservation site-nav__reservation--mobile" href="/rezervace" onClick={navigateFromTop}>Rezervace <ArrowRight size={15} /></Link>
          <div className="mobile-nav__extras">
            <div className="mobile-nav__socials" aria-label="Sociální sítě">
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><span className="social-fallback">f</span></a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
            </div>
          </div>
        </nav>

        <div className="header-actions">
          <Link className="header-contact" href="/kontakt" onClick={navigateFromTop}><Phone size={15} /> Kontaktovat</Link>
          <Link className="header-reservation" href="/rezervace" onClick={navigateFromTop}>Rezervace <ArrowRight size={15} /></Link>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
