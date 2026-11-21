# DD SVG favicon for Next.js App Router

Copy `src/app/icon.svg` into the existing `my-portfolio/src/app/` directory.

If `src/app/favicon.ico` exists, remove it to avoid using the old icon.

The SVG uses the DD logo from your latest header and changes color based on the browser/device light or dark color scheme. It does not follow the website's manual theme toggle.

Run `npm run dev`, then visit your site and hard refresh if the old favicon is cached. Run `npm run build` before deploying.
