"use client";

import { useState } from "react";

type SettingToggleProps = {
  name: string;
  title: string;
  description: string;
  defaultChecked: boolean;
};

export function SettingToggle({
  name,
  title,
  description,
  defaultChecked,
}: SettingToggleProps) {
  const [checked, setChecked] =
    useState(defaultChecked);

  return (
    <label
      className={`
        flex
        cursor-pointer
        items-start
        justify-between
        gap-5
        border
        p-4
        transition

        ${
          checked
            ? "border-[#4fa86a]/28 bg-[#4fa86a]/[0.055]"
            : "border-[#a9474e]/24 bg-[#a9474e]/[0.045]"
        }
      `}
    >
      <input
        type="checkbox"
        name={name}
        value="on"
        checked={checked}
        onChange={(event) =>
          setChecked(event.target.checked)
        }
        className="sr-only"
      />

      <span>
        <strong className="block text-[12px] text-white/82">
          {title}
        </strong>

        <span className="mt-2 block max-w-sm text-[10px] leading-5 text-white/36">
          {description}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-2">
        <span
          className={`
            font-[var(--font-mono)]
            text-[7px]
            font-semibold
            uppercase
            tracking-[0.12em]

            ${
              checked
                ? "text-[#72d68c]"
                : "text-[#f1787f]"
            }
          `}
        >
          {checked ? "ON" : "OFF"}
        </span>

        <span
          aria-hidden="true"
          className={`
            relative
            h-5
            w-9
            rounded-full
            transition

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
              size-4
              rounded-full
              bg-white
              transition-transform

              ${
                checked
                  ? "translate-x-[18px]"
                  : "translate-x-0.5"
              }
            `}
          />
        </span>
      </span>
    </label>
  );
}
