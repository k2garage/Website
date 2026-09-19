import FloatingActions from "@/components/FloatingActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  ArrowDownRight,
  BadgeCheck,
  CalendarClock,
  CarFront,
  Check,
  Gauge,
  Mail,
  Phone,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

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

export default function Services() {
  return (
    <div className="services-page" id="top">
      <SiteHeader />
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
              <a className="button button--ghost" href="/rezervace"><Mail size={17} /> Přejít na rezervaci</a>
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
                    <a href="/rezervace" className="service-detail-card__action">Přejít na rezervaci <ArrowDownRight size={16} /></a>
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

        <section className="reservation-cta-section">
          <div className="container reservation-cta-section__inner">
            <span className="section-kicker">Rezervace</span>
            <h2>Chcete si domluvit termín?</h2>
            <p>Stránku pro online rezervaci připravujeme. Prozatím zde najdete jednoduchý přehled a možnost zavolat přímo do servisu.</p>
            <a className="button button--accent" href="/rezervace"><CalendarClock size={18} /> Přejít na rezervaci</a>
          </div>
        </section>
      </main>
      <SiteFooter />
      <FloatingActions />
    </div>
  );
}
