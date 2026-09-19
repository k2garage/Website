import FloatingActions from "@/components/FloatingActions";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TurnstileWidget from "@/components/TurnstileWidget";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  ImagePlus,
  LoaderCircle,
  Phone,
  Send,
  Trash2,
} from "lucide-react";
import { type ChangeEvent, type FormEvent, useCallback, useEffect, useRef, useState } from "react";

const PHONE = "725 480 018";
const PHONE_HREF = "tel:+420725480018";
const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE_BYTES = 8 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

type PhotoPreview = {
  id: string;
  file: File;
  previewUrl: string;
};

type SubmissionState = "idle" | "sending" | "success" | "error";

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

function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 1024 * 1024 ? 1 : 2)} MB`;
}

export default function Reservation() {
  const [form, setForm] = useState<ReservationForm>(initialForm);
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [submissionError, setSubmissionError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState("");
  const photoUrls = useRef<string[]>([]);

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get("sluzba");
    const matchingService = serviceOptions.find((option) => option.value === requestedService);
    if (matchingService) {
      setForm((previous) => ({ ...previous, service: matchingService.value }));
    }
  }, []);

  useEffect(() => () => {
    photoUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const selectedService = serviceOptions.find((option) => option.value === form.service);

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileError = useCallback((message: string) => {
    setTurnstileError(message);
  }, []);

  const updateForm = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setSubmissionState("idle");
    setSubmissionError("");
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handlePhotoSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";
    setPhotoError("");
    setSubmissionState("idle");
    setSubmissionError("");

    if (!selectedFiles.length) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    if (remainingSlots <= 0) {
      setPhotoError(`Můžete přidat nejvýše ${MAX_PHOTOS} fotografií.`);
      return;
    }

    const validFiles = selectedFiles.filter((file) => ACCEPTED_PHOTO_TYPES.includes(file.type) && file.size <= MAX_PHOTO_SIZE_BYTES);
    const invalidFiles = selectedFiles.length - validFiles.length;
    const distinctFiles = validFiles.filter((file) => !photos.some((photo) => photo.file.name === file.name && photo.file.lastModified === file.lastModified));
    const filesToAdd = distinctFiles.slice(0, remainingSlots);

    if (invalidFiles > 0) {
      setPhotoError("Přidat lze pouze JPG, PNG nebo WEBP, každý soubor nejvýše 8 MB.");
    } else if (distinctFiles.length > remainingSlots) {
      setPhotoError(`Přidali jsme prvních ${remainingSlots} fotografií. Limit je ${MAX_PHOTOS} souborů.`);
    }

    const nextPhotos = filesToAdd.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      photoUrls.current.push(previewUrl);
      return { id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`, file, previewUrl };
    });
    setPhotos((previous) => [...previous, ...nextPhotos]);
  };

  const removePhoto = (id: string) => {
    setSubmissionState("idle");
    setPhotos((previous) => {
      const removed = previous.find((photo) => photo.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
        photoUrls.current = photoUrls.current.filter((url) => url !== removed.previewUrl);
      }
      return previous.filter((photo) => photo.id !== id);
    });
  };

  const clearPhotos = () => {
    photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    photoUrls.current = [];
    setPhotos([]);
  };

  const submitReservation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.service || submissionState === "sending") return;

    if (!turnstileToken) {
      setSubmissionState("error");
      setSubmissionError("Před odesláním potvrďte bezpečnostní ověření proti spamu.");
      return;
    }

    setSubmissionState("sending");
    setSubmissionError("");

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    payload.set("serviceLabel", selectedService?.label ?? "");
    payload.set("turnstileToken", turnstileToken);
    photos.forEach((photo) => payload.append("photos", photo.file));

    try {
      const response = await fetch(import.meta.env.VITE_RESERVATION_ENDPOINT ?? "/api/reservation", {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message ?? "Poptávku se zatím nepodařilo odeslat.");
      }

      setSubmissionState("success");
      setForm(initialForm);
      setTurnstileToken("");
      clearPhotos();
    } catch (error) {
      setSubmissionState("error");
      setSubmissionError(error instanceof Error ? error.message : "Poptávku se zatím nepodařilo odeslat.");
    }
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
            <p>Vyberte službu, doplňte podklady a případně přidejte fotografie. Ozveme se vám zpět s návrhem termínu i dalšího postupu.</p>
            <div className="reservation-hero__notice"><Clock3 size={20} /><span>Po–Pá 8:00–17:00 · po telefonické domluvě</span></div>
          </div>
        </section>

        <section className="reservation-form-section">
          <div className="container reservation-form-layout">
            <aside className="reservation-form-aside">
              <span className="section-kicker">Jak to funguje</span>
              <h2>Vyplníte.<br />Odešlete.</h2>
              <p>Poptávka se odešle přímo z webu. Fotografie závady nebo vozu pomohou připravit přesnější podklady ještě před prvním telefonátem.</p>
              <div className="reservation-form-aside__points">
                <span><CheckCircle2 size={17} /> Nezávazná poptávka</span>
                <span><CheckCircle2 size={17} /> Potvrzení termínu telefonicky</span>
                <span><CheckCircle2 size={17} /> Cena a rozsah předem</span>
              </div>
              <a className="reservation-form-aside__phone" href={PHONE_HREF}><Phone size={18} /> Raději zavolat: {PHONE}</a>
            </aside>

            <form className="reservation-form" onSubmit={submitReservation} encType="multipart/form-data">
              <input className="reservation-honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
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

              <fieldset className="reservation-fieldset reservation-photos">
                <legend>Fotografie k poptávce <span>Volitelné</span></legend>
                <p>Pomohou nám s rychlejší orientací. Přidejte nejvýše {MAX_PHOTOS} souborů ve formátu JPG, PNG nebo WEBP; každý do 8 MB.</p>
                <label className="reservation-photo-upload" htmlFor="photos">
                  <ImagePlus size={22} />
                  <span><strong>Přidat fotografie</strong><small>{photos.length}/{MAX_PHOTOS} vybráno</small></span>
                  <input id="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handlePhotoSelection} disabled={photos.length >= MAX_PHOTOS || submissionState === "sending"} />
                </label>
                {photoError && <p className="reservation-photo-error"><CircleAlert size={16} /> {photoError}</p>}
                {photos.length > 0 && <div className="reservation-photo-list" aria-live="polite">
                  {photos.map((photo) => <figure className="reservation-photo-preview" key={photo.id}>
                    <img src={photo.previewUrl} alt={`Náhled souboru ${photo.file.name}`} />
                    <figcaption><span title={photo.file.name}>{photo.file.name}</span><small>{formatFileSize(photo.file.size)}</small></figcaption>
                    <button type="button" onClick={() => removePhoto(photo.id)} aria-label={`Odebrat soubor ${photo.file.name}`}><Trash2 size={15} /></button>
                  </figure>)}
                </div>}
              </fieldset>

              <label className="reservation-consent"><input type="checkbox" required /><span>Souhlasím se zpracováním uvedených údajů pro vyřízení své poptávky.</span></label>

              <section className="reservation-turnstile" aria-label="Bezpečnostní ověření">
                <TurnstileWidget onToken={handleTurnstileToken} onError={handleTurnstileError} />
                {turnstileError && <p className="reservation-form__error"><CircleAlert size={17} /> {turnstileError}</p>}
              </section>

              <div className="reservation-form__submit">
                <button className="button button--accent button--large" type="submit" disabled={submissionState === "sending"}>
                  {submissionState === "sending" ? <LoaderCircle className="reservation-submit-loader" size={18} /> : <Send size={18} />}
                  {submissionState === "sending" ? "Odesíláme poptávku…" : "Odeslat poptávku"}
                </button>
                <span>Odešle se přímo z webu na K2 garage — bez otevření e-mailového klienta.</span>
              </div>
              {submissionState === "success" && <section className="reservation-form__success" role="status"><CheckCircle2 size={25} /><div><strong>Děkujeme, poptávku jsme přijali.</strong><p>Ozveme se vám co nejdříve s návrhem termínu a dalším postupem. Pokud je situace urgentní, zavolejte na <a href={PHONE_HREF}>{PHONE}</a>.</p></div></section>}
              {submissionState === "error" && <p className="reservation-form__error"><CircleAlert size={17} /> {submissionError} Pokud spěcháte, zavolejte na <a href={PHONE_HREF}>{PHONE}</a>.</p>}
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
      <FloatingActions />
    </div>
  );
}
