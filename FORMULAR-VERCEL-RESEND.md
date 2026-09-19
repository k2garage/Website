# K2 garage — přímé odesílání rezervací přes Vercel a Resend

## Cíl

Rezervační formulář má odesílat poptávku přímo ze stránky bez otevření e-mailového klienta. Návštěvník může přiložit fotografie vozidla nebo závady. E-mail se doručí na `k2garage@seznam.cz`; zákazník po odeslání obdrží potvrzení přímo na webu.

## Navržená architektura

| Vrstva | Řešení | Úloha |
|---|---|---|
| Web | React/Vite aplikace na Vercelu | Ověření polí, výběr služby a výběr fotografií |
| API | Vercel Serverless Function `/api/reservation` | Bezpečně přijme formulář, provede validaci a spustí doručení |
| E-mail | Resend | Doručí strukturovanou poptávku na `k2garage@seznam.cz` |
| Fotografie | Vercel Blob nebo obdobné soukromé úložiště | Uloží přílohy a do e-mailu vloží zabezpečené odkazy |

> **Proč neposílat z prohlížeče přímo do Resendu?** API klíč by se dostal do veřejného kódu webu. Odeslání proto musí běžet na serverové funkci Vercelu, kde zůstane klíč privátní.

## Nastavení v Resendu

1. Založte účet na [Resend](https://resend.com/).
2. V části **Domains** přidejte doménu `k2garage.cz`.
3. Do DNS domény vložte ověřovací záznamy, které Resend zobrazí (SPF/DKIM a případně DMARC).
4. Po ověření vytvořte API klíč s oprávněním **Sending access**.
5. Klíč neodesílejte přes chat ani nevkládejte do zdrojového kódu. Vloží se až do proměnné prostředí Vercelu `RESEND_API_KEY`.

Doporučené e-mailové adresy:

| Účel | Adresa |
|---|---|
| Odesílatel | `rezervace@k2garage.cz` nebo `noreply@k2garage.cz` |
| Doručení poptávky | `k2garage@seznam.cz` |
| Odpověď zákazníkovi | e-mail vyplněný ve formuláři (`Reply-To`) |

### DNS záznamy již vytvořené v Resendu pro `k2garage.cz`

Do DNS administrace Websupportu přidejte následující **tři záznamy pro odesílání**. TTL ponechte na automatickém nastavení. Pokud Websupport automaticky doplňuje doménu, zadávejte pouze hodnotu ze sloupce **Název**.

| Typ | Název | Hodnota |
|---|---|---|
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9H7uLUkmuqdFnu83f/s/jSQh0D/Vax0vzsceAaA9ukaOdfWhhgv1eekZFQqzRA8RmXYfwTSVHWkpZsJj7aJbsmBK2I0rWp/W1FuKCqwI6t9GH5vRfYLNFkhhsNUlIGRJfc/IMD9/Ibo5pKPp5TmlMd460DZaXWrV3/rvfFeUvBwIDAQAB` |
| CNAME | `rsend` | `rsend-euw1.forge.rmta.net` |
| CNAME | `send` | `send.forge.rmta.net` |

> **Nepřidávejte záznam pro příjem e-mailů (`@ → inbound-smtp.eu-west-1.amazonaws.com`)**, pokud vědomě nechcete používat Resend i pro příjem e-mailů. Pro rezervační formulář je nutné pouze odesílání a tento záznam by mohl kolidovat se stávajícím nastavením hlavní domény.

## Nastavení ve Vercelu

1. Připojte GitHub repository webu k projektu ve Vercelu.
2. V **Settings → Environment Variables** vložte `RESEND_API_KEY` pro prostředí Production, Preview a Development.
3. Pro fotografie vytvořte ve Vercelu **Blob Store** a přidejte proměnnou `BLOB_READ_WRITE_TOKEN`.
4. Nastavte limit formuláře na maximálně **5 fotografií**, každý soubor nejvýše **8 MB**. Povolené formáty: JPG, JPEG, PNG a WEBP.
5. V produkci povolte odesílání pouze z domény `https://k2garage.cz`; API zároveň ověří typ souboru, velikost a počet příloh.

## Chování formuláře

| Krok | Chování |
|---|---|
| Validace | Povinné kontaktní údaje a vybraná služba; dynamická pole dle služby |
| Fotografie | Volitelné pole, náhledy, odebrání souboru před odesláním, limit 5 × 8 MB |
| Odeslání | Tlačítko se během zpracování deaktivuje a zobrazí stav odesílání |
| Úspěch | Potvrzení přímo na stránce, bez přesměrování do e-mailového klienta |
| Chyba | Srozumitelné upozornění a možnost zavolat na 725 480 018 |

## Bezpečnostní požadavky

- API klíče nesmí být dostupné v klientském JavaScriptu ani GitHub repository.
- Endpoint má validovat povinná pole, e-mail, telefon, typ služby, počet a typ souborů.
- Endpoint má použít rate limiting a ochranu proti spamu (např. honeypot + Turnstile nebo hCaptcha).
- Přílohy mají být uloženy neveřejně nebo přes časově omezené odkazy.
- Odeslané fotografie neukládejte déle, než je nutné pro vyřízení poptávky.

## Potřebné údaje před implementací

| Potřeba | Kdo dodá |
|---|---|
| Ověřená doména a API klíč Resend | K2 garage / správce domény |
| Vercel projekt připojený ke GitHub repository | K2 garage / správce Vercelu |
| Souhlas s limity fotografií (doporučení: 5 × 8 MB) | K2 garage |
| Volba odesílatelské adresy | K2 garage |

## Ověřovací scénář po nasazení

1. Zákazník vybere službu, doplní kontaktní údaje a přidá jednu nebo více fotografií.
2. Formulář odešle data na `/api/reservation` bez otevření e-mailového klienta.
3. K2 garage obdrží e-mail s přehledem údajů a odkazy na fotografie.
4. Zákazník uvidí potvrzení o přijetí poptávky.
5. Neplatný soubor, překročení limitu nebo chybějící povinné pole zobrazí konkrétní opravitelnou chybu.

## Stav konfigurace k 19. září 2026

Doména `k2garage.cz` je v Resendu ověřena pro odesílání. Pro rezervační formulář byl vytvořen samostatný klíč s oprávněním **Sending access**, omezený pouze na tuto doménu; jeho hodnota je uložená jako tajná proměnná `RESEND_API_KEY` ve Vercelu pro prostředí Production, Preview a Development.

Ve Vercelu existuje soukromý Blob Store `k2-garage-reservation-photos`, propojený s projektem `k2-garage`. Vercel automaticky přidal proměnné `BLOB_READ_WRITE_TOKEN`, `BLOB_STORE_ID` a `BLOB_WEBHOOK_PUBLIC_KEY` do všech tří prostředí. Fotografie proto mohou být ukládány neveřejně a následně připojeny k poptávce přes bezpečné odkazy.

Klientská část formuláře už umí vybrat, validovat, zobrazit náhled a odebrat až pět fotografií ve formátech JPG, PNG a WEBP, každou do 8 MB. Chybí pouze serverová Vercel Function `/api/reservation`, která přijme formulář, vystaví prohlížeči krátkodobý token pro soukromý upload do Blob Store, validuje data a odešle e-mail prostřednictvím Resendu. Tato funkce musí běžet mimo klientský React kód, aby žádný tajný klíč nebyl dostupný návštěvníkům webu.


## Turnstile proti spamu

Cloudflare Turnstile widget pro `k2garage.cz` je vytvořen v režimu **Managed**. Veřejný Site Key je vložený jen do klientské komponenty formuláře a tajný klíč je uložen ve Vercelu jako `TURNSTILE_SECRET_KEY` pouze pro produkční prostředí. Formulář vyžaduje platný Turnstile token ještě před odesláním; token se přikládá k datům pod klíčem `turnstileToken`.

Serverová funkce `/api/reservation` musí token ověřit voláním Cloudflare Siteverify API před uložením příloh nebo odesláním e-mailu. Samotná klientská kontrola nezastupuje serverové ověření a nesmí být považována za ochranu endpointu.
