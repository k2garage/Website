import FloatingActions from "@/components/FloatingActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  LoaderCircle,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { type FormEvent, useState } from "react";

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
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
  const [formState, setFormState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("sending");
    setFormError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, sourcePage: "/kontakt" }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result?.data?.accepted !== true) throw new Error(result.error ?? "Zprávu se zatím nepodařilo odeslat.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
      setFormState("success");
    } catch (error) {
      setFormState("error");
      setFormError(error instanceof Error ? error.message : "Zprávu se zatím nepodařilo odeslat.");
    }
  };

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

        <section className="bg-[#edf1ef] py-20 sm:py-24">
          <div className="container grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
            <div>
              <span className="section-kicker">Napište nám</span>
              <h2 className="mt-5 text-[clamp(2.7rem,4.5vw,4.9rem)]">Pošlete dotaz.<br />Ozveme se zpět.</h2>
              <p className="mt-6 max-w-md text-[1rem] leading-7 text-[#626b65]">Pokud nejde o akutní záležitost, nechte nám na sebe kontakt. Zpráva se uloží přímo do naší schránky a přijde nám e-mailem.</p>
              <div className="mt-7 flex items-center gap-3 text-sm font-semibold text-[#47514c]"><span className="grid size-9 place-items-center rounded-xl border border-[#d9080c]/20 bg-[#d9080c]/8 text-[#d9080c]"><Mail size={17} /></span> Odpovídáme v pracovní době.</div>
            </div>
            <form onSubmit={submitContact} className="rounded-[24px] border border-[#d4dcd7] bg-white p-6 shadow-[0_16px_34px_rgba(30,41,36,.06)] sm:p-8">
              <input name="website" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[10000px] opacity-0" />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold uppercase tracking-[.08em] text-[#68726c]">Jméno *<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-xl border border-[#d7dfda] px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#1d2522] outline-none transition focus:border-[#d9080c] focus:ring-4 focus:ring-[#d9080c]/10" /></label>
                <label className="text-xs font-bold uppercase tracking-[.08em] text-[#68726c]">E-mail *<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full rounded-xl border border-[#d7dfda] px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#1d2522] outline-none transition focus:border-[#d9080c] focus:ring-4 focus:ring-[#d9080c]/10" /></label>
                <label className="text-xs font-bold uppercase tracking-[.08em] text-[#68726c]">Telefon<label className="ml-1 text-[10px] text-[#a4ada7]">(volitelné)</label><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="mt-2 w-full rounded-xl border border-[#d7dfda] px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#1d2522] outline-none transition focus:border-[#d9080c] focus:ring-4 focus:ring-[#d9080c]/10" /></label>
                <label className="text-xs font-bold uppercase tracking-[.08em] text-[#68726c]">Předmět<input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder="Např. Dotaz k vozidlu" className="mt-2 w-full rounded-xl border border-[#d7dfda] px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#1d2522] outline-none transition placeholder:text-[#a4ada7] focus:border-[#d9080c] focus:ring-4 focus:ring-[#d9080c]/10" /></label>
                <label className="text-xs font-bold uppercase tracking-[.08em] text-[#68726c] sm:col-span-2">Zpráva *<textarea required rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="S čím vám můžeme pomoci?" className="mt-2 w-full resize-y rounded-xl border border-[#d7dfda] px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#1d2522] outline-none transition placeholder:text-[#a4ada7] focus:border-[#d9080c] focus:ring-4 focus:ring-[#d9080c]/10" /></label>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4"><button disabled={formState === "sending"} className="inline-flex items-center gap-2 rounded-xl bg-[#d9080c] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#b6070a] disabled:opacity-70">{formState === "sending" ? <LoaderCircle className="animate-spin" size={17} /> : <Send size={17} />}{formState === "sending" ? "Odesíláme…" : "Odeslat zprávu"}</button>{formState === "success" && <p className="text-sm font-semibold text-emerald-700">Děkujeme, zpráva byla odeslána.</p>}{formState === "error" && <p className="max-w-sm text-sm font-semibold text-[#d9080c]">{formError}</p>}</div>
            </form>
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
