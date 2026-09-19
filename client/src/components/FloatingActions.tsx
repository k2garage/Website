import { ArrowUp, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const WHATSAPP_URL = "https://wa.me/420725480018?text=Dobr%C3%BD%20den%2C%20m%C3%A1m%20z%C3%A1jem%20o%20slu%C5%BEby%20K2%20garage.";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 420);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="floating-actions" aria-label="Rychlé kontaktní akce">
      <a
        className="floating-action floating-action--whatsapp"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Napsat přes WhatsApp"
        title="Napsat přes WhatsApp"
      >
        <MessageCircle size={21} strokeWidth={2.1} />
      </a>
      <a
        className={`floating-action floating-action--top ${showTop ? "floating-action--visible" : ""}`}
        href="#top"
        aria-label="Zpět nahoru"
        title="Zpět nahoru"
      >
        <ArrowUp size={20} strokeWidth={2.1} />
      </a>
    </div>
  );
}
