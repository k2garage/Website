import FloatingActions from "@/components/FloatingActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { CalendarClock, Phone } from "lucide-react";

const PHONE = "725 480 018";
const PHONE_HREF = "tel:+420725480018";

export default function Reservation() {
  return (
    <div className="reservation-page" id="top">
      <SiteHeader />
      <main>
        <section className="reservation-hero">
          <div className="reservation-hero__ring" />
          <div className="container reservation-hero__inner">
            <span className="section-kicker">Rezervace</span>
            <h1>Online rezervaci<br />právě připravujeme.</h1>
            <p>Zatím se s námi můžete domluvit telefonicky. Rezervační formulář a výběr služby doplníme v další fázi webu.</p>
            <a className="button button--accent" href={PHONE_HREF}><Phone size={18} /> Zavolat na {PHONE}</a>
            <div className="reservation-hero__notice"><CalendarClock size={20} /><span>Po–Pá 8:00–17:00 · po telefonické domluvě</span></div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <FloatingActions />
    </div>
  );
}
