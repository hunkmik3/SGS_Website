export const projectSelects = [
  {
    name: "projectType",
    label: "Project type*",
    options: [
      "Animated series",
      "Feature film",
      "Commercial or branded content",
      "Music video",
      "Game cinematic or trailer",
      "Original IP development",
      "Production partnership",
      "Other",
    ],
  },
  {
    name: "runtime",
    label: "Estimated runtime*",
    options: [
      "Under 1 minute",
      "1-3 minutes",
      "3-10 minutes",
      "10-30 minutes",
      "30-90 minutes",
      "Episodic or ongoing production",
    ],
  },
  {
    name: "budget",
    label: "Production budget*",
    options: ["Under US$50,000", "US$50,000-100,000", "Above $100,000"],
  },
  {
    name: "startDate",
    label: "Target production start*",
    options: [
      "Immediately",
      "Within 1-3 months",
      "Within 3-6 months",
      "Within 6-12 months",
      "Flexible",
    ],
  },
] as const;

export const contactFields = [
  { name: "firstName", label: "First name", placeholder: "FIRST NAME*", type: "text", autoComplete: "given-name" },
  { name: "lastName", label: "Last name", placeholder: "LAST NAME*", type: "text", autoComplete: "family-name" },
  { name: "phone", label: "Phone number", placeholder: "PHONE NUMBER*", type: "tel", autoComplete: "tel" },
  { name: "email", label: "Your email", placeholder: "YOUR EMAIL*", type: "email", autoComplete: "email" },
] as const;

export const detailsPlaceholder =
  "Tell us about the project, creative vision, deliverables, intended audience, production status and the services you would like SGS to provide.";
