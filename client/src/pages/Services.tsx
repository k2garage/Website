import FloatingActions from "@/components/FloatingActions";
import { toast } from "sonner";
import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  CarFront,
  Check,
  Gauge,
  Instagram,
  Mail,
  Menu,
  Phone,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const PHONE = "725 480 018";
const PHONE_HREF = "tel:+420725480018";

const serviceGroups = [
  {
    icon: Wrench,
    title: "Autoservis",
    intro: "Běžná údržba, opravy a praktická péče o osobní automobily podle aktuálního stavu vozu.",
    items: ["Pravidelný servis a výměny provozních kapalin", "Brzdy, podvozek a základní mechanické opravy", "Kontrola před delší cestou nebo před sezónou", "Diagnostika závad a návrh dalšího postupu"],
  },
  {
    icon: Gauge,
    title: "Pneuservis",
    intro: "Pneumatiky a kola pro bezpečnou, klidnou a pohodlnou jízdu během celé sezóny.",
    items: ["Přezutí pneumatik a kontrola jejich stavu", "Vyvážení kol", "Kontrola opotřebení a doporučení vhodného řešení", "Příprava vozu na letní i zimní období"],
  },
  {
    icon: CarFront,
    title: "Motoservis",
    intro: "Údržba a servis motocyklů podle jejich stáří, stylu jízdy a konkrétního problému.",
    items: ["Základní pravidelný servis", "Kontrola brzd, řetězu a provozních částí", "Příprava motorky před sezónou", "Konzultace dalších oprav podle stavu stroje"],
  },
  {
    icon: Sparkles,
    title: "Detailing",
    intro: "Důkladná péče o vzhled vozu, když chcete autu vrátit čistotu, lesk a dobrý pocit z jízdy.",
    items: ["Hloubkové čištění interiéru", "Péče o lak a exteriér", "Oživení vzhledu vozu podle jeho stavu", "Individuální doporučení rozsahu péče"],
  },
  {
    icon: SearchCheck,
    title: "Kontrola vozu před koupí",
    intro: "Technik za vybraným autem přijede, projde jej a srozumitelně vysvětlí, co našel.",
    items: ["Kontrola konkrétního vybraného vozu", "Posouzení viditelných závad a rizikových míst", "Srozumitelné vysvětlení výsledku", "Podklad pro rozhodnutí, zda vůz koupit"],
  },
  {
    icon: ShieldCheck,
    title: "Ověření a dovoz vozidel",
    intro: "Pomoc při hledání, ověření a zajištění dalšího postupu u vozidel z ČR i okolních zemí.",
    items: ["Konzultace požadavků na vůz", "Prověření dostupných informací u vybrané nabídky", "Pomoc s hledáním vhodného vozidla", "Domluvení dalšího postupu včetně dovozu"],
  },
];

const formServices = serviceGroups.map((group) => group.title);

export default function Services() {
  const [selectedService, setSelectedService] = useState(formServices[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 36);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const showComingSoon = (page: string) => {
    closeMenu();
    toast(`${page} připravujeme`, {
      description: "Samostatnou stránku doplníme v další fázi webu.",
    });
  };

  const selectService = (service: string) => {
    setSelectedService(service);
    document.querySelector("#poptavka")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Poptávka z webu — ${data.get("service")}`;
    const body = [
      `Jméno: ${data.get("firstName")}`,
      `Příjmení: ${data.get("lastName")}`,
      `E-mail: ${data.get("email")}`,
      `Telefon: ${data.get("phone")}`,
      `Služba: ${data.get("service")}`,
      `Vůz: ${data.get("vehicle") || "neuvedeno"}`,
      `Poznámka: ${data.get("message") || "neuvedeno"}`,
    ].join("\n");

    toast("Otevíráme e-mailovou poptávku", {
      description: "Zkontrolujte prosím předvyplněný e-mail a odešlete jej ze své schránky.",
    });
    window.location.href = `mailto:k2garage@seznam.cz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="services-page" id="top">
      <header className={`site-header ${menuOpen ? "site-header--menu-open" : ""} ${isScrolled ? "site-header--scrolled" : ""}`}>
        <div className="container site-header__inner">
          <a href="/" className="brand" aria-label="K2 garage — úvod">
            <img className="brand__logo" src="/assets/K2-GARAGE-mlecna.webp" alt="K2 garage" />
          </a>

          <nav className={`site-nav ${menuOpen ? "site-nav--open" : ""}`} aria-label="Hlavní navigace">
            <a className="site-nav__link site-nav__link--active" href="/sluzby" onClick={closeMenu}>Služby</a>
            <a className="site-nav__link" href="/#o-nas" onClick={closeMenu}>O nás</a>
            <button className="site-nav__link" type="button" onClick={() => showComingSoon("Ceník")}>Ceník</button>
            <a className="site-nav__link" href="/#kontakt" onClick={closeMenu}>Kontakt</a>
            <button className="site-nav__link site-nav__reservation" type="button" onClick={() => showComingSoon("Rezervaci")}>Rezervace <ArrowRight size={15} /></button>
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

      <main>
        <section className="services-hero">
          <div className="services-hero__glow services-hero__glow--one" />
          <div className="services-hero__glow services-hero__glow--two" />
          <div className="container services-hero__inner">
            <p className="services-kicker">K2 garage · Přerov</p>
            <h1>Servisní úkony<br />bez zbytečných okolků.</h1>
            <p className="services-hero__lead">Vyberte oblast, která vás zajímá. Pokud si nejste jistí, zavolejte nám — společně probereme, co bude pro váš vůz nebo motorku nejlepší.</p>
            <div className="services-hero__actions">
              <a className="button button--accent" href={PHONE_HREF}><Phone size={17} /> Zavolat do servisu</a>
              <a className="button button--ghost" href="#poptavka"><Mail size={17} /> Napsat poptávku</a>
            </div>
          </div>
        </section>

        <section className="services-detail" id="prehled">
          <div className="container">
            <div className="services-detail__heading">
              <div><p className="section-kicker">Co pro vás umíme</p><h2>Vyberte si službu.</h2></div>
              <p>Každý vůz a každý problém je jiný. Berte tento přehled jako výchozí bod — konkrétní rozsah práce vždy domluvíme podle vašeho auta, motorky a situace.</p>
            </div>
            <div className="service-detail-grid">
              {serviceGroups.map((group) => {
                const Icon = group.icon;
                return (
                  <article className="service-detail-card" key={group.title}>
                    <div className="service-detail-card__top"><span className="service-detail-card__icon"><Icon size={25} strokeWidth={1.7} /></span><ArrowDownRight size={19} /></div>
                    <h3>{group.title}</h3>
                    <p>{group.intro}</p>
                    <ul>{group.items.map((item) => <li key={item}><Check size={15} strokeWidth={2.5} />{item}</li>)}</ul>
                    <button type="button" className="service-detail-card__action" onClick={() => selectService(group.title)}>Poptat tuto službu <ArrowDownRight size={16} /></button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="service-callout">
          <div className="container service-callout__inner">
            <BadgeCheck size={34} strokeWidth={1.5} />
            <div><h2>Nejste si jistí, co přesně potřebujete?</h2><p>To je v pořádku. Zavolejte nám, popište problém a domluvíme další krok.</p></div>
            <a className="button button--light" href={PHONE_HREF}><Phone size={17} /> {PHONE}</a>
          </div>
        </section>

        <section className="request-section" id="poptavka">
          <div className="container request-section__grid">
            <div className="request-section__copy">
              <p className="section-kicker">Poptávka služby</p>
              <h2>Napište nám<br />o svém voze.</h2>
              <p>Vyplňte několik základních informací. Po odeslání se otevře předvyplněný e-mail, který jen zkontrolujete a odešlete. Pro rychlou domluvu můžete samozřejmě rovnou zavolat.</p>
              <a className="request-section__phone" href={PHONE_HREF}><Phone size={21} /> {PHONE}</a>
              <span>Po–Pá 8:00–17:00 · po telefonické domluvě</span>
            </div>

            <form className="request-form" onSubmit={submitRequest}>
              <div className="request-form__row"><label>Jméno<input name="firstName" required autoComplete="given-name" /></label><label>Příjmení<input name="lastName" required autoComplete="family-name" /></label></div>
              <div className="request-form__row"><label>E-mail<input name="email" type="email" required autoComplete="email" /></label><label>Telefon<input name="phone" type="tel" required autoComplete="tel" /></label></div>
              <label>Služba<select name="service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)}>{formServices.map((service) => <option key={service} value={service}>{service}</option>)}</select></label>
              <label>Značka, model nebo rok vozu <span>(volitelné)</span><input name="vehicle" placeholder="Např. Škoda Octavia, 2018" /></label>
              <label>Poznámka <span>(volitelné)</span><textarea name="message" rows={4} placeholder="Stručně popište, co potřebujete řešit." /></label>
              <button className="button button--accent request-form__submit" type="submit">Otevřít e-mailovou poptávku <Mail size={17} /></button>
              <p>Odesláním formuláře se otevře vaše e-mailová schránka s připravenou zprávou.</p>
            </form>
          </div>
        </section>
      </main>
      <FloatingActions />
    </div>
  );
}
