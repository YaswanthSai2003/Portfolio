"use client";

export function ThemeToggle() {
  function toggleTheme() {
    const root =
      document.documentElement;

    const currentTheme =
      root.dataset.theme === "dark"
        ? "dark"
        : "light";

    const nextTheme =
      currentTheme === "dark"
        ? "light"
        : "dark";

    root.dataset.theme =
      nextTheme;

    root.style.colorScheme =
      nextTheme;

    localStorage.setItem(
      "portfolio-theme",
      nextTheme,
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Change color theme"
      className="
        grid
        size-9
        cursor-pointer
        place-items-center
        rounded-full

        border
        border-black/10

        text-black/55

        transition-all
        duration-200

        hover:border-black/25
        hover:bg-black/[0.04]
        hover:text-black

        active:scale-[0.96]

        dark:border-white/12
        dark:text-white/58

        dark:hover:border-white/28
        dark:hover:bg-white/[0.05]
        dark:hover:text-white
      "
    >
      {/* Moon — visible in light mode */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="
          size-[14px]
          dark:hidden
        "
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.5 14.2A7.5 7.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
      </svg>

      {/* Sun — visible in dark mode */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="
          hidden
          size-[14px]
          dark:block
        "
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      >
        <circle
          cx="12"
          cy="12"
          r="3.5"
        />

        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    </button>
  );
}