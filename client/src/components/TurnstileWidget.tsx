import { ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TURNSTILE_SITE_KEY = "0x4AAAAAAE9L8_1SGG8684A8";
const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type TurnstileWidgetProps = {
  onToken: (token: string) => void;
  onError: (message: string) => void;
};

export default function TurnstileWidget({ onToken, onError }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "light",
        appearance: "always",
        callback: (token: string) => {
          onToken(token);
          onError("");
          setStatus("ready");
        },
        "expired-callback": () => {
          onToken("");
          onError("Bezpečnostní ověření vypršelo. Potvrďte ho prosím znovu.");
        },
        "error-callback": () => {
          onToken("");
          setStatus("error");
          onError("Bezpečnostní ověření se nepodařilo načíst. Obnovte stránku nebo nám zavolejte.");
        },
      });
      setStatus("ready");
    };

    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    if (window.turnstile) {
      renderWidget();
    } else if (existingScript) {
      existingScript.addEventListener("load", renderWidget, { once: true });
      existingScript.addEventListener("error", () => {
        setStatus("error");
        onError("Bezpečnostní ověření se nepodařilo načíst. Obnovte stránku nebo nám zavolejte.");
      }, { once: true });
    } else {
      const script = document.createElement("script");
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", renderWidget, { once: true });
      script.addEventListener("error", () => {
        setStatus("error");
        onError("Bezpečnostní ověření se nepodařilo načíst. Obnovte stránku nebo nám zavolejte.");
      }, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, [onError, onToken]);

  return (
    <div className="turnstile-widget" aria-live="polite">
      <div className="turnstile-widget__heading"><ShieldCheck size={18} /><span>Ověření proti spamu</span></div>
      <div ref={containerRef} className="turnstile-widget__frame" />
      {status === "loading" && <p>Načítáme bezpečnostní ověření…</p>}
      {status === "error" && <p className="turnstile-widget__error">Ověření se nenačetlo. Zkuste stránku obnovit.</p>}
    </div>
  );
}
