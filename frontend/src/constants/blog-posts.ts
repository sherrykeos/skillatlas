export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readingTime: string;
  tag: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "designing-effective-agentic-skills",
    title: "Designing Effective Agentic Skills: A Practical Guide",
    description: "How to structure prompts, tool schemas, and multi-file instructions so autonomous AI agents execute tasks reliably.",
    author: "Sharad & SkillAtlas Team",
    date: "Sep 2026",
    readingTime: "6 min read",
    tag: "Architecture",
  },
  {
    slug: "immutability-in-agent-marketplaces",
    title: "Why Immutability Matters in Agent Marketplaces",
    description: "Understanding prompt drifts and why immutable version releases are critical for deterministic AI workflows.",
    author: "SkillAtlas Engineering",
    date: "Aug 2026",
    readingTime: "4 min read",
    tag: "Reliability",
  },
  {
    slug: "multi-file-skills-vs-single-prompts",
    title: "Multi-File Skills vs. Monolithic System Prompts",
    description: "Moving beyond single markdown files to structured skill directories with Python scripts, JSON schemas, and golden evals.",
    author: "SkillAtlas Engineering",
    date: "Jul 2026",
    readingTime: "5 min read",
    tag: "Engineering",
  },
];

