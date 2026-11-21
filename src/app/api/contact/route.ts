import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BYTES = 12000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c] || c);
}

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !from || !to) {
    console.error("Contact email environment variables are missing.");
    return NextResponse.json({ error: "Email sending is not configured yet." }, { status: 503 });
  }

  const length = Number(request.headers.get("content-length") || "0");
  if (length > MAX_BYTES) return NextResponse.json({ error: "Message is too large." }, { status: 413 });
  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > MAX_BYTES) return NextResponse.json({ error: "Message is too large." }, { status: 413 });
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid request");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const read = (key: string) => typeof body[key] === "string" ? (body[key] as string).trim() : "";
  const name = read("name"), email = read("email"), subject = read("subject"), message = read("message");
  if (read("website")) return NextResponse.json({ ok: true }); // Honeypot, silently ignore automated spam
  if (!name || name.length > 100 || !EMAIL.test(email) || email.length > 254 ||
      !subject || subject.length > 160 || message.length < 10 || message.length > 5000) {
    return NextResponse.json({ error: "Please check the required fields and try again." }, { status: 400 });
  }

  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: email,
        subject: `[Portfolio] ${subject.replace(/[\r\n]/g, " ")}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!result.ok) {
      console.error("Resend rejected portfolio message:", result.status, await result.text());
      return NextResponse.json({ error: "The email service could not send your message." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Portfolio email request failed:", error);
    return NextResponse.json({ error: "Email service is temporarily unavailable." }, { status: 502 });
  }
}
