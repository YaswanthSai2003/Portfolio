import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  JetBrains_Mono,
  Manrope,
  Space_Grotesk,
} from "next/font/google";

import "./globals.css";

import { ThemeBoot } from "@/components/theme-boot";
import { getSiteSettings } from "@/lib/content";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings =
    await getSiteSettings();

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ||
        "http://localhost:3000",
    ),

    title: {
      default:
        `${settings.fullName} — ${settings.role}`,

      template:
        `%s — ${settings.fullName}`,
    },

    description:
      settings.heroIntro,

    openGraph: {
      title:
        `${settings.fullName} — ${settings.role}`,

      description:
        settings.heroIntro,

      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce =
    (await headers()).get("x-nonce") ||
    undefined;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`
        ${display.variable}
        ${body.variable}
        ${mono.variable}
      `}
    >
      <head>
        <ThemeBoot nonce={nonce} />
      </head>

      <body
        className="
          m-0
          min-h-screen

          bg-[#eef0f1]
          text-[#141416]

          font-[var(--font-body)]
          antialiased

          transition-colors
          duration-300

          dark:bg-[#12151a]
          dark:text-[#f4f4f2]
        "
      >
        {children}
      </body>
    </html>
  );
}