import FloatingActions from "@/components/FloatingActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  Check,
  ChevronDown,
  Gauge,
  Phone,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

const PHONE = "725 480 018";
const PHONE_HREF = "tel:+420725480018";

const packages = [
  {
    icon: Gauge,
    title: "Sezónní kontrola",
    price: "od 990 Kč",
    description: "Základní prověření vozu před delší cestou nebo změnou sezóny.",
    points: ["Vizuální kontrola důležitých částí", "Kontrola provozních kapalin", "Doporučení dalšího postupu"],
    details: ["Kontrola pneumatik, brzd a základních provozních kapalin", "Vizuální kontrola podvozku a osvětlení", "Shrnutí zjištění a doporučení priorit"],
  },
  {
    icon: SearchCheck,
    title: "Kontrola vozu před koupí",
    price: "od 3 490 Kč",
    featured: true,
    description: "Technik přijede k vybranému vozu a srozumitelně vysvětlí, co našel.",
    points: ["Kontrola konkrétního vozu", "Závady a riziková místa", "Jasné doporučení před koupí"],
    details: ["Prohlídka exteriéru, interiéru a dostupných funkčních prvků", "Kontrola zjevných závad, stop po opravách a rizikových míst", "Vyhodnocení nálezu srozumitelně pro kupujícího"],
  },
  {
    icon: Sparkles,
    title: "Detailing interiéru",
    price: "od 2 490 Kč",
    description: "Důkladná péče pro čistší interiér a lepší pocit z každé jízdy.",
    points: ["Hloubkové čištění interiéru", "Péče podle stavu vozu", "Individuální rozsah práce"],
    details: ["Vysátí a hloubkové čištění dostupných povrchů", "Ošetření plastových a textilních částí podle jejich stavu", "Rozsah předem upravíme podle velikosti a znečištění vozu"],
  },
];

const priceGroups = [
  {
    icon: Wrench,
    title: "Autoservis",
    description: "Běžná údržba a opravy osobních automobilů.",
    items: [
      ["Diagnostika závady", "od 690 Kč"],
      ["Výměna oleje a filtru", "od 1 490 Kč"],
      ["Příprava vozu před sezónou", "od 990 Kč"],
    ],
  },
  {
    icon: Gauge,
    title: "Pneuservis",
    description: "Pneumatiky a kola pro bezpečnou jízdu v každé sezóně.",
    items: [
      ["Přezutí 4 kol včetně vyvážení", "od 1 290 Kč"],
      ["Vyvážení jednoho kola", "od 150 Kč"],
      ["Kontrola stavu pneumatik", "od 290 Kč"],
    ],
  },
  {
    icon: CarFront,
    title: "Motoservis",
    description: "Základní servis a kontrola motocyklů před i během sezóny.",
    items: [
      ["Základní kontrola motocyklu", "od 890 Kč"],
      ["Pravidelný servis", "od 1 490 Kč"],
      ["Příprava motorky před sezónou", "od 1 290 Kč"],
    ],
  },
  {
    icon: Sparkles,
    title: "Detailing",
    description: "Péče o vzhled interiéru, laku a exteriéru podle stavu vozu.",
    items: [
      ["Hloubkové čištění interiéru", "od 2 490 Kč"],
      ["Oživení laku a exteriéru", "od 3 490 Kč"],
      ["Individuální detailing", "dle rozsahu"],
    ],
  },
  {
    icon: SearchCheck,
    title: "Kontrola a ověření vozidel",
    description: "Více jistoty před koupí vybraného vozu.",
    items: [
      ["Kontrola vozu před koupí", "od 3 490 Kč"],
      ["Prověření vybrané nabídky", "od 1 990 Kč"],
      ["Rozšířená konzultace", "dle rozsahu"],
    ],
  },
  {
    icon: ShieldCheck,
    title: "Dovoz vozidel",
    description: "Pomoc s výběrem, ověřením a dalším postupem při dovozu.",
    items: [
      ["Úvodní konzultace požadavků", "dle rozsahu"],
      ["Prověření vozu před dovozem", "od 2 490 Kč"],
      ["Zajištění dovozu", "individuálně"],
    ],
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#edf1ef]" id="top">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(120deg,#111716_0%,#1d2724_56%,#121716_100%)] text-[#f7f2e9]">
          <div className="absolute inset-0 opacity-[.14] [background-image:linear-gradient(rgba(213,228,218,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(213,228,218,.2)_1px,transparent_1px)] [background-size:60px_60px] [mask-image:linear-gradient(90deg,#000,transparent_77%)]" />
          <div className="pointer-events-none absolute -right-40 -top-80 size-[54rem] rounded-full border border-[#d9080c]/35 shadow-[0_0_0_72px_rgba(217,8,12,.035),0_0_0_144px_rgba(217,8,12,.02)]" />
          <div className="container relative z-10 flex min-h-[600px] flex-col justify-center pt-32 pb-20">
            <span className="section-kicker text-[#d9080c]">Orientační ceník</span>
            <h1 className="mt-5 max-w-[860px] text-[clamp(3.35rem,6.6vw,6.4rem)] text-[#fff8ef]">Jasný přehled.<br />Zbytek domluvíme.</h1>
            <p className="mt-6 max-w-[620px] text-[1.08rem] leading-7 text-[#f7f2e9]/75">Ceny slouží jako orientační výchozí bod. Každý vůz i rozsah práce je jiný, proto konečnou cenu vždy potvrdíme předem po telefonické domluvě.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="button button--accent" href={PHONE_HREF}><Phone size={18} /> Zavolat na {PHONE}</a>
              <a className="button button--ghost" href="/rezervace">Přejít na rezervaci <ArrowRight size={18} /></a>
            </div>
          </div>
        </section>

        <section className="bg-[#edf1ef] py-20">
          <div className="container">
            <div className="grid gap-5 rounded-[26px] border border-[#d4dcd7] bg-white/70 p-6 shadow-[0_16px_34px_rgba(30,41,36,.05)] backdrop-blur-xl md:grid-cols-[auto_1fr_auto] md:items-center md:p-8">
              <span className="grid size-12 place-items-center rounded-2xl border border-[#d9080c]/20 bg-[#d9080c]/8 text-[#d9080c]"><BadgeCheck size={25} /></span>
              <div><h2 className="text-[clamp(1.9rem,2.7vw,3.15rem)]">Ceny od, vše předem jasné.</h2><p className="mt-2 max-w-3xl text-[#626b65]">Než se pustíme do práce, společně potvrdíme konkrétní rozsah i cenu. U individuálních položek se cena stanovuje podle typu vozu, stavu a náročnosti práce.</p></div>
              <a href={PHONE_HREF} className="inline-flex items-center gap-2 self-start text-sm font-extrabold uppercase tracking-[.06em] text-[#1a211f] transition-colors hover:text-[#d9080c] md:self-auto">Probrat cenu <ArrowRight size={18} /></a>
            </div>
          </div>
        </section>

        <section className="bg-[#edf1ef] pb-24">
          <div className="container">
            <div className="mb-10 grid gap-5 md:grid-cols-[1fr_.8fr] md:items-end">
              <div><span className="section-kicker">Doporučené balíčky</span><h2 className="mt-5 text-[clamp(2.75rem,4.5vw,5rem)]">Vybrané služby<br />na jednom místě.</h2></div>
              <p className="m-0 max-w-xl text-[#626b65]">Praktické orientační balíčky pro situace, které zákazníci řeší nejčastěji. Rozsah vždy upravíme podle vašeho vozu.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {packages.map((pack) => {
                const Icon = pack.icon;
                return (
                  <article key={pack.title} className={`relative flex min-h-[390px] flex-col overflow-hidden rounded-[24px] border p-7 shadow-[0_14px_30px_rgba(30,41,36,.04)] transition-transform duration-300 hover:-translate-y-1 ${pack.featured ? "border-[#d9080c] bg-[#242a28] text-[#f7f2e9] shadow-[0_22px_42px_rgba(30,41,36,.18)]" : "border-[#d4dcd7] bg-white/75 text-[#1d2522]"}`}>
                    {pack.featured && <span className="absolute right-6 top-6 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[.65rem] font-bold uppercase tracking-[.1em] text-white">Doporučujeme</span>}
                    <span className={`grid size-12 place-items-center rounded-2xl border ${pack.featured ? "border-white/18 bg-[#d9080c]/20 text-[#ff6a6d]" : "border-[#d9080c]/20 bg-[#d9080c]/8 text-[#d9080c]"}`}><Icon size={24} /></span>
                    <h3 className="mt-10 text-[2rem]">{pack.title}</h3>
                    <p className={`mt-3 max-w-sm text-sm leading-6 ${pack.featured ? "text-[#f7f2e9]/68" : "text-[#68726c]"}`}>{pack.description}</p>
                    <ul className={`my-6 grid gap-2.5 p-0 text-[.78rem] leading-5 ${pack.featured ? "text-[#f7f2e9]/78" : "text-[#414a46]"}`}>
                      {pack.points.map((point) => <li key={point} className="flex gap-2"><Check className="mt-0.5 shrink-0 text-[#d9080c]" size={15} strokeWidth={2.5} />{point}</li>)}
                    </ul>
                    <details className={`group mb-6 rounded-xl border ${pack.featured ? "border-white/14 bg-white/[.04]" : "border-[#dce2de] bg-white/55"}`}>
                      <summary className={`flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-[var(--font-display)] text-[.78rem] font-black uppercase tracking-[.055em] ${pack.featured ? "text-[#fff8ef]" : "text-[#1d2522]"}`}><span>Detail balíčku</span><ChevronDown className="shrink-0 text-[#d9080c] transition-transform duration-200 group-open:rotate-180" size={17} /></summary>
                      <ul className={`grid gap-2 border-t px-4 py-3 text-[.76rem] leading-5 ${pack.featured ? "border-white/12 text-[#f7f2e9]/72" : "border-[#dce2de] text-[#58615c]"}`}>{pack.details.map((detail) => <li className="flex gap-2" key={detail}><Check className="mt-0.5 shrink-0 text-[#d9080c]" size={14} strokeWidth={2.5} />{detail}</li>)}</ul>
                    </details>
                    <div className={`mt-auto border-t pt-5 ${pack.featured ? "border-white/14" : "border-[#dce2de]"}`}><span className="font-mono text-[.7rem] font-bold uppercase tracking-[.1em] text-[#d9080c]">Cena</span><strong className="mt-1 block font-[var(--font-display)] text-[2rem] font-black tracking-[-.045em]">{pack.price}</strong></div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f3ec] py-24">
          <div className="container">
            <div className="mb-10 grid gap-5 md:grid-cols-[1fr_.8fr] md:items-end">
              <div><span className="section-kicker">Jednotlivé služby</span><h2 className="mt-5 text-[clamp(2.75rem,4.5vw,5rem)]">Ceny podle<br />typu práce.</h2></div>
              <p className="m-0 max-w-xl text-[#626b65]">Pokud zde nenajdete přesně to, co řešíte, zavolejte nám. Připravíme konkrétní postup a orientační rozpočet pro váš vůz.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {priceGroups.map((group) => {
                const Icon = group.icon;
                return (
                  <article key={group.title} className="rounded-[24px] border border-[#ded8ce] bg-white/65 p-6 shadow-[0_12px_28px_rgba(57,49,38,.04)] transition-transform duration-300 hover:-translate-y-1 md:p-7">
                    <div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[#d9080c]/20 bg-[#d9080c]/8 text-[#d9080c]"><Icon size={24} /></span><div><h3 className="text-[1.85rem]">{group.title}</h3><p className="mt-2 text-sm leading-6 text-[#68726c]">{group.description}</p></div></div>
                    <dl className="mt-6 divide-y divide-[#ded8ce] border-t border-[#ded8ce]">
                      {group.items.map(([service, price]) => <div key={service} className="flex items-start justify-between gap-6 py-4"><dt className="text-[.88rem] leading-5 text-[#39423e]">{service}</dt><dd className="shrink-0 font-[var(--font-display)] text-[1rem] font-black tracking-[-.03em] text-[#17191a]">{price}</dd></div>)}
                    </dl>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#242a28] py-20 text-[#f7f2e9]">
          <div className="container flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div><span className="section-kicker text-[#d9080c]">Nejste si jistí rozsahem?</span><h2 className="mt-5 max-w-3xl text-[clamp(2.35rem,4vw,4.5rem)] text-[#f7f2e9]">Zavolejte nám.<br />Cenu probereme spolu.</h2></div>
            <a className="button button--accent button--large shrink-0" href={PHONE_HREF}><Phone size={19} /> {PHONE}</a>
          </div>
        </section>
      </main>
      <SiteFooter />
      <FloatingActions />
    </div>
  );
}
