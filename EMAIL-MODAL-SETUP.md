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

## Vercel production troubleshooting

The contact form posts to `/api/contact` and email is delivered by Resend. The website will **not** send email just because it has been deployed.

1. In **Vercel > your project > Settings > Environment Variables**, set the three values above for the **Production** environment. Do not prefix them with `NEXT_PUBLIC_`.
2. In **Resend > Domains**, make sure the domain used by `CONTACT_FROM_EMAIL` has been verified. For testing only, `onboarding@resend.dev` works solely when `CONTACT_TO_EMAIL` is the Resend account owner's address. A normal Gmail address cannot be used as `CONTACT_FROM_EMAIL` without ownership of a verified sending domain.
3. **Redeploy** the production project after creating or changing environment variables. Vercel does not retroactively apply changes to an existing deployment.
4. Submit the form from your deployed site, then go to **Vercel > Project > Logs** and filter for requests to `/api/contact`. Status 503 with a missing-variable warning means the variables are absent in that deployment; a `Resend rejected` log with status 401 usually means a bad key, while 403/422 suggests an unverified or unauthorized sender.
5. If requests to `/api/contact` return 404, confirm the deployment builds as a **Next.js app**, not as a static export, and that `src/app/api/contact/route.ts` is included in your deployed repository.

Do not share API keys in screenshots, chats, or Git commits. Use your Vercel dashboard to store them as server-side secrets.
