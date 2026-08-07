import { NextResponse } from "next/server";
import { Resend } from "resend";

import { checkAttachment, MAX_ATTACHMENT_BYTES } from "@/lib/attachment";
import { projectSelects } from "@/lib/contact";

// Buffer and the Resend SDK both need the Node runtime, not Edge.
export const runtime = "nodejs";

const TEXT_FIELDS = [
  { name: "firstName", label: "First name", max: 100 },
  { name: "lastName", label: "Last name", max: 100 },
  { name: "phone", label: "Phone number", max: 40 },
  { name: "email", label: "Email", max: 200 },
  { name: "details", label: "Project details", max: 5000 },
] as const;

/** Deliberately loose: over-strict email regexes reject valid addresses. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Configuration problem, not the visitor's fault — say so without leaking
    // which variable is missing.
    console.error("Contact form is missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL");
    return fail("The contact form is not configured yet. Please email us directly.", 500);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    // Usually the host rejecting an oversized body before it reaches us.
    return fail("We could not read that submission — the attachment may be too large.", 413);
  }

  const values: Record<string, string> = {};
  for (const field of TEXT_FIELDS) {
    const raw = form.get(field.name);
    const value = typeof raw === "string" ? raw.trim() : "";
    if (!value) return fail(`${field.label} is required.`);
    if (value.length > field.max) return fail(`${field.label} is too long.`);
    values[field.name] = value;
  }

  if (!EMAIL_RE.test(values.email)) return fail("That email address looks wrong.");

  // Selects must match a value we actually offer, so the email can be trusted.
  for (const select of projectSelects) {
    const raw = form.get(select.name);
    const value = typeof raw === "string" ? raw : "";
    if (!value) return fail(`${select.label.replace("*", "")} is required.`);
    if (!(select.options as readonly string[]).includes(value)) {
      return fail(`${select.label.replace("*", "")} has an unexpected value.`);
    }
    values[select.name] = value;
  }

  const attachments: { filename: string; content: Buffer }[] = [];
  const file = form.get("attachment");
  if (file instanceof File && file.size > 0) {
    const problem = checkAttachment(file);
    if (problem) return fail(problem);
    if (file.size > MAX_ATTACHMENT_BYTES) return fail("Attachment is too large.", 413);
    attachments.push({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
    });
  }

  const rows: [string, string][] = [
    ["Name", `${values.firstName} ${values.lastName}`],
    ["Email", values.email],
    ["Phone", values.phone],
    ...projectSelects.map(
      (s) => [s.label.replace("*", ""), values[s.name]] as [string, string],
    ),
  ];

  const html = `
    <h2 style="font:600 18px system-ui;margin:0 0 16px">New project enquiry</h2>
    <table style="font:14px system-ui;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 16px 4px 0;color:#666">${escapeHtml(k)}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
        )
        .join("")}
    </table>
    <h3 style="font:600 14px system-ui;margin:24px 0 8px">Project details</h3>
    <p style="font:14px/1.6 system-ui;white-space:pre-wrap;margin:0">${escapeHtml(values.details)}</p>
    ${attachments.length ? `<p style="font:13px system-ui;color:#666;margin-top:24px">Attachment: ${escapeHtml(attachments[0].filename)}</p>` : ""}
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `New project enquiry — ${values.firstName} ${values.lastName}`,
      // Lets the recipient hit reply and reach the sender directly.
      replyTo: values.email,
      html,
      attachments: attachments.length ? attachments : undefined,
    });

    if (error) {
      console.error("Resend rejected the message:", error);
      return fail("We could not send that just now. Please try again.", 502);
    }
  } catch (cause) {
    console.error("Contact form send failed:", cause);
    return fail("We could not send that just now. Please try again.", 502);
  }

  return NextResponse.json({ ok: true });
}
