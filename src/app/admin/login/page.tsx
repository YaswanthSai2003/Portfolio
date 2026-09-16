import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/login-form";
import { adminAuthConfigured, isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");
  return (
    <main className="grid min-h-screen place-items-center bg-[#12151a] px-5 text-[#eef0f1]">
      <section className="w-full max-w-md">
        <p className="font-[var(--font-mono)] text-[8px] uppercase tracking-[0.14em] text-white/35">PRIVATE WORKSPACE</p>
        <h1 className="mt-4 font-[var(--font-display)] text-5xl font-semibold tracking-[-0.06em]">Portfolio OS</h1>
        <p className="mt-4 text-[12px] leading-6 text-white/45">Manage published work, resume versions, messages, media and site analytics.</p>
        {!adminAuthConfigured() ? <div className="mt-7 border border-[#d95239]/35 bg-[#d95239]/5 p-4 text-[11px] leading-6 text-white/55">Set <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code> in <code>.env.local</code> before using the admin workspace.</div> : <AdminLoginForm />}
      </section>
    </main>
  );
}
