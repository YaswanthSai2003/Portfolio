export type ArchitectureNode = {
  label: string;
  description?: string;
};

export type ProjectGalleryItem = {
  label: string;
  description?: string;
  image: string;
  alt: string;
};

export type ProjectCaseStudy = {
  overview: string;
  problem: string;
  approach: string;
  engineering: string[];
  decisions?: { title: string; copy: string }[];
};

export type Project = {
  id?: string;
  slug: string;
  title: string;
  type: string;
  summary: string;
  result: string;
  year: string;
  role?: string;
  stack: string[];
  visual: "gallery" | "architecture" | "screenshot";
  visualLabel?: string;
  coverImage?: string;
  gallery?: ProjectGalleryItem[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  status?: "draft" | "published" | "archived";
  sortOrder?: number;
  architecture?: {
    eyebrow: string;
    nodes: ArchitectureNode[];
  };
  caseStudy: ProjectCaseStudy;
};

const averlenLiveUrl = process.env.NEXT_PUBLIC_AVERLEN_LIVE_URL || "https://averlen.app";

export const projects: Project[] = [
  {
    slug: "averlen",
    title: "Averlen",
    type: "Product engineering",
    role: "Product design · Full-stack engineering",
    summary:
      "Revenue intelligence for hospitality teams — from booking ingestion to analytics, pricing workflows and AI-assisted insights.",
    result:
      "Designed and built the product end to end across multi-tenant data, analytics, access control, caching, pricing and AI workflows.",
    year: "2026",
    stack: ["React", "TypeScript", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    visual: "gallery",
    visualLabel: "Revenue analytics",
    coverImage: "/projects/averlen-overview-2026.png",
    gallery: [
      {
        label: "Overview",
        description:
          "Revenue overview across the demo portfolio with bookings, average value, booked nights and city performance.",
        image: "/projects/averlen-overview-2026.png",
        alt: "Averlen revenue overview dashboard",
      },
      {
        label: "Pricing",
        description:
          "Portfolio-level pricing workspace for comparing booking signals and explainable recommendations.",
        image: "/projects/averlen-pricing-2026.png",
        alt: "Averlen pricing dashboard",
      },
      {
        label: "Analytics",
        description:
          "Revenue analytics with configurable ranges, performance views and trend visualisation.",
        image: "/projects/averlen-analytics-2026.png",
        alt: "Averlen analytics dashboard",
      },
    ],
    githubUrl:
      process.env.NEXT_PUBLIC_AVERLEN_GITHUB_URL ||
      "https://github.com/YaswanthSai2003/Averlen",
    liveUrl: averlenLiveUrl || undefined,
    featured: true,
    status: "published",
    sortOrder: 1,
    caseStudy: {
      overview:
        "Averlen is a multi-tenant revenue intelligence product for hospitality teams. It brings data ingestion, analytics, pricing workflows and AI-assisted insight into one system.",
      problem:
        "Revenue and operating data is often fragmented across spreadsheets and tools, making it difficult to understand performance quickly or make consistent pricing decisions.",
      approach:
        "I designed the product around a secure multi-tenant backend, structured ingestion jobs, analytics APIs, pricing workflows and a frontend that keeps the most important decisions close to the data.",
      engineering: [
        "Multi-tenant organization isolation",
        "JWT authentication and role-based access",
        "CSV preview, mapping and ingestion jobs",
        "Revenue, occupancy and property analytics",
        "Redis caching and production readiness",
        "Pricing recommendations and AI-assisted insights",
      ],
      decisions: [
        {
          title: "Separate preview from mutation",
          copy: "Pricing previews are read-only. Generating or saving a recommendation is a separate operation, so exploration never creates history accidentally.",
        },
        {
          title: "Enforce tenant boundaries in the backend",
          copy: "Organization scope is applied at the service/API boundary instead of relying on frontend filtering.",
        },
      ],
    },
  },
  {
    slug: "pr-review-agent",
    title: "PR Review Agent",
    type: "AI engineering",
    role: "System design · AI engineering",
    summary:
      "An automated pull-request review system designed to keep feedback valid even when the branch changes during analysis.",
    result:
      "Combines deterministic checks, specialist review workers and a final validator before publishing comments back to the pull request.",
    year: "2026",
    stack: ["Python", "FastAPI", "Claude", "GitHub", "Pytest"],
    visual: "architecture",
    visualLabel: "Review workflow",
    githubUrl: process.env.NEXT_PUBLIC_PR_REVIEW_GITHUB_URL || undefined,
    liveUrl: process.env.NEXT_PUBLIC_PR_REVIEW_LIVE_URL || undefined,
    featured: false,
    status: "archived",
    sortOrder: 99,
    architecture: {
      eyebrow: "PULL REQUEST / REVIEW PIPELINE",
      nodes: [
        { label: "Pull request", description: "New or updated code" },
        { label: "Revision snapshot", description: "Pin the exact revision" },
        { label: "Review workers", description: "Security · correctness · tests · maintainability" },
        { label: "Validator", description: "Reject weak, duplicate or stale findings" },
        { label: "Publish", description: "Feedback valid for current code" },
      ],
    },
    caseStudy: {
      overview:
        "A review agent designed around a production problem: pull requests can change while automated analysis is still running.",
      problem:
        "If another commit lands mid-review, generated comments can point at code that moved, was renamed or no longer exists.",
      approach:
        "The workflow snapshots the revision, runs specialist workers, validates the combined findings and checks the branch again before feedback is published.",
      engineering: [
        "Four specialist review workers plus a validator",
        "Revision tracking and stale-comment handling",
        "Deterministic checks before model reasoning",
        "Structured outputs and schema validation",
        "Evaluation cases for production-style failures",
      ],
      decisions: [
        {
          title: "Deterministic checks first",
          copy: "Facts that can be established with static checks should not depend on model interpretation. The model is reserved for reasoning-heavy review work.",
        },
        {
          title: "Validate before publishing",
          copy: "A final validator removes duplicate, unsupported or stale findings before anything reaches the pull request.",
        },
      ],
    },
  },
  {
    slug: "object-detection",
    title: "Object Detection",
    type: "Applied machine learning",
    role: "Model training · Evaluation",
    summary:
      "A computer-vision workflow using Faster R-CNN for object localisation, classification and detection evaluation.",
    result:
      "Covers dataset preparation, model training, bounding-box inference and mean average precision evaluation.",
    year: "2026",
    stack: ["PyTorch", "Faster R-CNN", "TorchMetrics", "Python"],
    visual: "architecture",
    visualLabel: "ML pipeline",
    githubUrl:
      process.env.NEXT_PUBLIC_OBJECT_DETECTION_GITHUB_URL ||"",
    featured: false,
    status: "published",
    sortOrder: 4,
    architecture: {
      eyebrow: "COMPUTER VISION / MODEL PIPELINE",
      nodes: [
        { label: "Dataset", description: "Images + labelled boxes" },
        { label: "Preprocess", description: "Training-ready samples" },
        { label: "Faster R-CNN", description: "Detection model" },
        { label: "Inference", description: "Classes + bounding boxes" },
        { label: "mAP", description: "Detection evaluation" },
      ],
    },
    caseStudy: {
      overview:
        "An applied computer-vision project focused on the complete object-detection workflow rather than only running inference.",
      problem:
        "Object detection has to identify both what an object is and where it appears, which requires different targets and evaluation from simple image classification.",
      approach:
        "I prepared detection data, trained Faster R-CNN, visualised predictions and evaluated model quality using detection metrics such as mean average precision.",
      engineering: [
        "Detection dataset preparation",
        "Faster R-CNN training",
        "Bounding-box inference",
        "Confidence filtering and visualisation",
        "TorchMetrics evaluation",
      ],
    },
  },
  {
    slug: "reading-platform",
    title: "Reading Platform",
    type: "Backend platform",
    role: "API design · Security · Data modelling",
    summary:
      "A backend-first reading platform with accounts, reading lists, reviews and administrative workflows.",
    result:
      "Combines secure authentication, permissions, pagination, rate limiting and user-content rules in a structured REST API.",
    year: "2026",
    stack: ["Node.js", "Express", "PostgreSQL", "Redis", "JWT"],
    visual: "architecture",
    visualLabel: "Backend architecture",
    githubUrl:
      process.env.NEXT_PUBLIC_READING_PLATFORM_GITHUB_URL ||
      "https://github.com/YaswanthSai2003/BookApi",
    featured: true,
    status: "published",
    sortOrder: 2,
    architecture: {
      eyebrow: "BACKEND / APPLICATION FLOW",
      nodes: [
        { label: "Client", description: "Books, lists and reviews" },
        { label: "REST API", description: "Application workflows" },
        { label: "Auth + RBAC", description: "Identity and permissions" },
        { label: "PostgreSQL", description: "Primary relational data" },
        { label: "Redis", description: "Token and cache workflows" },
      ],
    },
    caseStudy: {
      overview:
        "A reading platform built around secure account and content-management workflows.",
      problem:
        "A reading-list application becomes significantly more complex once authentication, permissions, reviews, pagination and account security are introduced.",
      approach:
        "The platform separates admin and user responsibilities while keeping authentication, refresh tokens, reading lists and review workflows cleanly separated in the API.",
      engineering: [
        "JWT access and refresh flow",
        "Role-based permissions",
        "Server-side pagination",
        "Authentication rate limiting",
        "Reading-list and review constraints",
        "Password reset workflow",
      ],
    },
  },
  {
    slug: "compliance-tracker",
    title: "Compliance Tracker",
    type: "Full-stack application",
    role: "Product engineering",
    summary:
      "A responsive compliance workspace for clients, tasks, deadlines, filtering and lightweight analytics.",
    result:
      "Built the end-to-end task workflow with a React frontend and Node/Express API, then deployed it as a production web app.",
    year: "2026",
    stack: ["React", "Node.js", "Express", "PostgreSQL", "Prisma", "Recharts"],
    visual: "architecture",
    featured: true,
    status: "published",
    sortOrder: 3,
    githubUrl: "https://github.com/YaswanthSai2003/Mini-compliance-tracker",
    liveUrl: "https://mini-compliance-tracker-1ka1.vercel.app/",
    caseStudy: {
      overview:
        "A compact full-stack compliance tracker built around client work, task status, deadlines and responsive day-to-day usage.",
      problem:
        "Compliance work becomes difficult to scan once tasks are spread across clients and due dates without a clear view of priority and status.",
      approach:
        "I built a responsive client/task workflow with filters, CRUD actions, overdue states and analytics, backed by a Node/Express API.",
      engineering: ["Responsive React UI", "Task CRUD", "Filtering and search", "Analytics", "Deployment"],
    },
  },
  {
    slug: "finance-dashboard",
    title: "Finance Dashboard",
    type: "Frontend product UI",
    role: "Frontend engineering",
    summary:
      "An executive-style finance workspace for overview metrics, transactions, insights and role-aware views.",
    result:
      "Built a polished responsive interface with state management and data visualisation for a finance-oriented product brief.",
    year: "2026",
    stack: ["React", "Vite", "Tailwind", "Recharts", "Zustand"],
    visual: "screenshot",
    featured: false,
    status: "published",
    sortOrder: 6,
    githubUrl: process.env.NEXT_PUBLIC_FINANCE_DASHBOARD_GITHUB_URL || undefined,
    liveUrl: process.env.NEXT_PUBLIC_FINANCE_DASHBOARD_LIVE_URL || "https://finance-dashboard-five-beige.vercel.app/",
    caseStudy: {
      overview:
        "A frontend-focused finance dashboard designed around hierarchy, responsive layout and clear data visualisation.",
      problem:
        "Financial interfaces can become dense quickly, so the challenge was to keep key metrics, transactions and insights readable without flattening the information hierarchy.",
      approach:
        "I structured the experience around a clear overview, transaction detail, financial insights and role-aware interactions, using reusable React components and lightweight state management.",
      engineering: ["Responsive layout", "Reusable UI components", "Zustand state", "Recharts visualisation", "Role-aware views"],
    },
  },
  {
    slug: "smart-bookmarks",
    title: "Smart Bookmarks",
    type: "Next.js application",
    role: "Full-stack product engineering",
    summary:
      "A private bookmark manager with Google OAuth, Supabase Row Level Security and real-time cross-tab updates.",
    result:
      "Built authentication, per-user data isolation and real-time bookmark synchronisation using Next.js and Supabase.",
    year: "2026",
    stack: ["Next.js", "Supabase", "PostgreSQL", "OAuth", "Realtime"],
    visual: "architecture",
    featured: false,
    status: "published",
    sortOrder: 7,
    githubUrl: process.env.NEXT_PUBLIC_SMART_BOOKMARKS_GITHUB_URL || undefined,
    liveUrl: process.env.NEXT_PUBLIC_SMART_BOOKMARKS_LIVE_URL || undefined,
    caseStudy: {
      overview:
        "A focused full-stack app for saving private bookmarks and keeping them synchronised across sessions.",
      problem:
        "The interesting engineering work is not the bookmark form itself; it is authentication, data isolation and keeping UI state consistent when the same account is open in multiple tabs.",
      approach:
        "I used Google OAuth, Supabase Row Level Security and realtime database subscriptions so each user sees only their own data and changes propagate without a page refresh.",
      engineering: ["Google OAuth", "Row Level Security", "Realtime subscriptions", "Private per-user data", "Next.js App Router"],
    },
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
