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
  resumeUrl: string;
};

const fullName = (process.env.NEXT_PUBLIC_FULL_NAME || "Yaswanth Sai Reddy Kadhati").trim();
const brandName = (
  process.env.NEXT_PUBLIC_BRAND_NAME || "YASH"
)
  .trim()
  .toUpperCase();

export const siteConfig: SiteSettings = {
  fullName,
  brandName,
  role: "Software Engineer · Backend · Full-Stack · AI",
  heroTitle: "I build software from idea to production.",
  heroIntro:
    "Full-stack products, backend systems, AI-assisted developer tooling and applied machine learning — built with product judgement and production-minded engineering.",
  availability: "Open to software engineering opportunities",
  githubUrl:
    process.env.NEXT_PUBLIC_GITHUB_URL ||
    "https://github.com/YaswanthSai2003",
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL || "",
};
