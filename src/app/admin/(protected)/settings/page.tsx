import { AdminPageHeader, fieldInput, fieldLabel, fieldName } from "@/components/admin/admin-ui";
import { getSiteSettings } from "@/lib/content";
import { hasSupabase } from "@/lib/supabase-rest";
import { saveSettingsAction } from "../actions";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <AdminPageHeader eyebrow="SITE" title="Settings" description="Edit identity and public links without changing components. Visual design remains code-controlled so the portfolio stays consistent." />
      {!hasSupabase() ? <p className="mt-6 border border-white/8 p-4 text-[10px] text-white/38">Settings writes require Supabase. Current values come from environment variables and defaults.</p> : null}
      <form action={saveSettingsAction} className="mt-8 max-w-4xl border-t border-white/14">
        <div className="grid md:grid-cols-2">
          <label className={`${fieldLabel} md:border-r md:border-white/8 md:pr-6`}><span className={fieldName}>Full name</span><input className={fieldInput} name="fullName" defaultValue={settings.fullName} /></label>
          <label className={`${fieldLabel} md:pl-6`}><span className={fieldName}>Navbar brand</span><input className={fieldInput} name="brandName" defaultValue={settings.brandName} /></label>
        </div>
        <label className={fieldLabel}><span className={fieldName}>Role</span><input className={fieldInput} name="role" defaultValue={settings.role} /></label>
        <label className={fieldLabel}><span className={fieldName}>Hero headline</span><input className={fieldInput} name="heroTitle" defaultValue={settings.heroTitle} /></label>
        <label className={fieldLabel}><span className={fieldName}>Hero introduction</span><textarea className={`${fieldInput} min-h-24 resize-y leading-6`} name="heroIntro" defaultValue={settings.heroIntro} /></label>
        <label className={fieldLabel}><span className={fieldName}>Availability</span><input className={fieldInput} name="availability" defaultValue={settings.availability} /></label>
        <div className="grid md:grid-cols-2">
          <label className={`${fieldLabel} md:border-r md:border-white/8 md:pr-6`}><span className={fieldName}>GitHub</span><input className={fieldInput} name="githubUrl" defaultValue={settings.githubUrl} /></label>
          <label className={`${fieldLabel} md:pl-6`}><span className={fieldName}>LinkedIn</span><input className={fieldInput} name="linkedinUrl" defaultValue={settings.linkedinUrl} /></label>
        </div>
        <div className="grid md:grid-cols-2">
          <label className={`${fieldLabel} md:border-r md:border-white/8 md:pr-6`}><span className={fieldName}>Contact email</span><input className={fieldInput} name="email" defaultValue={settings.email} /></label>
          <label className={`${fieldLabel} md:pl-6`}><span className={fieldName}>External resume URL · optional fallback</span><input className={fieldInput} name="resumeUrl" defaultValue={settings.resumeUrl} /></label>
        </div>
        <button type="submit" className="mt-6 min-h-11 bg-[#eef0f1] px-5 text-[10px] font-bold text-[#111]">Save settings</button>
      </form>
    </>
  );
}
