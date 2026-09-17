"use client";

import {
  useState,
} from "react";

type AdminSettingToggleProps = {
  name: string;
  defaultChecked: boolean;
  title: string;
  description: string;
};

export function AdminSettingToggle({
  name,
  defaultChecked,
  title,
  description,
}: AdminSettingToggleProps) {
  const [
    checked,
    setChecked,
  ] = useState(
    defaultChecked,
  );

  return (
    <label
      className={`
        flex
        min-h-[118px]
        cursor-pointer
        items-start
        justify-between
        gap-5
        border
        p-4
        transition-all
        duration-200

        ${
          checked
            ? `
              border-[#4fa86a]/35
              bg-[#4fa86a]/[0.055]
              hover:border-[#4fa86a]/50
            `
            : `
              border-[#d85a62]/30
              bg-[#d85a62]/[0.035]
              hover:border-[#d85a62]/45
            `
        }
      `}
    >
      <input
        type="checkbox"
        name={name}
        value="on"
        checked={checked}
        onChange={(
          event,
        ) =>
          setChecked(
            event.target
              .checked,
          )
        }
        className="sr-only"
      />

      <span className="min-w-0">
        <strong
          className="
            block
            text-[12px]
            font-semibold
            text-white/82
          "
        >
          {title}
        </strong>

        <span
          className="
            mt-2
            block
            max-w-[310px]
            text-[10px]
            leading-5
            text-white/36
          "
        >
          {description}
        </span>
      </span>

      <span
        className="
          flex
          shrink-0
          items-center
          gap-3
        "
      >
        <span
          className={`
            font-[var(--font-mono)]
            text-[7px]
            font-medium
            uppercase
            tracking-[0.11em]
            transition-colors

            ${
              checked
                ? "text-[#72d68c]"
                : "text-[#f1787f]"
            }
          `}
        >
          {checked
            ? "ON"
            : "OFF"}
        </span>

        <span
          className={`
            relative
            h-6
            w-11
            rounded-full
            transition-colors
            duration-200

            ${
              checked
                ? "bg-[#4fa86a]"
                : "bg-[#a9474e]"
            }
          `}
        >
          <span
            className={`
              absolute
              top-0.5
              size-5
              rounded-full
              bg-white
              shadow-sm
              transition-transform
              duration-200

              ${
                checked
                  ? "translate-x-[22px]"
                  : "translate-x-0.5"
              }
            `}
          />
        </span>
      </span>
    </label>
  );
}