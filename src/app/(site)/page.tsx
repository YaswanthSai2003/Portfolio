import Link from "next/link";
import { headers } from "next/headers";
import { ContactSection } from "@/components/contact-section";
import { CapabilitiesSection } from "@/components/capabilities-section";
import { ProjectShowcase } from "@/components/project-showcase";
import { SocialLinks } from "@/components/social-links";
import { getPublishedProjects, getSiteSettings } from "@/lib/content";

const shell = "mx-auto w-[min(1420px,calc(100%_-_64px))] max-sm:w-[calc(100%_-_32px)]";
const kicker =
  "font-[var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-black/42 dark:text-white/42";

export const revalidate = 60;

const experience = [
  {
    period: "NOV 2025 — PRESENT",
    role: "Software Engineer",
    company: "Searce · formerly Cloudside Technologies",
    bullets: [
      "Build and maintain backend and full-stack product features across Python, Node.js and React.",
      "Work with API authentication, permissions, caching, validation, debugging and production-oriented testing.",
      "Contributed to an internal context-aware PR review workflow using specialist review stages and a validation layer.",
    ],
    stack: ["Python", "FastAPI", "Node.js", "React", "PostgreSQL", "Redis"],
  },
  {
    period: "JAN 2025 — APR 2025",
    role: "Full-Stack Intern",
    company: "Rveiya Dynamics",
    bullets: [
      "Worked on frontend pages, database-backed application flows and authentication fundamentals.",
      "Completed assigned full-stack development tasks with an emphasis on connecting interface and data layers.",
    ],
    stack: ["JavaScript", "Frontend", "Database", "Authentication"],
  },
  {
    period: "JUN 2024 — JUL 2024",
    role: "Java Development Intern",
    company: "Coding Raja Technologies",
    bullets: [
      "Built Java projects around online banking and library-management workflows.",
      "Practised object-oriented design, application logic and structured data handling.",
    ],
    stack: ["Java", "OOP", "Application Logic"],
  },
];

export default async function HomePage() {
  const [projects, settings, nonce] = await Promise.all([
    getPublishedProjects(),
    getSiteSettings(),
    headers().then((list) => list.get("x-nonce") || undefined),
  ]);
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.fullName,
    jobTitle: settings.role,
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    sameAs: [settings.githubUrl, settings.linkedinUrl].filter(Boolean),
  };
  // Escape "<" so a value containing "</script>" can't break out of the tag.
  const personJsonLdSafe = JSON.stringify(personJsonLd).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: personJsonLdSafe }} />

      <section className={`${shell} flex min-h-[calc(100svh-70px)] flex-col justify-between py-7`}>
        <div className="flex justify-between gap-5 font-[var(--font-mono)] text-[9px] tracking-[0.1em] text-black/42 dark:text-white/42">
          <span>PORTFOLIO / 2026</span>
          <span className="inline-flex items-center gap-2">
            <i className="size-1.5 rounded-full bg-emerald-600 shadow-[0_0_0_4px_rgba(34,197,94,.12)]" />
            {settings.availability.toUpperCase()}
          </span>
        </div>

        <div className="my-16 grid items-end gap-14 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,.55fr)] lg:gap-20">
          <div>
            <p className={kicker}>{settings.fullName.toUpperCase()} / SOFTWARE ENGINEER</p>
            <h1 className="mt-4 max-w-[1040px] font-[var(--font-display)] text-[clamp(64px,8.1vw,132px)] font-semibold leading-[0.82] tracking-[-0.075em]">
              I build software<br />
              <span className="pl-[.42em] text-black/42 dark:text-white/42">that works</span><br />
              end to end.
            </h1>
          </div>

          <div className="pb-2">
            <p className="max-w-[430px] text-[15px] leading-8 text-black/50 dark:text-white/50">{settings.heroIntro}</p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Link href="/#work" className="inline-flex min-h-11 items-center justify-center border border-black bg-black px-5 text-[12px] font-bold text-[#eef0f1] transition hover:-translate-y-0.5 dark:border-white dark:bg-white dark:text-black">View selected work ↓</Link>
              <Link href="/resume" className="text-[12px] font-bold">Resume</Link>
              <SocialLinks githubUrl={settings.githubUrl} linkedinUrl={settings.linkedinUrl} />
            </div>
          </div>
        </div>

        <div className="flex min-h-[52px] items-center justify-between border-y border-black/10 font-[var(--font-mono)] text-[9px] tracking-[0.13em] text-black/45 dark:border-white/10 dark:text-white/45 max-sm:grid max-sm:grid-cols-2 max-sm:gap-y-3 max-sm:py-4">
          <span>FULL STACK</span><i className="mx-5 h-px flex-1 bg-black/10 dark:bg-white/10 max-sm:hidden" />
          <span>BACKEND</span><i className="mx-5 h-px flex-1 bg-black/10 dark:bg-white/10 max-sm:hidden" />
          <span>AI SYSTEMS</span><i className="mx-5 h-px flex-1 bg-black/10 dark:bg-white/10 max-sm:hidden" />
          <span>APPLIED ML</span>
        </div>
      </section>

      <ProjectShowcase projects={projects} />

      <section id="experience" className={`${shell} scroll-mt-24 py-24 lg:py-28`}>
        <div className="border-b border-black/10 pb-8 dark:border-white/10">
          <p className={kicker}>02 / EXPERIENCE</p>
          <h2 className="mt-4 font-[var(--font-display)] text-[clamp(48px,5vw,78px)] font-semibold tracking-[-0.06em]">Experience</h2>
        </div>
        <div>
          {experience.map((item) => (
            <article key={`${item.company}-${item.period}`} className="grid gap-6 border-b border-black/10 py-10 dark:border-white/10 md:grid-cols-[190px_1fr] md:gap-14 lg:grid-cols-[230px_1fr] lg:py-12">
              <p className="font-[var(--font-mono)] text-[9px] uppercase tracking-[0.08em] text-black/40 dark:text-white/40">{item.period}</p>
              <div className="max-w-[900px]">
                <h3 className="font-[var(--font-display)] text-[clamp(25px,2.5vw,36px)] font-semibold tracking-[-0.04em]">{item.role}</h3>
                <p className="mt-1 text-[11px] font-semibold text-black/42 dark:text-white/42">{item.company}</p>
                <ul className="mt-6 space-y-2 text-[12px] leading-6 text-black/52 dark:text-white/52">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3"><span className="mt-[10px] h-px w-3 shrink-0 bg-black/25 dark:bg-white/25" /><span>{bullet}</span></li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {item.stack.map((tag) => <span key={tag} className="border border-black/10 px-2.5 py-1.5 font-[var(--font-mono)] text-[8px] text-black/40 dark:border-white/10 dark:text-white/40">{tag}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="education" className="border-y border-black/10 bg-[#e6e9eb] dark:border-white/10 dark:bg-[#171b21]">
        <div className={`${shell} py-24 lg:py-28`}>
          <div className="border-b border-black/10 pb-8 dark:border-white/10">
            <p className={kicker}>03 / EDUCATION</p>
            <h2 className="mt-4 font-[var(--font-display)] text-[clamp(46px,5vw,72px)] font-semibold tracking-[-0.058em]">Education</h2>
          </div>
          <article className="grid gap-6 border-b border-black/10 py-10 dark:border-white/10 md:grid-cols-[190px_1fr] md:gap-14 lg:grid-cols-[230px_1fr] lg:py-12">
            <p className="font-[var(--font-mono)] text-[9px] uppercase tracking-[0.08em] text-black/40 dark:text-white/40">2021 — 2025</p>
            <div>
              <h3 className="font-[var(--font-display)] text-[clamp(25px,2.5vw,36px)] font-semibold tracking-[-0.04em]">B.Tech · Electronics &amp; Communication Engineering</h3>
              <p className="mt-2 text-[12px] font-semibold text-black/44 dark:text-white/44">Sri Venkateswara College of Engineering · JNTU</p>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-[10px] text-black/42 dark:text-white/42">
                <span className="border border-black/10 px-3 py-1.5 dark:border-white/10">CGPA 9.02 / 10</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <CapabilitiesSection />

      <ContactSection settings={settings} />
    </>
  );
}
