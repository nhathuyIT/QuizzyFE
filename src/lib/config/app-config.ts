export const appConfig = {
  name: "Quizzy",
  description:
    "AI-powered flashcards and quizzes that adapt to you. Study less, remember more, and ace every exam.",
  keywords: ["quiz", "flashcards", "AI", "learning", "education", "spaced-repetition"],
  authors: [{ name: "Quizzy Team" }],
  urls: {
    website: "https://quizzy.app",
    documentation: "https://docs.quizzy.app",
    support: "https://support.quizzy.app",
    privacy: "https://quizzy.app/privacy",
    terms: "https://quizzy.app/terms",
  },
  social: {
    twitter: "https://twitter.com/quizzyapp",
    github: "https://github.com/quizzyapp",
    linkedin: "https://linkedin.com/company/quizzyapp",
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  quiz: {
    defaultStreak: 4,
    burstMilestones: [3, 6, 9, 12],
    burstLabels: {
      3: "On fire!",
      6: "Blazing!",
      9: "Unstoppable!",
      12: "Legendary!",
    } as Record<number, string>,
  },
} as const;
