"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "page_view", path: pathname, referrer: document.referrer || "" }),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);
  return null;
}
