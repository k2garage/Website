import FloatingActions from "@/components/FloatingActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

const PHONE = "725 480 018";
const PHONE_HREF = "tel:+420725480018";
const EMAIL = "k2garage@seznam.cz";
const WHATSAPP_URL = "https://wa.me/420725480018?text=Dobr%C3%BD%20den%2C%20m%C3%A1m%20dotaz%20na%20K2%20garage.";

const faqs = [
  {
    question: "Jak se mohu objednat?",
    answer: "Nejrychlejší je zavolat na 725 480 018. Krátce probereme, co potřebujete řešit, a domluvíme další postup nebo vhodný termín.",
  },
  {
    question: "Kdy vám mohu zavolat?",
    answer: "Jsme k dispozici od pondělí do pátku mezi 8:00 a 17:00. Pracujeme po telefonické domluvě, proto doporučujeme zavolat předem.",
  },
  {
    question: "Servisujete auta i motorky?",
    answer: "Ano. Postaráme se o osobní automobily i motocykly — od běžného servisu přes pneumatiky až po řešení konkrétní závady.",
  },
  {
    question: "Jak probíhá kontrola vozu před koupí?",
    answer: "Technik za vybraným vozem sám přijede, zkontroluje jej a srozumitelně vám řekne, jaké závady nebo riziková místa našel. Pomůže vám rozhodnout se s jistotou.",
  },
  {
    question: "Pomůžete mi s dovozem vozidla?",
    answer: "Ano. Pomůžeme s hledáním vozu v ČR i okolních zemích, prověřením dostupných informací a domluvením dalšího postupu včetně dovozu.",
  },
  {
    question: "Kde najdu adresu dílny?",
    answer: "Na webu uvádíme pouze sídlo společnosti. Adresu dílny nezveřejňujeme; vše potřebné domluvíme telefonicky podle konkrétní služby a termínu.",
  },
];

export default function Contact() {
  return (
    <div className="contact-page" id="top">
      <SiteHeader />
      <main>
        <section className="contact-hero">
          <div className="contact-hero__line contact-hero__line--one" />
          <div className="contact-hero__line contact-hero__line--two" />
          <div className="container contact-hero__inner">
            <span className="section-kicker">Kontakt</span>
            <h1>Jsme na telefonu.<br />Domluvíme se.</h1>
            <p>Potřebujete servis, chcete prověřit auto před koupí nebo řešíte dovoz vozidla? Zavolejte nám — probereme, co bude pro váš vůz nejlepší.</p>
            <div className="contact-hero__actions">
              <a className="button button--accent" href={PHONE_HREF}><Phone size={18} /> Zavolat na {PHONE}</a>
              <a className="button button--ghost" href={`mailto:${EMAIL}`}><Mail size={18} /> Napsat e-mail</a>
            </div>
            <div className="contact-hero__availability"><CheckCircle2 size={17} /><span>Po–Pá 8:00–17:00 · po telefonické domluvě</span></div>
          </div>
        </section>

        <section className="contact-details">
          <div className="container contact-details__grid">
            <div className="contact-details__intro">
              <span className="section-kicker">Spojte se s námi</span>
              <h2>Vyberte si<br />nejrychlejší cestu.</h2>
              <p>Pro operativní domluvu doporučujeme telefon. Pokud potřebujete poslat podrobnosti, fotografie nebo nabídku vozu, napište nám e-mail.</p>
              <a className="contact-details__whatsapp" href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Napsat na WhatsApp</a>
            </div>

            <div className="contact-details__cards">
              <a className="contact-detail-card contact-detail-card--phone" href={PHONE_HREF}>
                <span className="contact-detail-card__icon"><Phone size={24} /></span>
                <span className="contact-detail-card__label">Telefon</span>
                <strong>{PHONE}</strong>
                <small>Pro objednání a rychlou domluvu</small>
              </a>
              <a className="contact-detail-card" href={`mailto:${EMAIL}`}>
                <span className="contact-detail-card__icon"><Mail size={24} /></span>
                <span className="contact-detail-card__label">E-mail</span>
                <strong>{EMAIL}</strong>
                <small>Pro podrobnější dotazy a podklady</small>
              </a>
              <div className="contact-detail-card">
                <span className="contact-detail-card__icon"><Clock3 size={24} /></span>
                <span className="contact-detail-card__label">Kdy jsme k dispozici</span>
                <strong>Po–Pá 8:00–17:00</strong>
                <small>Vždy po telefonické domluvě</small>
              </div>
              <div className="contact-detail-card contact-detail-card--registered-office">
                <span className="contact-detail-card__icon"><Building2 size={24} /></span>
                <span className="contact-detail-card__label">Pouze sídlo společnosti</span>
                <strong>Svépomoc III 2044/21<br />Přerov</strong>
                <small>Adresa dílny není na webu uvedena</small>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-faq">
          <div className="container contact-faq__grid">
            <div className="contact-faq__intro">
              <span className="section-kicker">FAQ</span>
              <h2>Časté otázky,<br />jasné odpovědi.</h2>
              <p>Nenašli jste odpověď? Zavolejte nám — rádi vám poradíme podle konkrétního vozu a situace.</p>
              <a className="button button--dark" href={PHONE_HREF}><Phone size={17} /> Zavolat do servisu</a>
            </div>

            <div className="faq-list">
              {faqs.map((faq) => (
                <details className="faq-item" key={faq.question}>
                  <summary><span>{faq.question}</span><ChevronDown size={20} aria-hidden="true" /></summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <FloatingActions />
    </div>
  );
}
