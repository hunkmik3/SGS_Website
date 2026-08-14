"use client";

import { useRef, useState } from "react";
import { Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { checkAttachment } from "@/lib/attachment";
import { contactFields, detailsPlaceholder } from "@/lib/contact";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Figma measurements (1440 frame): 58px pill inputs on a two-column grid with a
 * 21px gutter, a details panel holding the brief, then the upload pill and the
 * submit button — all on the shared 68% content column.
 *
 * Labels sit inside the controls as placeholders, so every field also carries a
 * visually hidden <label> for screen readers.
 */
export function Contact() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFileName(null);
      return;
    }
    // Mirrors the server check so the visitor hears about it immediately
    // instead of after uploading.
    const problem = checkAttachment(file);
    if (problem) {
      event.target.value = "";
      setFileName(null);
      setStatus("error");
      setMessage(problem);
      return;
    }
    setFileName(file.name);
    if (status === "error") setStatus("idle");
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        setStatus("error");
        setMessage(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("sent");
      setMessage("Thanks — we'll be in touch shortly.");
      formRef.current?.reset();
      setFileName(null);
    } catch {
      setStatus("error");
      setMessage("We could not reach the server. Please check your connection.");
    }
  };

  return (
    // Every section owns the gap above it, but the footer's own padding-top is
    // its internal spacing — so the gap before it has to live here instead.
    <section id="contact" className="pt-section pb-[clamp(4rem,9.4vw,8.4rem)]">
      <Container>
        <Reveal>
          <SectionLabel className="text-center">
            Start A Project
          </SectionLabel>
          {/* Same curve as --text-heading, lower floor. The shared token sits at
              31px on phones because "Don't take our word for it." has to break
              onto two lines there; this heading wants to stay on one, so it
              needs its own minimum. The vw term is untouched, so desktop is
              identical to every other section heading. */}
          <h2 className="mt-[clamp(0.25rem,0.4vw,0.5rem)] text-center text-[clamp(1.75rem,3.2vw,4rem)] leading-[1.12] font-bold tracking-[-0.025em]">
            Bring your vision to life.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            className="mt-[clamp(2rem,3.8vw,4.75rem)] flex flex-col gap-[clamp(0.75rem,1.5vw,1.9rem)]"
          >
            <div className="grid gap-[clamp(0.75rem,1.5vw,1.9rem)] sm:grid-cols-2">
              {contactFields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="sr-only">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required
                    placeholder={field.placeholder}
                    // Placeholder sits at full ink, matching the PROJECT
                    // DETAILS label rather than the usual muted grey.
                    className="h-[clamp(2.75rem,4.03vw,5rem)] w-full rounded-full border border-line bg-paper px-[clamp(1rem,1.4vw,1.75rem)] text-[clamp(0.8125rem,0.97vw,1.2rem)] text-ink transition-colors placeholder:text-ink focus:border-ink focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="rounded-[clamp(0.875rem,1.667vw,2.1rem)] border border-line p-[clamp(1rem,1.4vw,1.75rem)]">
              <label
                htmlFor="details"
                className="block text-[clamp(0.8125rem,0.97vw,1.2rem)] text-ink uppercase"
              >
                Project details*
              </label>
              <textarea
                id="details"
                name="details"
                required
                rows={4}
                placeholder={detailsPlaceholder}
                className="mt-[clamp(0.5rem,0.9vw,1.1rem)] w-full resize-none bg-transparent font-mono text-[clamp(0.75rem,0.9vw,1.1rem)] leading-[1.4] text-ink placeholder:text-hint focus:outline-none"
              />
            </div>

            <label className="flex h-[clamp(2.75rem,4.03vw,5rem)] cursor-pointer items-center gap-[clamp(0.5rem,0.7vw,0.9rem)] rounded-full border border-line px-[clamp(1rem,1.4vw,1.75rem)] transition-colors hover:border-ink">
              <Link2
                aria-hidden
                className="size-[clamp(0.875rem,1.2vw,1.5rem)] shrink-0 text-ink"
              />
              <span className="truncate font-mono text-[clamp(0.75rem,0.97vw,1.2rem)] text-ink uppercase">
                {fileName ?? "Upload file"}
              </span>
              <input
                type="file"
                name="attachment"
                onChange={onFileChange}
                className="sr-only"
              />
            </label>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {/* Figma sizes this one at 95×32 — shorter but far wider than the
                  shared md button, so the size is overridden here rather than
                  changing the variant the hero relies on. */}
              <Button
                type="submit"
                disabled={status === "sending"}
                className="h-[clamp(1.75rem,2.22vw,2.75rem)] px-[clamp(1.25rem,1.81vw,2.25rem)] text-[clamp(0.8125rem,0.97vw,1.2rem)] font-semibold"
              >
                {status === "sending" ? "Sending…" : "Submit"}
              </Button>

              {message && (
                <p
                  role="status"
                  aria-live="polite"
                  className={cn(
                    "text-[clamp(0.8125rem,0.97vw,1.2rem)]",
                    status === "error" ? "text-brand" : "text-ink",
                  )}
                >
                  {message}
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </Container>
    </section>
  );
}
