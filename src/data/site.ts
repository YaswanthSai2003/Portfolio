export type ContactMode = "form" | "direct" | "closed";

export type SiteSettings = {
  fullName: string;
  brandName: string;
  role: string;
  heroTitle: string;
  heroIntro: string;
  availability: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  contactMode: ContactMode;
  contactRequireVerification: boolean;
  contactNotifyByEmail: boolean;
  contactHeadline: string;
  contactFormNote: string;
  contactDirectNote: string;
  contactClosedNote: string;
};

const fullName = (
  process.env.NEXT_PUBLIC_FULL_NAME ||
  "Yaswanth Sai Reddy Kadhati"
).trim();

const brandName = (
  process.env.NEXT_PUBLIC_BRAND_NAME ||
  "YASH"
)
  .trim()
  .toUpperCase();

/**
 * Code-level defaults only.
 *
 * When Supabase is configured, getSiteSettings() overlays the values stored in
 * site_settings.data on top of these defaults. That means the Admin portal is
 * the source of truth in production while this object remains a safe fallback
 * for first boot / local development.
 */
export const siteConfig: SiteSettings = {
  fullName,
  brandName,
  role: "Software Engineer · Backend · Full-Stack · AI",
  heroTitle: "I build software from idea to production.",
  heroIntro:
    "Full-stack products, backend systems, AI-assisted developer tooling and applied machine learning — built with product judgement and production-minded engineering.",
  availability: "Open to software engineering opportunities",

  githubUrl: "",
  linkedinUrl: "",
  email: "",

  contactMode: "form",
  contactRequireVerification: true,
  contactNotifyByEmail: false,
  contactHeadline: "Have a role,\nproject or idea?",
  contactFormNote:
    "Send a message here. If it's a good fit, I'll get back to you using the email you provide.",
  contactDirectNote:
    "For hiring, collaboration or project enquiries, email or LinkedIn is the fastest way to reach me.",
  contactClosedNote:
    "I'm not taking new enquiries at the moment, but you can still explore my work and follow along through my public profiles.",
};
