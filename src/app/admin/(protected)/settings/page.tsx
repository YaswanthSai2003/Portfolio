import {
  AdminPageHeader,
  fieldInput,
  fieldLabel,
  fieldName,
} from "@/components/admin/admin-ui";
import { SettingToggle } from "@/components/admin/setting-toggle";
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
        description="Edit portfolio identity, public links and contact behaviour. Project-specific links stay inside each project, while resumes are managed from Resume versions."
      />

      {!hasSupabase() ? (
        <p className="mt-6 border border-white/8 p-4 text-[10px] leading-5 text-white/38">
          Settings writes require Supabase. Current values are coming from code / environment fallbacks.
        </p>
      ) : null}

      <form
        action={saveSettingsAction}
        className="mt-8 max-w-4xl border-t border-white/14"
      >
        <div className="grid md:grid-cols-2">
          <label
            className={`${fieldLabel} md:border-r md:border-white/8 md:pr-6`}
          >
            <span className={fieldName}>Full name</span>
            <input
              className={fieldInput}
              name="fullName"
              defaultValue={settings.fullName}
              required
            />
          </label>

          <label className={`${fieldLabel} md:pl-6`}>
            <span className={fieldName}>Navbar brand</span>
            <input
              className={fieldInput}
              name="brandName"
              defaultValue={settings.brandName}
              required
            />
          </label>
        </div>

        <label className={fieldLabel}>
          <span className={fieldName}>Role</span>
          <input
            className={fieldInput}
            name="role"
            defaultValue={settings.role}
          />
        </label>

        <label className={fieldLabel}>
          <span className={fieldName}>Hero headline</span>
          <input
            className={fieldInput}
            name="heroTitle"
            defaultValue={settings.heroTitle}
          />
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
          <input
            className={fieldInput}
            name="availability"
            defaultValue={settings.availability}
          />
        </label>

        <div className="mt-12 border-t border-white/14 pt-8">
          <p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.13em] text-white/32">
            PUBLIC LINKS
          </p>

          <h2 className="mt-2 font-[var(--font-display)] text-[30px] font-semibold tracking-[-0.05em]">
            Profiles & contact
          </h2>

          <p className="mt-3 max-w-2xl text-[11px] leading-6 text-white/42">
            These values are stored in site_settings and used across the public portfolio. Leave an optional link empty to hide it. Resume files are managed separately from the Resume section.
          </p>

          <div className="mt-5 grid md:grid-cols-2">
            <label
              className={`${fieldLabel} md:border-r md:border-white/8 md:pr-6`}
            >
              <span className={fieldName}>GitHub profile</span>
              <input
                className={fieldInput}
                name="githubUrl"
                type="url"
                placeholder="https://github.com/username"
                defaultValue={settings.githubUrl}
              />
            </label>

            <label className={`${fieldLabel} md:pl-6`}>
              <span className={fieldName}>LinkedIn profile</span>
              <input
                className={fieldInput}
                name="linkedinUrl"
                type="url"
                placeholder="https://www.linkedin.com/in/..."
                defaultValue={settings.linkedinUrl}
              />
            </label>
          </div>

          <label className={fieldLabel}>
            <span className={fieldName}>Public contact email</span>
            <input
              className={fieldInput}
              name="email"
              type="email"
              placeholder="you@example.com"
              defaultValue={settings.email}
            />
          </label>

          <p className="mt-4 border border-white/8 p-4 text-[9px] leading-5 text-white/34">
            Resume URL is intentionally not editable here. Upload and activate the current PDF from Admin → Resume so the portfolio always points to the selected resume version.
          </p>
        </div>

        <div className="mt-12 border-t border-white/14 pt-8">
          <p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.13em] text-white/32">
            CONTACT BEHAVIOUR
          </p>

          <h2 className="mt-2 font-[var(--font-display)] text-[30px] font-semibold tracking-[-0.05em]">
            Public contact mode
          </h2>

          <p className="mt-3 max-w-2xl text-[11px] leading-6 text-white/42">
            Choose what visitors see in the contact section. Changing this does not affect messages already stored in the inbox.
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
                <strong className="mt-4 block text-[12px] text-white/82">
                  Contact form
                </strong>
                <span className="mt-2 block text-[10px] leading-5 text-white/36">
                  Show the form. Verification and notifications are controlled below.
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
                <strong className="mt-4 block text-[12px] text-white/82">
                  Direct contact
                </strong>
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
                <strong className="mt-4 block text-[12px] text-white/82">
                  Not accepting enquiries
                </strong>
                <span className="mt-2 block text-[10px] leading-5 text-white/36">
                  Hide submission options and show an availability status instead.
                </span>
              </span>
            </label>
          </div>

          <div className="mt-8 border-t border-white/10 pt-7">
            <p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.13em] text-white/32">
              FORM DELIVERY
            </p>

            <h3 className="mt-2 font-[var(--font-display)] text-[24px] font-semibold tracking-[-0.045em]">
              Verification & notifications
            </h3>

            <p className="mt-3 max-w-2xl text-[11px] leading-6 text-white/42">
              These settings apply only when Contact mode is Form. Verification and inbox notification emails can be controlled independently.
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <SettingToggle
                name="contactRequireVerification"
                title="Require email verification"
                description="Send an OTP to the visitor before accepting the message."
                defaultChecked={settings.contactRequireVerification}
              />

              <SettingToggle
                name="contactNotifyByEmail"
                title="Notify me by email"
                description="Send a copy of each accepted message to your contact inbox."
                defaultChecked={settings.contactNotifyByEmail}
              />
            </div>

            <div className="mt-4 grid gap-2 border border-white/8 p-4 text-[9px] leading-5 text-white/34 sm:grid-cols-2">
              <span>Verification ON + notification OFF → 1 email</span>
              <span>Verification ON + notification ON → 2 emails</span>
              <span>Verification OFF + notification ON → 1 email</span>
              <span>Verification OFF + notification OFF → 0 emails</span>
            </div>
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
          className="mt-6 min-h-11 bg-[#eef0f1] px-5 text-[10px] font-bold text-[#111] transition hover:bg-white"
        >
          Save settings
        </button>
      </form>
    </>
  );
}
