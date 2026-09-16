import { siteConfig } from "@/data/site";
import { GitHubIcon, LinkedInIcon } from "./icons";

type Props = {
  compact?: boolean;
  className?: string;
  githubUrl?: string;
  linkedinUrl?: string;
};

const base =
  "group inline-flex items-center gap-2 text-[12px] font-semibold text-black/52 transition-colors hover:text-black dark:text-white/52 dark:hover:text-white";

export function SocialLinks({ compact = false, className = "", githubUrl, linkedinUrl }: Props) {
  const github = githubUrl || siteConfig.githubUrl;
  const linkedin = linkedinUrl ?? siteConfig.linkedinUrl;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <a
        href={github}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub profile"
        title="GitHub"
        className={compact ? "grid size-8 place-items-center text-black/48 transition hover:text-black dark:text-white/48 dark:hover:text-white" : base}
      >
        <GitHubIcon className={compact ? "size-[17px]" : "size-[18px]"} />
        {!compact ? <span>GitHub ↗</span> : null}
      </a>
      {linkedin ? (
        <a
          href={linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn profile"
          title="LinkedIn"
          className={compact ? "grid size-8 place-items-center text-black/48 transition hover:text-black dark:text-white/48 dark:hover:text-white" : base}
        >
          <LinkedInIcon className={compact ? "size-[17px]" : "size-[18px]"} />
          {!compact ? <span>LinkedIn ↗</span> : null}
        </a>
      ) : null}
    </div>
  );
}
