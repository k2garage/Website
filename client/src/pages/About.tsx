import FloatingActions from "@/components/FloatingActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  ArrowRight,
  CarFront,
  CheckCircle2,
  Compass,
  Phone,
  SearchCheck,
  Wrench,
} from "lucide-react";
import { Link } from "wouter";

const PHONE = "725 480 018";
const PHONE_HREF = "tel:+420725480018";

const principles = [
  {
    title: "Mluvíme srozumitelně",
    description: "Řekneme, co jsme našli, co má přednost a co může počkat. Bez zbytečného technického žargonu a bez nátlaku.",
  },
  {
    title: "Nejdřív zjistíme příčinu",
    description: "Nechceme jen měnit díly naslepo. Nejdřív hledáme souvislosti a pak společně domluvíme rozumný další krok.",
  },
  {
    title: "Respektujeme váš čas i rozpočet",
    description: "Rozsah práce i orientační cenu řešíme dopředu. U zakázek, které se mohou během práce změnit, vás včas informujeme.",
  },
];

const team = [
  {
    icon: Wrench,
    role: "Servis a diagnostika",
    description: "Běžná údržba, hledání závad i péče o auta a motorky — od každodenního provozu až po specifické potřeby vozu.",
  },
  {
    icon: SearchCheck,
    role: "Kontrola vozidel",
    description: "Před koupí dokážeme prověřit vybraný vůz přímo na místě a vysvětlit jeho skutečný stav člověku, který autům nemusí rozumět.",
  },
  {
    icon: Compass,
    role: "Výběr a dovoz",
    description: "Pomůžeme převést vaše požadavky do konkrétního vozu, prověřit dostupné možnosti a navrhnout rozumný postup dovozu.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#edf1ef]" id="top">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(120deg,#111716_0%,#1d2724_56%,#121716_100%)] text-[#f7f2e9]">
          <div className="absolute inset-0 opacity-[.14] [background-image:linear-gradient(rgba(213,228,218,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(213,228,218,.2)_1px,transparent_1px)] [background-size:60px_60px] [mask-image:linear-gradient(90deg,#000,transparent_77%)]" />
          <div className="pointer-events-none absolute -right-40 -top-80 size-[54rem] rounded-full border border-[#d9080c]/35 shadow-[0_0_0_72px_rgba(217,8,12,.035),0_0_0_144px_rgba(217,8,12,.02)]" />
          <div className="container relative z-10 flex min-h-[610px] flex-col justify-center pt-32 pb-20">
            <span className="section-kicker text-[#d9080c]">O nás</span>
            <h1 className="mt-5 max-w-[900px] text-[clamp(3.35rem,6.6vw,6.4rem)] text-[#fff8ef]">Poctivá práce.<br />Jasná domluva.</h1>
            <p className="mt-6 max-w-[630px] text-[1.08rem] leading-7 text-[#f7f2e9]/75">K2 garage je pro každého, kdo chce rozumět stavu svého auta nebo motorky a ví, že dobrý servis začíná otevřenou komunikací.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="button button--accent" href="/rezervace">Domluvit termín <ArrowRight size={18} /></Link>
              <a className="button button--ghost" href={PHONE_HREF}><Phone size={18} /> Zavolat nám</a>
            </div>
          </div>
        </section>

        <section className="bg-[#edf1ef] py-24">
          <div className="container grid gap-12 lg:grid-cols-[.84fr_1.16fr] lg:items-start">
            <div className="lg:sticky lg:top-32">
              <span className="section-kicker">Náš přístup</span>
              <h2 className="mt-5 text-[clamp(2.75rem,4.5vw,5rem)]">Servis, který<br />dává smysl.</h2>
            </div>
            <div className="space-y-7 text-[1.04rem] leading-8 text-[#3f4843]">
              <p className="m-0">V K2 garage se staráme o automobily i motocykly. Vedle běžného servisu pomáháme také s kontrolou vozu před koupí, ověřením dostupných informací a dovozem vozidel z ČR i okolních zemí.</p>
              <p className="m-0">Nejdůležitější pro nás je, aby zákazník věděl, co se s jeho vozem děje. Proto přednostně vysvětlíme stav, navrhneme možnosti řešení a domluvíme se, co má skutečně smysl udělat.</p>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[20px] border border-[#d4dcd7] bg-white/70 p-5 shadow-[0_12px_28px_rgba(30,41,36,.04)]"><CarFront className="text-[#d9080c]" size={24} /><strong className="mt-5 block font-[var(--font-display)] text-[1.45rem] font-black tracking-[-.045em] text-[#1d2522]">Auta i motorky</strong><span className="mt-2 block text-sm leading-5 text-[#6b746f]">Každý vůz řešíme podle skutečné potřeby.</span></div>
                <div className="rounded-[20px] border border-[#d4dcd7] bg-white/70 p-5 shadow-[0_12px_28px_rgba(30,41,36,.04)]"><CheckCircle2 className="text-[#d9080c]" size={24} /><strong className="mt-5 block font-[var(--font-display)] text-[1.45rem] font-black tracking-[-.045em] text-[#1d2522]">Bez zkratek</strong><span className="mt-2 block text-sm leading-5 text-[#6b746f]">Jasná domluva před zahájením práce.</span></div>
                <div className="rounded-[20px] border border-[#d4dcd7] bg-white/70 p-5 shadow-[0_12px_28px_rgba(30,41,36,.04)]"><Phone className="text-[#d9080c]" size={24} /><strong className="mt-5 block font-[var(--font-display)] text-[1.45rem] font-black tracking-[-.045em] text-[#1d2522]">Na telefonu</strong><span className="mt-2 block text-sm leading-5 text-[#6b746f]">Po–Pá 8:00–17:00 po domluvě.</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f3ec] py-24">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-[1fr_.8fr] md:items-end">
              <div><span className="section-kicker">Jak pracujeme</span><h2 className="mt-5 text-[clamp(2.75rem,4.5vw,5rem)]">Víte, na čem<br />jste.</h2></div>
              <p className="m-0 max-w-xl text-[#626b65]">Přístup, který oceníte při běžné údržbě i ve chvíli, kdy řešíte důležitější rozhodnutí kolem vozu.</p>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {principles.map((principle) => (
                <article key={principle.title} className="rounded-[24px] border border-[#ded8ce] bg-white/70 p-7 shadow-[0_12px_28px_rgba(57,49,38,.04)] transition-transform duration-300 hover:-translate-y-1">
                  <span className="grid size-11 place-items-center rounded-2xl border border-[#d9080c]/20 bg-[#d9080c]/8 font-[var(--font-display)] text-xl font-black text-[#d9080c]">✓</span>
                  <h3 className="mt-8 text-[2rem]">{principle.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#68726c]">{principle.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#242a28] py-24 text-[#f7f2e9]">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-[1fr_.8fr] md:items-end">
              <div><span className="section-kicker text-[#d9080c]">Náš tým</span><h2 className="mt-5 max-w-3xl text-[clamp(2.75rem,4.5vw,5rem)] text-[#f7f2e9]">Tři oblasti.<br />Jeden přístup.</h2></div>
              <p className="m-0 max-w-xl text-[#aeb8b1]">Při každé zakázce stojí za K2 garage kombinace praktické servisní práce, pečlivého prověření a férové domluvy.</p>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {team.map((member) => {
                const Icon = member.icon;
                return <article key={member.role} className="rounded-[24px] border border-white/12 bg-white/[.04] p-7 transition-transform duration-300 hover:-translate-y-1 hover:bg-white/[.07]"><span className="grid size-12 place-items-center rounded-2xl border border-[#d9080c]/35 bg-[#d9080c]/12 text-[#ff6a6d]"><Icon size={24} /></span><h3 className="mt-9 text-[2rem] text-[#fff8ef]">{member.role}</h3><p className="mt-4 text-sm leading-6 text-[#b6c0b9]">{member.description}</p></article>;
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#edf1ef] py-20">
          <div className="container flex flex-col items-start justify-between gap-7 rounded-[28px] border border-[#d4dcd7] bg-white/70 p-8 shadow-[0_16px_34px_rgba(30,41,36,.05)] md:flex-row md:items-center md:p-12">
            <div><span className="section-kicker">Pojďme se domluvit</span><h2 className="mt-5 text-[clamp(2.35rem,4vw,4.5rem)]">Máte otázku<br />k vašemu vozu?</h2></div>
            <Link className="button button--accent button--large shrink-0" href="/rezervace">Přejít na rezervaci <ArrowRight size={19} /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <FloatingActions />
    </div>
  );
}
