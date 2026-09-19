import { type CSSProperties, type MouseEvent, useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  CarFront,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Gauge,
  Instagram,
  Menu,
  MoveUpRight,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";

const PHONE = "725 480 018";
const PHONE_HREF = "tel:+420725480018";

const slides = [
  {
    eyebrow: "Kontrola vozu před koupí",
    title: "Než koupíte auto, nechte ho zkontrolovat.",
    text: "Technik za vozem sám zajede, prohlédne jeho stav a řekne vám, co skutečně našel. Srozumitelně a bez zbytečných okolků.",
    image: "/assets/k2-hero-inspection.webp",
    primary: "Objednat kontrolu vozu",
    primaryHref: "#kontrola-vozu",
    secondary: "Zavolat do servisu",
  },
  {
    eyebrow: "Autoservis · pneuservis · motoservis",
    title: "Když váš vůz potřebuje péči, víte, kam zavolat.",
    text: "Postaráme se o automobily i motocykly. Probereme s vámi problém a domluvíme další postup podle konkrétního vozu.",
    image: "/assets/k2-hero-workshop.webp",
    primary: "Prohlédnout služby",
    primaryHref: "#sluzby",
    secondary: "Zavolat do servisu",
  },
  {
    eyebrow: "Dovoz vozidel z ČR i okolních zemí",
    title: "Hledáte auto? Najdeme, prověříme a dovezeme ho.",
    text: "Pomůžeme s výběrem vozidla v ČR i okolních zemích. Vůz vyhledáme, prověříme a domluvíme další postup.",
    image: "/assets/k2-hero-import.webp",
    primary: "Nezávazně se zeptat",
    primaryHref: "#dovoz",
    secondary: "Zavolat do servisu",
  },
];

const services = [
  {
    number: "01",
    title: "Autoservis",
    description: "Servis a opravy osobních automobilů. Probereme s vámi problém a navrhneme další postup.",
    icon: Wrench,
  },
  {
    number: "02",
    title: "Pneuservis",
    description: "Péče o pneumatiky a kola pro bezpečnější a pohodlnější jízdu.",
    icon: Gauge,
  },
  {
    number: "03",
    title: "Motoservis",
    description: "Servis a práce na motocyklech podle konkrétního problému a vašich potřeb.",
    icon: CarFront,
  },
  {
    number: "04",
    title: "Detailing",
    description: "Důkladná péče o vzhled vozu podle jeho stavu a vašich představ.",
    icon: Sparkles,
  },
  {
    number: "05",
    title: "Ověření vozidel",
    description: "Více podkladů pro rozhodnutí, když si chcete pořídit konkrétní vůz.",
    icon: ShieldCheck,
  },
  {
    number: "06",
    title: "Prodej a dovoz",
    description: "Nabídku připravujeme. Hledáte konkrétní auto? Zavolejte nám.",
    icon: Search,
  },
];

const benefits = [
  "Kontrola konkrétního vybraného vozu",
  "Posouzení závad a podezřelých míst",
  "Srozumitelné vysvětlení výsledku",
  "Podklad pro rozhodnutí, zda vůz koupit",
];

const processSteps = [
  {
    number: "01",
    title: "Popíšete, co potřebujete",
    text: "Řeknete nám, zda řešíte servis, pneumatiky, motorku, detailing nebo kontrolu auta před koupí.",
  },
  {
    number: "02",
    title: "Domluvíme další postup",
    text: "Probereme s vámi možnosti a domluvíme termín nebo další kroky podle konkrétní situace.",
  },
  {
    number: "03",
    title: "Postaráme se o zbytek",
    text: "Provedeme dohodnutou práci a vysvětlíme vám výsledek tak, abyste věděli, co bylo potřeba řešit.",
  },
];

const importSteps = [
  { number: "01", title: "Upřesníme požadavky", text: "Značka, model, rozpočet a další důležité parametry." },
  { number: "02", title: "Vyhledáme a prověříme", text: "Zaměříme se na dostupné informace a stav konkrétní nabídky." },
  { number: "03", title: "Domluvíme dovoz", text: "Po odsouhlasení dalšího postupu zajistíme přepravu vozidla." },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBooting(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    let ticking = false;
    const updateHeader = () => {
      header.classList.toggle("site-header--scrolled", window.scrollY > 36);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };
    updateHeader();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || isBooting ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, isBooting]);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8%" });
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const slide = slides[activeSlide];

  const goToSlide = (index: number) => {
    setActiveSlide((index + slides.length) % slides.length);
  };

  const closeMenu = () => setMenuOpen(false);

  const handleHeroPointerMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setParallax({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  return (
    <div className="site-shell">
      <div className={`page-loader ${isBooting ? "page-loader--active" : "page-loader--done"}`} aria-hidden={!isBooting}>
        <div className="page-loader__mark"><img src="/assets/K2-GARAGE-mlecna.webp" alt="K2 garage" /><span /></div>
        <div className="page-loader__meta"><span>Načítáme váš servis</span><strong>K2 / 2026</strong></div>
      </div>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
      <header className={`site-header ${menuOpen ? "site-header--menu-open" : ""}`} id="top">
        <div className="container site-header__inner">
          <a href="#top" className="brand" aria-label="K2 garage — úvod">
            <img className="brand__logo" src="/assets/K2-GARAGE-mlecna.webp" alt="K2 garage" />
          </a>

          <nav className={`site-nav ${menuOpen ? "site-nav--open" : ""}`} aria-label="Hlavní navigace">
            <a href="#sluzby" onClick={closeMenu}>Služby</a>
            <a href="#kontrola-vozu" onClick={closeMenu}>Kontrola vozu</a>
            <a href="#prodej" onClick={closeMenu}>Prodej vozidel</a>
            <a href="#dovoz" onClick={closeMenu}>Dovoz vozidel</a>
            <a href="#kontakt" onClick={closeMenu}>Kontakt</a>
            <div className="mobile-nav__extras">
              <a className="mobile-nav__call" href={PHONE_HREF} onClick={closeMenu}><Phone size={18} /> Zavolat na {PHONE}</a>
              <div className="mobile-nav__socials" aria-label="Sociální sítě">
                <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><span className="social-fallback">f</span></a>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
              </div>
            </div>
          </nav>

          <a className="header-phone" href={PHONE_HREF}>
            <Phone size={16} strokeWidth={2.5} />
            <span>{PHONE}</span>
          </a>
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

      <main>
        <section className="hero-carousel" onMouseMove={handleHeroPointerMove} onMouseLeave={() => setParallax({ x: 0, y: 0 })} aria-roledescription="carousel" aria-label="Hlavní nabídka K2 garage">
          <div className="hero-carousel__slides">
            {slides.map((item, index) => (
              <article
                className={`hero-slide ${index === activeSlide ? "hero-slide--active" : ""}`}
                key={item.eyebrow}
                aria-hidden={index !== activeSlide}
              >
                <div className="hero-visual" style={{ "--parallax-x": `${parallax.x}px`, "--parallax-y": `${parallax.y}px` } as CSSProperties} aria-hidden="true">
                  <img className="hero-visual__photo" src={item.image} alt="" />
                  <div className="hero-visual__grid" />
                  <span className="hero-visual__orb hero-visual__orb--one" />
                  <span className="hero-visual__orb hero-visual__orb--two" />
                  <span className="hero-visual__beam hero-visual__beam--one" />
                  <span className="hero-visual__beam hero-visual__beam--two" />
                  <div className="hero-visual__car">
                    <span className="hero-visual__windshield" />
                    <button className="hero-visual__headlight hero-visual__headlight--one" type="button" aria-label="Prohlédnout světlomet"><span className="hero-visual__part-label">SVĚTLO</span></button>
                    <button className="hero-visual__headlight hero-visual__headlight--two" type="button" aria-label="Prohlédnout druhý světlomet"><span className="hero-visual__part-label">SVĚTLO</span></button>
                    <button className="hero-visual__wheel hero-visual__wheel--one" type="button" aria-label="Prohlédnout pneumatiku"><span className="hero-visual__part-label">PNEU</span></button>
                    <button className="hero-visual__wheel hero-visual__wheel--two" type="button" aria-label="Prohlédnout druhou pneumatiku"><span className="hero-visual__part-label">PNEU</span></button>
                  </div>
                  <button className="hero-visual__diagnostic" type="button" aria-label="Prohlédnout diagnostiku"><span>OBD / 02</span><i /><b>READY</b><em className="hero-visual__part-label">DIAGNOSTIKA</em></button>
                  <span className="hero-visual__word">K2</span>
                  <span className="hero-visual__scanline" />
                </div>
                <div className="container hero-slide__inner">
                  <div className="hero-slide__content">
                    <span className="eyebrow eyebrow--light">{item.eyebrow}</span>
                    <h1>{item.title}</h1>
                    <p>{item.text}</p>
                    <div className="hero-actions">
                      <a className="button button--accent" href={item.primaryHref}>
                        {item.primary} <ArrowDownRight size={17} />
                      </a>
                      <a className="button button--ghost" href={PHONE_HREF}>
                        <Phone size={16} /> {item.secondary}
                      </a>
                    </div>
                  </div>
                  <div className="hero-slide__meta">
                    <span>{String(activeSlide + 1).padStart(2, "0")} / 03</span>
                    <span className="hero-slide__line" />
                    <span> Přerov · ČR</span>
                  </div>
                  <div className="hero-slide__status"><span /> Po telefonické domluvě</div>
                </div>
              </article>
            ))}
          </div>

          <div className="container hero-carousel__controls">
            <div className="hero-carousel__dots" role="tablist" aria-label="Výběr slidu">
              {slides.map((item, index) => (
                <button
                  key={item.eyebrow}
                  type="button"
                  className={`hero-dot ${index === activeSlide ? "hero-dot--active" : ""}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Zobrazit slide ${index + 1}`}
                  aria-selected={index === activeSlide}
                  role="tab"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
            <div className="hero-carousel__arrows">
              <button type="button" onClick={() => goToSlide(activeSlide - 1)} aria-label="Předchozí slide"><ChevronLeft size={19} /></button>
              <button type="button" onClick={() => goToSlide(activeSlide + 1)} aria-label="Další slide"><ChevronRight size={19} /></button>
            </div>
          </div>
        </section>

        <section className="intro-section section-pad reveal" id="o-nas">
          <div className="container intro-grid">
            <div className="intro-copy">
              <span className="eyebrow">B03 / K2 garage</span>
              <h2>Servis, na který se můžete obrátit.</h2>
              <p className="lead">K2 garage s.r.o. se stará o automobily i motocykly. Nabízíme servis, pneuservis, motoservis, detailing a další služby spojené s péčí o vůz.</p>
              <p>Pomůžeme také s výběrem automobilu. Vybraný vůz můžeme prověřit před koupí, ověřit jeho dostupné informace nebo zajistit jeho dovoz z ČR a okolních zemí.</p>
              <a className="text-link" href="#sluzby">Prozkoumat služby <ArrowRight size={17} /></a>
            </div>
            <div className="intro-highlights">
              <div className="intro-highlight"><span className="intro-highlight__icon"><Wrench size={18} /></span><div><strong>Automobily i motocykly</strong><span>Široká škála prací podle konkrétního stroje.</span></div></div>
              <div className="intro-highlight"><span className="intro-highlight__icon"><BadgeCheck size={18} /></span><div><strong>Praktická pomoc před koupí</strong><span>Srozumitelný pohled na stav vybraného vozu.</span></div></div>
              <div className="intro-highlight"><span className="intro-highlight__icon"><Clock3 size={18} /></span><div><strong>Po telefonické domluvě</strong><span>Po–Pá 8:00–17:00 · Přerov</span></div></div>
            </div>
          </div>
        </section>

        <section className="pre-purchase-section reveal" id="kontrola-vozu">
          <div className="pre-purchase-section__media">
            <img src="/assets/k2-hero-inspection.webp" alt="Technik kontroluje automobil před koupí" />
            <span className="image-stamp">K2 / CHECK</span>
          </div>
          <div className="pre-purchase-section__content">
            <span className="eyebrow eyebrow--accent">B04 / Kontrola vozu</span>
            <h2>Kupujete auto a nevíte, na co si dát pozor?</h2>
            <p className="lead">Technik za vybraným autem sám zajede, prohlédne ho a srozumitelně vám řekne, co zjistil.</p>
            <p>Nemusíte rozumět autům ani umět rozpoznat skryté závady. Kontrolu provedeme za vás a upozorníme na stav, který může ovlivnit vaše rozhodnutí i budoucí náklady na provoz.</p>
            <ul className="benefit-list">
              {benefits.map((benefit) => <li key={benefit}><CircleCheck size={17} /> {benefit}</li>)}
            </ul>
            <a className="button button--accent" href={PHONE_HREF}>Chci prověřit auto před koupí <ArrowRight size={17} /></a>
          </div>
        </section>

        <section className="services-section section-pad reveal" id="sluzby">
          <div className="container">
            <div className="section-heading section-heading--split">
              <div><span className="eyebrow">B05 / Co umíme</span><h2>Naše služby</h2></div>
              <p>Nabízíme širokou škálu prací pro automobily i motocykly. Pokud si nejste jistí, co přesně potřebujete, zavolejte nám a společně se domluvíme.</p>
            </div>
            <div className="services-grid">
              {services.map((service) => {
                const Icon = service.icon;
                return <a href={service.title === "Kontrola vozu" ? "#kontrola-vozu" : "#kontakt"} className="service-card reveal" key={service.number}>
                  <span className="service-card__number">{service.number}</span>
                  <span className="service-card__icon"><Icon size={23} strokeWidth={1.7} /></span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span className="service-card__arrow"><ArrowRight size={17} /></span>
                </a>;
              })}
            </div>
          </div>
        </section>

        <section className="process-section section-pad reveal">
          <div className="container">
            <div className="section-heading"><span className="eyebrow">B06 / Jednoduše</span><h2>Stačí zavolat a domluvíme se.</h2></div>
            <div className="process-grid">
              {processSteps.map((step) => <div className="process-step" key={step.number}><span className="process-step__number">{step.number}</span><div className="process-step__line" /><h3>{step.title}</h3><p>{step.text}</p></div>)}
            </div>
            <div className="process-cta"><span>Potřebujete poradit, co bude nejlepší?</span><a className="text-link text-link--light" href={PHONE_HREF}>Zavolat na {PHONE} <ArrowRight size={17} /></a></div>
          </div>
        </section>

        <section className="vehicle-sales-section section-pad reveal" id="prodej">
          <div className="container vehicle-sales-grid">
            <div><span className="eyebrow">B07 / Prodej vozidel</span><h2>Nabídku připravujeme.</h2><p className="lead">Aktuálně nemáme v nabídce konkrétní vozidla. Jakmile budou vozy k dispozici, každý z nich bude mít vlastní stránku s fotografiemi, popisem a důležitými informacemi.</p><a className="button button--dark" href={PHONE_HREF}>Ptejte se na telefonu <Phone size={16} /></a></div>
            <div className="vehicle-placeholder"><div className="vehicle-placeholder__top"><span>COMING SOON</span><span>2026</span></div><div className="vehicle-placeholder__mark">K2</div><p>Každý vůz<br />s vlastním příběhem.</p><ArrowDownRight className="vehicle-placeholder__arrow" size={30} /></div>
          </div>
        </section>

        <section className="vehicle-import-section section-pad reveal" id="dovoz">
          <div className="container">
            <div className="section-heading section-heading--split"><div><span className="eyebrow eyebrow--accent">B08 / Dovoz vozidel</span><h2>Hledáte konkrétní auto?</h2></div><p>Pomůžeme s výběrem vozidla v ČR i okolních zemích. Vůz vyhledáme, prověříme a domluvíme další postup včetně dovozu.</p></div>
            <div className="import-steps">{importSteps.map((step, index) => <div className="import-step" key={step.number}><span className="import-step__number">{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div>{index < importSteps.length - 1 && <ArrowRight className="import-step__arrow" size={20} />}</div>)}</div>
            <div className="import-bottom"><span>ČR a okolní země</span><a className="button button--accent" href={PHONE_HREF}>Nezávazně se zeptat <ArrowRight size={17} /></a></div>
          </div>
        </section>

        <section className="contact-cta-section reveal" id="kontakt">
          <div className="container contact-cta-section__inner"><div><span className="eyebrow eyebrow--accent">B09 / Kontakt</span><h2>Domluvme se na vašem voze.</h2><p>Potřebujete servis, kontrolu auta před koupí nebo radu s výběrem a dovozem vozidla? Zavolejte nám. První krok je jednoduchý.</p></div><a className="button button--accent button--large" href={PHONE_HREF}><Phone size={20} /> {PHONE}</a></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__grid">
          <div className="site-footer__brand"><a href="#top" className="brand brand--footer"><img className="brand__logo" src="/assets/K2-GARAGE-mlecna.webp" alt="K2 garage" /></a><p>Automobily, motocykly,<br />a pomoc před koupí.</p></div>
          <div><span className="footer-label">KONTAKT</span><a className="footer-phone" href={PHONE_HREF}>{PHONE}</a><a href="mailto:k2garage@seznam.cz">k2garage@seznam.cz</a><p>Po–Pá 8:00–17:00<br />po telefonické domluvě</p></div>
          <div><span className="footer-label">NAVIGACE</span><a href="#sluzby">Služby</a><a href="#kontrola-vozu">Kontrola vozu</a><a href="#prodej">Prodej vozidel</a><a href="#dovoz">Dovoz vozidel</a><div className="footer-socials" aria-label="Sociální sítě"><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><span className="social-fallback">f</span></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a></div></div>
          <div><span className="footer-label">FIRMA</span><p>K2 garage s.r.o.<br />IČO: 29956641<br />Svépomoc III 2044/21<br />Přerov</p></div>
        </div>
        <div className="container site-footer__bottom"><span>© 2026 K2 garage s.r.o.</span><span>Sídlo společnosti · dílna není na webu uvedena</span></div>
      </footer>

    </div>
  );
}
