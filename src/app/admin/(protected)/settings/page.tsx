import {
  AdminPageHeader,
  fieldInput,
  fieldLabel,
  fieldName,
} from "@/components/admin/admin-ui";
import { getSiteSettings } from "@/lib/content";
import { hasSupabase } from "@/lib/supabase-rest";
import { saveSettingsAction } from "../actions";

const modeCard =
  "block min-h-32 cursor-pointer border border-white/8 bg-white/[0.015] p-4 transition hover:border-white/18 peer-checked:border-white/40 peer-checked:bg-white/[0.055]";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <AdminPageHeader
        eyebrow="SITE"
        title="Settings"
        description="Edit identity, public links and contact behaviour without changing components. Visual design remains code-controlled so the portfolio stays consistent."
      />

      {!hasSupabase() ? (
        <p className="mt-6 border border-white/8 p-4 text-[10px] text-white/38">
          Settings writes require Supabase. Current values come from environment variables and defaults.
        </p>
      ) : null}

      <form
        action={saveSettingsAction}
        className="mt-8 max-w-4xl border-t border-white/14"
      >
        <div className="grid md:grid-cols-2">
          <label className={`${fieldLabel} md:border-r md:border-white/8 md:pr-6`}>
            <span className={fieldName}>Full name</span>
            <input className={fieldInput} name="fullName" defaultValue={settings.fullName} />
          </label>

          <label className={`${fieldLabel} md:pl-6`}>
            <span className={fieldName}>Navbar brand</span>
            <input className={fieldInput} name="brandName" defaultValue={settings.brandName} />
          </label>
        </div>

        <label className={fieldLabel}>
          <span className={fieldName}>Role</span>
          <input className={fieldInput} name="role" defaultValue={settings.role} />
        </label>

        <label className={fieldLabel}>
          <span className={fieldName}>Hero headline</span>
          <input className={fieldInput} name="heroTitle" defaultValue={settings.heroTitle} />
        </label>

        <label className={fieldLabel}>
          <span className={fieldName}>Hero introduction</span>
          <textarea
            className={`${fieldInput} min-h-24 resize-y leading-6`}
            name="heroIntro"
            defaultValue={settings.heroIntro}
          />
        </label>

        <label className={fieldLabel}>
          <span className={fieldName}>Availability</span>
          <input className={fieldInput} name="availability" defaultValue={settings.availability} />
        </label>

        <div className="grid md:grid-cols-2">
          <label className={`${fieldLabel} md:border-r md:border-white/8 md:pr-6`}>
            <span className={fieldName}>GitHub</span>
            <input className={fieldInput} name="githubUrl" defaultValue={settings.githubUrl} />
          </label>

          <label className={`${fieldLabel} md:pl-6`}>
            <span className={fieldName}>LinkedIn</span>
            <input className={fieldInput} name="linkedinUrl" defaultValue={settings.linkedinUrl} />
          </label>
        </div>

        <div className="grid md:grid-cols-2">
          <label className={`${fieldLabel} md:border-r md:border-white/8 md:pr-6`}>
            <span className={fieldName}>Contact email</span>
            <input className={fieldInput} name="email" type="email" defaultValue={settings.email} />
          </label>

          <label className={`${fieldLabel} md:pl-6`}>
            <span className={fieldName}>External resume URL · optional fallback</span>
            <input className={fieldInput} name="resumeUrl" defaultValue={settings.resumeUrl} />
          </label>
        </div>

        <div className="mt-12 border-t border-white/14 pt-8">
          <p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.13em] text-white/32">
            CONTACT BEHAVIOUR
          </p>

          <h2 className="mt-2 font-[var(--font-display)] text-[30px] font-semibold tracking-[-0.05em]">
            Public contact mode
          </h2>

          <p className="mt-3 max-w-2xl text-[11px] leading-6 text-white/42">
            Choose what visitors see in the contact section. Changing this does not affect stored messages or the inbox.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <label>
              <input
                type="radio"
                name="contactMode"
                value="form"
                defaultChecked={settings.contactMode === "form"}
                className="peer sr-only"
              />
              <span className={modeCard}>
                <span className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-white/34">
                  FORM
                </span>
                <strong className="mt-4 block text-[12px] text-white/82">Verified contact form</strong>
                <span className="mt-2 block text-[10px] leading-5 text-white/36">
                  Visitors submit through the OTP-protected contact flow.
                </span>
              </span>
            </label>

            <label>
              <input
                type="radio"
                name="contactMode"
                value="direct"
                defaultChecked={settings.contactMode === "direct"}
                className="peer sr-only"
              />
              <span className={modeCard}>
                <span className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-white/34">
                  DIRECT
                </span>
                <strong className="mt-4 block text-[12px] text-white/82">Direct contact</strong>
                <span className="mt-2 block text-[10px] leading-5 text-white/36">
                  Hide the form and show email / LinkedIn contact actions.
                </span>
              </span>
            </label>

            <label>
              <input
                type="radio"
                name="contactMode"
                value="closed"
                defaultChecked={settings.contactMode === "closed"}
                className="peer sr-only"
              />
              <span className={modeCard}>
                <span className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.12em] text-white/34">
                  CLOSED
                </span>
                <strong className="mt-4 block text-[12px] text-white/82">Not accepting enquiries</strong>
                <span className="mt-2 block text-[10px] leading-5 text-white/36">
                  Hide submission options and show an availability status instead.
                </span>
              </span>
            </label>
          </div>

          <label className={`${fieldLabel} mt-5`}>
            <span className={fieldName}>Contact headline</span>
            <textarea
              className={`${fieldInput} min-h-20 resize-y leading-6`}
              name="contactHeadline"
              required
              defaultValue={settings.contactHeadline}
            />
          </label>

          <label className={fieldLabel}>
            <span className={fieldName}>Form mode note</span>
            <textarea
              className={`${fieldInput} min-h-20 resize-y leading-6`}
              name="contactFormNote"
              defaultValue={settings.contactFormNote}
            />
          </label>

          <label className={fieldLabel}>
            <span className={fieldName}>Direct contact note</span>
            <textarea
              className={`${fieldInput} min-h-20 resize-y leading-6`}
              name="contactDirectNote"
              defaultValue={settings.contactDirectNote}
            />
          </label>

          <label className={fieldLabel}>
            <span className={fieldName}>Closed mode note</span>
            <textarea
              className={`${fieldInput} min-h-20 resize-y leading-6`}
              name="contactClosedNote"
              defaultValue={settings.contactClosedNote}
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 min-h-11 bg-[#eef0f1] px-5 text-[10px] font-bold text-[#111]"
        >
          Save settings
        </button>
      </form>
    </>
  );
}
