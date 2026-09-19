# K2 garage — deployment

## Vercel

Projekt je připravený jako Vite/React frontend. V GitHubu vytvořte repository, nahrajte celý obsah tohoto projektu a ve Vercelu zvolte **Import Project**. Framework preset nastavte na **Vite**, build command ponechte `pnpm build` a output directory nastavte na `dist/public`. Soubor `vercel.json` zajišťuje SPA rewrite, takže přímé načtení routy nebude vracet 404.

Před prvním ostrým nasazením spusťte lokálně `pnpm install`, `pnpm check` a `pnpm build`. Ostrá doména `https://k2garage.cz/` je už doplněná do canonical, Open Graph, Twitter a sitemap metadat. Hero fotografie, logo, favicony a obrázek pro sociální sdílení jsou uložené v `client/public/assets`, takže nasazení není závislé na Manus storage.

## GitHub Pages

Pro GitHub Pages je vhodnější použít Vercel nebo jiný hosting, protože projekt používá Vite build a klientské routování. Pokud budete chtít Pages, nastavte GitHub Actions workflow pro `pnpm install`, `pnpm build` a publikaci adresáře `dist/public`; při použití jiné než kořenové cesty bude potřeba doplnit Vite `base` podle názvu repository.

## Obsah bez backendu

Web je statický frontend. Telefonní odkazy používají `tel:+420725480018`, e-mail používá `mailto:k2garage@seznam.cz` a formulář není součástí této verze. Sociální odkazy jsou zatím obecné placeholdery a před publikací je nahraďte skutečnými profily K2 garage.
