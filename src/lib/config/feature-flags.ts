export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage?: number;
}

export const featureFlags: Record<string, FeatureFlag> = {
  QUIZ_DEMO: {
    key: "QUIZ_DEMO",
    enabled: true,
  },
  LIVE_LEARNERS: {
    key: "LIVE_LEARNERS",
    enabled: true,
  },
  SPEED_ROUNDS: {
    key: "SPEED_ROUNDS",
    enabled: true,
  },
  STUDY_GROUPS: {
    key: "STUDY_GROUPS",
    enabled: true,
  },
  OFFLINE_MODE: {
    key: "OFFLINE_MODE",
    enabled: true,
  },
  ADAPTIVE_ENGINE: {
    key: "ADAPTIVE_ENGINE",
    enabled: true,
  },
  AI_FLASHCRDS: {
    key: "AI_FLASHCRDS",
    enabled: true,
  },
  PROGRESS_DASHBOARD: {
    key: "PROGRESS_DASHBOARD",
    enabled: true,
  },
} as const;

export function isFeatureEnabled(key: string): boolean {
  const flag = featureFlags[key as keyof typeof featureFlags];
  return flag?.enabled ?? false;
}
