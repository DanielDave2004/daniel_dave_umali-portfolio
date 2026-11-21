"use client";

import { useState, type FormEvent } from "react";
import "./contact-email-modal.css";
import { Mail, Send } from "lucide-react";
import { PortfolioModal } from "@/components/portfolio-modal";
import { portfolio } from "@/data/portfolio";

type FormStatus = "idle" | "sending" | "success" | "error";

export function ContactEmailModalButton({
  className = "button button-primary",
  label = "Send an email",
}: {
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  function close() {
    if (status === "sending") return;
    setOpen(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setError("");
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || ""),
          email: String(data.get("email") || ""),
          subject: String(data.get("subject") || ""),
          message: String(data.get("message") || ""),
          website: String(data.get("website") || ""),
        }),
      });
      const result: { error?: string } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Message could not be sent. Please try again.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unable to send the message.");
    }
  }

  return <>
    <button type="button" className={className} onClick={() => { setStatus("idle"); setError(""); setOpen(true); }}>
      <Mail size={16} /> {label}
    </button>
    <PortfolioModal open={open} onClose={close} title={`Send a message to ${portfolio.name}`} className="portfolio-modal-email">
      <div className="contact-email-modal-content">
        {status === "success" ? (
          <div className="contact-email-success" role="status">
            <h3>Message sent</h3>
            <p>Thank you for reaching out. Your message has been submitted successfully.</p>
            <button className="button button-primary" type="button" onClick={close}>Done</button>
          </div>
        ) : (
          <form className="contact-email-form" onSubmit={submit}>
            <p className="contact-email-intro">Send your message directly through this portfolio. All fields are required.</p>
            <div className="contact-email-row">
              <label>Your name<input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" /></label>
              <label>Your email<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" /></label>
            </div>
            <label>Subject<input name="subject" required maxLength={160} placeholder="What is your message about?" /></label>
            <label>Message<textarea name="message" required minLength={10} maxLength={5000} rows={7} placeholder="Write your message here..." /></label>
            <div className="contact-email-honeypot" aria-hidden="true"><label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label></div>
            {status === "error" && <p className="contact-email-error" role="alert">{error}</p>}
            <div className="contact-email-footer">
              <span>Your email address is used only for replying to your message.</span>
              <button className="button button-primary" type="submit" disabled={status === "sending"}>
                <Send size={16} /> {status === "sending" ? "Sending..." : "Send message"}
              </button>
            </div>
          </form>
        )}
      </div>
    </PortfolioModal>
  </>;
}
