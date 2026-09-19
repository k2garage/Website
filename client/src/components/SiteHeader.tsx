import { ArrowRight, Instagram, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const showComingSoon = () => {
    closeMenu();
    toast("Ceník připravujeme", {
      description: "Samostatnou stránku doplníme v další fázi webu.",
    });
  };

  return (
    <header className={`site-header ${menuOpen ? "site-header--menu-open" : ""} ${isScrolled ? "site-header--scrolled" : ""}`}>
      <div className="container site-header__inner">
        <a href="/" className="brand" aria-label="K2 garage — úvod">
          <img className="brand__logo" src="/assets/K2-GARAGE-mlecna.webp" alt="K2 garage" />
        </a>

        <nav className={`site-nav ${menuOpen ? "site-nav--open" : ""}`} aria-label="Hlavní navigace">
          <a className="site-nav__link" href="/sluzby" onClick={closeMenu}>Služby</a>
          <a className="site-nav__link" href="/#o-nas" onClick={closeMenu}>O nás</a>
          <button className="site-nav__link" type="button" onClick={showComingSoon}>Ceník</button>
          <a className="site-nav__link" href="/#kontakt" onClick={closeMenu}>Kontakt</a>
          <a className="site-nav__link site-nav__reservation" href="/rezervace" onClick={closeMenu}>Rezervace <ArrowRight size={15} /></a>
          <div className="mobile-nav__extras">
            <div className="mobile-nav__socials" aria-label="Sociální sítě">
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><span className="social-fallback">f</span></a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
            </div>
          </div>
        </nav>

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
