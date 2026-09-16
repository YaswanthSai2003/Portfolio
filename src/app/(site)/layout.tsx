import { AnalyticsTracker } from "@/components/analytics-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <AnalyticsTracker />
      <SiteHeader settings={settings} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
