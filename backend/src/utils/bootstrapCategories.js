import prisma from "../lib/prisma.js";

const DEFAULT_CATEGORIES = [
  {
    name: "Development",
    slug: "development",
    description: "Code generation, review, refactoring, and debugging skills for modern development workflows.",
  },
  {
    name: "Research",
    slug: "research",
    description: "Deep research, citation verification, academic synthesis, and structured report generators.",
  },
  {
    name: "Productivity",
    slug: "productivity",
    description: "Workflow optimization, task delegation, calendar automation, and executive briefing agents.",
  },
  {
    name: "Data Analysis",
    slug: "data-analysis",
    description: "SQL query optimization, data cleaning, statistical modeling, and visual insights pipelines.",
  },
  {
    name: "Design",
    slug: "design",
    description: "Design systems, UI component generation, typography scalers, and accessibility audits.",
  },
  {
    name: "Automation",
    slug: "automation",
    description: "Browser automation, API connectors, web scrapers, and headless orchestration tools.",
  },
  {
    name: "Business",
    slug: "business",
    description: "Market intelligence, competitive analysis, pitch deck formulation, and financial forecasting.",
  },
  {
    name: "Education",
    slug: "education",
    description: "Personalized tutoring, technical syllabus creation, concept explanations, and flashcard tools.",
  },
  {
    name: "Security",
    slug: "security",
    description: "Vulnerability detection, smart contract auditing, secrets scanning, and compliance checks.",
  },
  {
    name: "Writing",
    slug: "writing",
    description: "Technical writing, changelogs, API documentation, ghostwriting, and tone consistency.",
  },
  {
    name: "DevOps",
    slug: "devops",
    description: "CI/CD pipelines, Dockerfile generation, Kubernetes manifests, and infrastructure as code.",
  },
  {
    name: "Marketing",
    slug: "marketing",
    description: "Copywriting, SEO optimization, social campaigns, and growth experiment orchestration.",
  },
  {
    name: "Other",
    slug: "other",
    description: "Specialized utilities, custom domain tools, esoteric workflows, and experimental skills.",
  },
];

export async function bootstrapCategories() {
  try {
    const existingCount = await prisma.category.count();
    if (existingCount === 0) {
      for (const cat of DEFAULT_CATEGORIES) {
        await prisma.category.upsert({
          where: { slug: cat.slug },
          update: {},
          create: cat,
        });
      }
      console.log(`[Bootstrap] Seeded ${DEFAULT_CATEGORIES.length} default categories.`);
    }
  } catch (error) {
    console.error("[Bootstrap] Failed to synchronize categories:", error);
  }
}

