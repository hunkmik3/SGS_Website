export const contactFields = [
  { name: "firstName", label: "First name", placeholder: "FIRST NAME*", type: "text", autoComplete: "given-name" },
  { name: "lastName", label: "Last name", placeholder: "LAST NAME*", type: "text", autoComplete: "family-name" },
  { name: "phone", label: "Phone number", placeholder: "PHONE NUMBER*", type: "tel", autoComplete: "tel" },
  { name: "email", label: "Your email", placeholder: "YOUR EMAIL*", type: "email", autoComplete: "email" },
] as const;

export const detailsPlaceholder =
  "Tell us about the project, creative vision, deliverables, intended audience, production status and the services you would like SGS to provide.";
