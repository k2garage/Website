# K2 garage — deployment

> **Administrace a data:** Kompletní postup pro AutoAdmin Pro, databázi Neon, Vercel Blob, Resend, bezpečné přihlášení a publikování přes GitHub nebo Vercel je v souboru [ADMIN-DEPLOYMENT.md](ADMIN-DEPLOYMENT.md).

## Vercel

Projekt je připravený jako Vite/React frontend. V GitHubu vytvořte repository, nahrajte celý obsah tohoto projektu a ve Vercelu zvolte **Import Project**. Framework preset nastavte na **Vite**, build command ponechte `pnpm build` a output directory nastavte na `dist/public`. Soubor `vercel.json` zajišťuje SPA rewrite, takže přímé načtení routy nebude vracet 404.

Před prvním ostrým nasazením spusťte lokálně `pnpm install`, `pnpm check` a `pnpm build`. Ostrá doména `https://k2garage.cz/` je už doplněná do canonical, Open Graph, Twitter a sitemap metadat. Hero fotografie, logo, favicony a obrázek pro sociální sdílení jsou uložené v `client/public/assets`, takže nasazení není závislé na Manus storage.

## GitHub Pages

Pro GitHub Pages je vhodnější použít Vercel nebo jiný hosting, protože projekt používá Vite build a klientské routování. Pokud budete chtít Pages, nastavte GitHub Actions workflow pro `pnpm install`, `pnpm build` a publikaci adresáře `dist/public`; při použití jiné než kořenové cesty bude potřeba doplnit Vite `base` podle názvu repository.

## Obsah bez backendu

Veřejný frontend má nyní serverless rozšíření. Kontaktní a rezervační formulář ukládají zprávy přes Vercel API a administrace je dostupná na `/admin`. Pokud nejsou nastavené proměnné prostředí, aplikace zůstává bezpečně zobrazitelná, ale administrace používá pouze ukázková data a veřejné formuláře neukládají zprávy.
