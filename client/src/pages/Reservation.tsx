import FloatingActions from "@/components/FloatingActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";

const PHONE = "725 480 018";
const PHONE_HREF = "tel:+420725480018";
const RECIPIENT = "k2garage@seznam.cz";

type Service =
  | "autoservis"
  | "pneuservis"
  | "motoservis"
  | "detailing"
  | "kontrola"
  | "overeni"
  | "dovoz";

type ReservationForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: Service | "";
  brand: string;
  model: string;
  year: string;
  vin: string;
  tyreSize: string;
  vehicleLink: string;
  country: string;
  preferredDate: string;
  note: string;
};

const serviceOptions: Array<{ value: Service; label: string; hint: string }> = [
  { value: "autoservis", label: "Autoservis", hint: "Běžný servis, diagnostika nebo konkrétní závada" },
  { value: "pneuservis", label: "Pneuservis", hint: "Přezutí, vyvážení nebo kontrola pneumatik" },
  { value: "motoservis", label: "Motoservis", hint: "Servis a péče o motocykl" },
  { value: "detailing", label: "Detailing", hint: "Interiér, lak nebo individuální péče" },
  { value: "kontrola", label: "Kontrola vozu před koupí", hint: "Kontrola konkrétního vozu přímo na místě" },
  { value: "overeni", label: "Ověření vozidla", hint: "Prověření nabídky nebo dostupných informací" },
  { value: "dovoz", label: "Dovoz vozidla", hint: "Pomoc s výběrem, prověřením a dovozem" },
];

const initialForm: ReservationForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  service: "",
  brand: "",
  model: "",
  year: "",
  vin: "",
  tyreSize: "",
  vehicleLink: "",
  country: "",
  preferredDate: "",
  note: "",
};

function FieldLabel({ children, htmlFor, optional = false }: { children: string; htmlFor: string; optional?: boolean }) {
  return <label className="reservation-label" htmlFor={htmlFor}>{children}{optional && <span>Volitelné</span>}</label>;
}

export default function Reservation() {
  const [form, setForm] = useState<ReservationForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get("sluzba");
    const matchingService = serviceOptions.find((option) => option.value === requestedService);
    if (matchingService) {
      setForm((previous) => ({ ...previous, service: matchingService.value }));
    }
  }, []);

  const selectedService = serviceOptions.find((option) => option.value === form.service);

  const updateForm = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setSubmitted(false);
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const submitReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.service) return;

    const lines = [
      `Jméno: ${form.firstName} ${form.lastName}`,
      `E-mail: ${form.email}`,
      `Telefon: ${form.phone}`,
      `Služba: ${selectedService?.label ?? ""}`,
      form.brand ? `Značka: ${form.brand}` : "",
      form.model ? `Model: ${form.model}` : "",
      form.year ? `Rok výroby: ${form.year}` : "",
      form.vin ? `VIN: ${form.vin}` : "",
      form.tyreSize ? `Rozměr pneumatik: ${form.tyreSize}` : "",
      form.vehicleLink ? `Odkaz na vozidlo: ${form.vehicleLink}` : "",
      form.country ? `Země původu: ${form.country}` : "",
      form.preferredDate ? `Preferovaný termín: ${form.preferredDate}` : "",
      form.note ? `Poznámka: ${form.note}` : "",
    ].filter(Boolean);

    const subject = encodeURIComponent(`Poptávka — ${selectedService?.label ?? "K2 garage"}`);
    const body = encodeURIComponent(`Dobrý den,\n\nrád/a bych se objednal/a do K2 garage.\n\n${lines.join("\n")}\n\nDěkuji.`);
    window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const needsVehicle = ["autoservis", "pneuservis", "motoservis", "detailing", "kontrola", "overeni"].includes(form.service);
  const needsVin = ["autoservis", "motoservis", "kontrola", "overeni"].includes(form.service);

  return (
    <div className="reservation-page" id="top">
      <SiteHeader />
      <main>
        <section className="reservation-hero reservation-hero--form">
          <div className="reservation-hero__ring" />
          <div className="container reservation-hero__inner">
            <span className="section-kicker">Rezervace</span>
            <h1>Řekněte nám,<br />co potřebujete.</h1>
            <p>Vyberte službu a doplňte základní informace. Připravíme si podklady, ozveme se vám a domluvíme konkrétní termín i další postup.</p>
            <div className="reservation-hero__notice"><Clock3 size={20} /><span>Po–Pá 8:00–17:00 · po telefonické domluvě</span></div>
          </div>
        </section>

        <section className="reservation-form-section">
          <div className="container reservation-form-layout">
            <aside className="reservation-form-aside">
              <span className="section-kicker">Jak to funguje</span>
              <h2>Vyplníte.<br />Domluvíme.</h2>
              <p>Formulář otevře předvyplněný e-mailový koncept na naši adresu. Díky tomu budete přesně vědět, co odesíláte, a my dostaneme všechny důležité informace najednou.</p>
              <div className="reservation-form-aside__points">
                <span><CheckCircle2 size={17} /> Nezávazná poptávka</span>
                <span><CheckCircle2 size={17} /> Potvrzení termínu telefonicky</span>
                <span><CheckCircle2 size={17} /> Cena a rozsah předem</span>
              </div>
              <a className="reservation-form-aside__phone" href={PHONE_HREF}><Phone size={18} /> Raději zavolat: {PHONE}</a>
            </aside>

            <form className="reservation-form" onSubmit={submitReservation}>
              <div className="reservation-form__topline"><div><span className="section-kicker">Poptávka</span><h2>Rezervační formulář</h2></div><CalendarDays size={28} /></div>

              <fieldset className="reservation-fieldset">
                <legend>Kontaktní údaje</legend>
                <div className="reservation-form__grid reservation-form__grid--two">
                  <div><FieldLabel htmlFor="firstName">Jméno</FieldLabel><input id="firstName" name="firstName" value={form.firstName} onChange={updateForm} required autoComplete="given-name" /></div>
                  <div><FieldLabel htmlFor="lastName">Příjmení</FieldLabel><input id="lastName" name="lastName" value={form.lastName} onChange={updateForm} required autoComplete="family-name" /></div>
                  <div><FieldLabel htmlFor="email">E-mail</FieldLabel><input id="email" name="email" type="email" value={form.email} onChange={updateForm} required autoComplete="email" /></div>
                  <div><FieldLabel htmlFor="phone">Telefon</FieldLabel><input id="phone" name="phone" type="tel" value={form.phone} onChange={updateForm} required autoComplete="tel" /></div>
                </div>
              </fieldset>

              <fieldset className="reservation-fieldset">
                <legend>Jakou službu řešíte?</legend>
                <div className="reservation-service-picker">
                  {serviceOptions.map((option) => (
                    <label className={`reservation-service-option ${form.service === option.value ? "reservation-service-option--active" : ""}`} key={option.value}>
                      <input type="radio" name="service" value={option.value} checked={form.service === option.value} onChange={updateForm} required />
                      <span><strong>{option.label}</strong><small>{option.hint}</small></span>
                      <ChevronRight size={18} />
                    </label>
                  ))}
                </div>
              </fieldset>

              {form.service && <fieldset className="reservation-fieldset reservation-fieldset--dynamic">
                <legend>Podrobnosti k vybrané službě</legend>
                <p className="reservation-dynamic-hint">{selectedService?.hint}</p>

                {needsVehicle && <div className="reservation-form__grid reservation-form__grid--three">
                  <div><FieldLabel htmlFor="brand">Značka</FieldLabel><input id="brand" name="brand" value={form.brand} onChange={updateForm} required /></div>
                  <div><FieldLabel htmlFor="model">Model</FieldLabel><input id="model" name="model" value={form.model} onChange={updateForm} required /></div>
                  <div><FieldLabel htmlFor="year" optional>Rok výroby</FieldLabel><input id="year" name="year" inputMode="numeric" value={form.year} onChange={updateForm} /></div>
                </div>}

                {form.service === "pneuservis" && <div className="reservation-form__grid reservation-form__grid--two"><div><FieldLabel htmlFor="tyreSize">Rozměr pneumatik</FieldLabel><input id="tyreSize" name="tyreSize" placeholder="Např. 225/45 R17" value={form.tyreSize} onChange={updateForm} required /></div><div><FieldLabel htmlFor="preferredDate" optional>Preferovaný termín</FieldLabel><input id="preferredDate" name="preferredDate" type="date" value={form.preferredDate} onChange={updateForm} /></div></div>}

                {needsVin && <div className="reservation-form__grid reservation-form__grid--two"><div><FieldLabel htmlFor="vin" optional>VIN</FieldLabel><input id="vin" name="vin" value={form.vin} onChange={updateForm} maxLength={17} /></div>{form.service !== "kontrola" && form.service !== "overeni" && <div><FieldLabel htmlFor="preferredDate" optional>Preferovaný termín</FieldLabel><input id="preferredDate" name="preferredDate" type="date" value={form.preferredDate} onChange={updateForm} /></div>}</div>}

                {(form.service === "kontrola" || form.service === "overeni") && <div className="reservation-form__grid reservation-form__grid--two"><div><FieldLabel htmlFor="vehicleLink" optional>Odkaz na vozidlo / inzerát</FieldLabel><input id="vehicleLink" name="vehicleLink" type="url" placeholder="https://" value={form.vehicleLink} onChange={updateForm} /></div><div><FieldLabel htmlFor="preferredDate" optional>Preferovaný termín kontroly</FieldLabel><input id="preferredDate" name="preferredDate" type="date" value={form.preferredDate} onChange={updateForm} /></div></div>}

                {form.service === "dovoz" && <div className="reservation-form__grid reservation-form__grid--two"><div><FieldLabel htmlFor="country">Země původu</FieldLabel><input id="country" name="country" placeholder="ČR, Německo, Rakousko…" value={form.country} onChange={updateForm} required /></div><div><FieldLabel htmlFor="preferredDate" optional>Preferovaný termín</FieldLabel><input id="preferredDate" name="preferredDate" type="date" value={form.preferredDate} onChange={updateForm} /></div></div>}

                <div className="reservation-form__grid"><div><FieldLabel htmlFor="note" optional>Co potřebujete vyřešit?</FieldLabel><textarea id="note" name="note" rows={5} value={form.note} onChange={updateForm} placeholder="Popište stručně závadu, požadavek nebo další důležité informace." /></div></div>
              </fieldset>}

              <div className="reservation-form__submit">
                <button className="button button--accent button--large" type="submit"><Send size={18} /> Připravit e-mail s poptávkou</button>
                <span><Mail size={16} /> Otevře se e-mailový koncept na {RECIPIENT}</span>
              </div>
              {submitted && <p className="reservation-form__success"><CheckCircle2 size={17} /> E-mailový koncept je připravený. Po jeho odeslání se vám ozveme zpět.</p>}
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
      <FloatingActions />
    </div>
  );
}
