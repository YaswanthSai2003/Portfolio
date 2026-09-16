"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  eventType: string;
  projectSlug?: string;
  children?: ReactNode;
};

export function TrackedLink({ href, eventType, projectSlug, children, onClick, ...props }: Props) {
  function track() {
    try {
      navigator.sendBeacon(
        "/api/analytics",
        new Blob([JSON.stringify({ eventType, projectSlug, path: window.location.pathname })], { type: "application/json" }),
      );
    } catch {
      // Analytics is optional and must never block navigation.
    }
  }
  return (
    <a
      {...props}
      href={href}
      target={props.target ?? "_blank"}
      rel={props.rel ?? "noreferrer"}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        track();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
