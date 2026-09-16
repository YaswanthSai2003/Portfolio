import Script from "next/script";

type ThemeBootProps = {
  nonce?: string;
};

export function ThemeBoot({
  nonce,
}: ThemeBootProps) {
  const code = `
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

  return (
    <Script
      id="theme-boot"
      nonce={nonce}
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: code,
      }}
    />
  );
}