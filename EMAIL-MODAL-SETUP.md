# Portfolio email modal setup

This patch adds a contact form modal to Overview and Contact, with a server-side Next.js route that sends through Resend. The recipient and API key are never sent to the browser.

## Files to replace

- `src/app/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/globals.css`

## Files to add

- `src/components/contact-email-modal.tsx`
- `src/app/api/contact/route.ts`

## Setup for actual delivery

1. Create a Resend account (https://resend.com) and verify a domain you own. Resend requires a verified sender domain for sending to arbitrary visitors / a real inbox. Its free testing sender is limited.
2. Generate an API key from Resend and add the following **server environment variables** to `.env.local` (for local tests) and Vercel Project Settings > Environment Variables (for deployment):

   ```env
   RESEND_API_KEY=re_your_secret_key
   CONTACT_FROM_EMAIL="Portfolio <contact@your-verified-domain.com>"
   CONTACT_TO_EMAIL=danieldaveumali102804@gmail.com
   ```

3. Restart `npm run dev`; test the form. On Vercel, redeploy after setting environment variables.
4. Do not put secret keys in `NEXT_PUBLIC_...`, `public/`, source code, or Git.

No extra npm package required. The API route uses `fetch`.

## Operational note

The form includes validation, a hidden bot-trap field, a payload limit, and avoids rendering user input as HTML. For a public, higher-traffic site, add a CAPTCHA (e.g. Turnstile) and server-side rate limiting before advertising the form widely. Without configured email credentials, the form returns a clear configuration error. Email sending requires an external provider and does not work automatically from Vercel alone.

The sharp-edge image update is CSS-only, so your real profile picture is unchanged.
