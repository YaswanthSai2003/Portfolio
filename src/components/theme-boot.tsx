"use client";

import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";

type ThemeBootProps = {
  nonce?: string;
};

const themeBootCode = `
(() => {
  try {
    const saved =
      localStorage.getItem("portfolio-theme");

    const prefersDark =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

    const theme =
      saved === "dark" || saved === "light"
        ? saved
        : prefersDark
          ? "dark"
          : "light";

    document.documentElement.dataset.theme =
      theme;

    document.documentElement.style.colorScheme =
      theme;
  } catch (_) {}
})();
`;

export function ThemeBoot({
  nonce,
}: ThemeBootProps) {
  const inserted =
    useRef(false);

  useServerInsertedHTML(() => {
    if (inserted.current) {
      return null;
    }

    inserted.current =
      true;

    return (
      <script
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html:
            themeBootCode,
        }}
      />
    );
  });

  return null;
}